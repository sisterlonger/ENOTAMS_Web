<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="审批意见" prop="approveDesc">
                <tiny-input v-model="createData.approveDesc"></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit(true)">
                    同意
                </tiny-button>
                <tiny-button type="info" @click="handleSubmit(false)">
                    拒绝
                </tiny-button>
            </tiny-form-item>
        </tiny-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, defineEmits } from 'vue'
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
import { isEmpty } from '@/utils/string-utils';
import { SubmitWorkflowAudit } from '@/api/fetchInterface';
import workflowaxios from '@/views/workflow/components/workflow-axios';


const props = defineProps({
    processInstanceId: String,
    flowId: String,
    taskId: String,
});

const paramMap = reactive({})
const createData = reactive({
    approveDesc: "",
})
const rules = ref({
    approveDesc: [{ required: true, message: '必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});


// 初始化请求数据
onMounted(async () => {
});


// 定义派发事件
const emit = defineEmits(['close']);

async function handleSubmit(approveState: boolean) {
    if(isEmpty(createData.approveDesc)){
        Modal.alert('请填写审批意见！');
        return;
    }
    // 构建请求参数
    const auditRequest = {
        flowId: props.flowId,
        processInstanceId: props.processInstanceId,
        taskId: props.taskId,
        approveDesc: createData.approveDesc,
        approveResult: approveState,
        authUserId: workflowaxios.defaults.headers.common.AuthUserId,
        authorization: workflowaxios.defaults.headers.common.Authorization,
        flyflowTenantId: workflowaxios.defaults.headers.common.FlyflowTenantId || "1"
    }

    try {
        await SubmitWorkflowAudit(auditRequest).then(async (res: any) => {
            if(res.code === 200){
                Modal.alert('操作成功！');
            }
            else{
                Modal.alert('操作失败！');
            }
            console.log(res)
            emit('close');
        }).catch((err: any) => {
            console.log(err)
            Modal.alert(`操作失败！报错${err}`);
        });
    } catch (error) {
        console.error("提交失败:", error);
    }
    //emit('close');
}

</script>

<style scoped></style>