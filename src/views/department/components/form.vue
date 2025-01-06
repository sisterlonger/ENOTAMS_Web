<template>
    <div class="demo-form">
        <tiny-form v-if="preCondition" ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item v-if="createData.fullName" label="全称" prop="fullName">
                <tiny-input v-model="createData.fullName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门名" prop="depName">
                <tiny-input v-model="createData.depName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="createData.fullName" label="专业" prop="field">
                <tiny-input v-model="createData.field"></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
                <tiny-button type="success" @click="addChild()">
                    新增子节点
                </tiny-button>
                <tiny-button type="danger" @click="onDelete()">
                    删除节点
                </tiny-button>
            </tiny-form-item>
        </tiny-form>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
            <Child :parentDep="createData" @close="dialogClose" />
        </tiny-dialog-box>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, defineEmits } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric,
    DialogBox as TinyDialogBox, Notify,
} from '@opentiny/vue';
import { iconWarning } from '@opentiny/vue-icon';
import { queryDepartmentDetail, postDepartment, deleteDepartment } from '@/api/fetchInterface';
import Child from './child.vue';

const props = defineProps({
    depID: Number,
});
const { depID } = toRefs(props);
const ruleFormRef = ref();
const boxVisibility = ref(false)
const preCondition = ref(false);
const validateIcon = ref(iconWarning())
const createData = reactive({
    depID: null,
    depName: '',
    field: '',
    parentDepID: "",
    depCode: "",
    parentDepCode: "",
    grade: 0,
    fullName: "",
})
const rules = ref({
    depName: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    field: [
        { required: false, message: '必填', trigger: 'blur' },
    ],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});


// 请求数据接口方法
const fetchData = async () => {
    /*
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });*/
    try {
        const { data } = await queryDepartmentDetail({ id: depID.value });
        Object.assign(createData, data);
        createData.fullName = data.fullName || data.depName;
    }
    catch (err) {
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
};

watch(
    depID,
    (newValue) => {
        if (depID != null && depID.value !== 0) {
            fetchData();
            preCondition.value = true;
        }
        else {
            preCondition.value = false;
        }

    },
    { immediate: true, }
);


// 关闭弹窗
function dialogClose() {
    boxVisibility.value = false;
    emit('query');
}
// 初始化请求数据
onMounted(async () => {
    if (depID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close', 'query']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid: any) => {
        if (valid) {
            if (createData.fullName.split("-").pop() !== createData.depName) {
                let strArr = createData.fullName.split("-");
                let font = strArr.slice(0, strArr.length - 1).join("-");
                createData.fullName = `${font}-${createData.depName}`;
            }
            await postDepartment(createData);
            Modal.alert('提交成功!');
            fetchData();
        } else {
            Modal.alert('提交失败!');
        }
    })
}

function addChild() {
    boxVisibility.value = true;
}
async function onDelete() {
    Modal.confirm('您确定要删除吗？').then(async () => {
        let ids = [depID.value];
        await deleteDepartment(ids);
        emit('query');
    });
}


</script>

<style scoped>
.demo-form {
    width: 450px;
}
</style>