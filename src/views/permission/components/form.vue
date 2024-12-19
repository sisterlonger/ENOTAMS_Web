<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="描述" prop="desc" :validate-icon="validateIcon">
                <tiny-input v-model="createData.desc"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="权限名" prop="permissionName">
                <tiny-input v-model="createData.permissionName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
                <tiny-button  @click="resetForm"> 重置 </tiny-button>
            </tiny-form-item>
        </tiny-form>
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
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryPermissionDetail, postPermission } from '@/api/fetchInterface';


const props = defineProps({
    permissionID: Number,
});
const { permissionID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    permissionID: null,
    desc: '',
    permissionName: '',
})
const rules = ref({
    desc: [{ required: true, message: '必填', trigger: 'change' }],
    permissionName: [{ required: false, message: '必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});


// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryPermissionDetail({ id: permissionID.value });
        createData.permissionID = data.permissionID;
        createData.desc = data.desc;
        createData.permissionName = data.permissionName;
    } 
    catch (err) {
        Modal.alert('获取数据错误');
        emit('close');
      }
    finally {
        state.loading.close();
    }
};

// 初始化请求数据
onMounted(async () => {
    if (permissionID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postPermission(createData);
            emit('close');
        } else {
            Modal.alert('提交失败!');
        }
    })
}



function resetForm() {
    ruleFormRef.value.resetFields()
}
</script>

<style scoped>
.demo-form {
    width: 450px;
}
</style>