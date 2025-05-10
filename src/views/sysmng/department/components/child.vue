<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="全称" prop="fullName">
                <tiny-input v-model="fullName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门名" prop="depName">
                <tiny-input v-model="createData.depName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="专业" prop="field">
                <tiny-input v-model="createData.field"></tiny-input>
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
import { ref, reactive, onMounted, toRefs, watch, defineEmits, computed } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import {  postDepartment } from '@/api/fetchInterface';
import { useWorkFlowStore } from '@/store';
import workflowaxios from '@/views/workflow/components/workflow-axios';


const props = defineProps({
    parentDep: Object,
});
const { parentDep } = toRefs(props);

const ruleFormRef = ref()
const userWorkFlowStore = useWorkFlowStore();
const createData = reactive({
    depID: null,
    depName: '',
    field: '',
    parentDepID: parentDep.value.depID,
    depCode: "",
    parentDepCode: "",
    grade: parentDep.value.grade + 1,
    fullName: "",
})
const fullName = computed(() => {
    return `${parentDep.value.fullName}-${createData.depName}`
})
const rules = ref({
    dicType: [{ required: true, message: '必填', trigger: 'change' }],
    dicKey: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    dicValue: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    orderID: { type: 'number', min: 0, message: '排序号必须大于0', trigger: ['change', 'blur'] },
    dicDescription: [{ required: false, message: '非必填', trigger: 'change' }],
    moduleName: [{ required: false, message: '非必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});



// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            createData.fullName = fullName;
            await postDepartment(createData).then(res=>{
                workflowaxios.defaults.headers.common = {
                    'Flyflow-Tenant-Id': '1',
                    'AuthUserId': userWorkFlowStore.user.loginId,
                    "Authorization": userWorkFlowStore.user.tokenValue,
                }
                let deptData = {
                    id: String(res.data),
                    // 部门id路径，从根到当前叶的父级
                    //rootIdList: res.data.rootIdList,
                    parentId: String(createData.parentDepID),
                    name: createData.depName,
                    // todo直属领导
                    leaderUser: [],
                    status: "1",
                    sort: 1,
                    weight: 1,
                }
                workflowaxios.post('/dept/create',  deptData ).then((res1) => {
                    if (res1.data.ok === false) {
                        Modal.alert('提交失败!');
                    }
                    else {
                        Modal.alert('提交成功!');
                    }
                });
            });
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
</style>