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
import { queryMessageDetail } from '@/api/fetchInterface';
import workflowaxios from '@/views/workflow/components/workflow-axios';


const props = defineProps({
    processInstanceId: String,
    flowId: String,
    taskId: String,
});

const ruleFormRef = ref()
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


// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    console.log("flowId",props.flowId,props.processInstanceId,props.taskId);
    try {
        await workflowaxios.post('/form/getFormDetail', {
            flowId:props.flowId,
            processInstanceId:props.processInstanceId,
            taskId:props.taskId,
        }).then(async (res1: any) => {
            console.log("res1", res1);
            let workflowFormList = res1.data.data.formList;
            // 获取名为超链接的，并且附上templateId和messageid构建的链接
            let consultationNumber = workflowFormList.find((item: any) => item.name === "会商数量");
            let examineNumber = workflowFormList.find((item: any) => item.name === "审批部门数量");
            let consultationDep = workflowFormList.find((item: any) => item.name === "需要会签的部门");
            let leaderDep = workflowFormList.find((item: any) => item.name === "收集领导所在的部门");
            let examineDep = workflowFormList.find((item: any) => item.name === "需要审批的情报部门");
            let examineLeaderDep = workflowFormList.find((item: any) => item.name === "情报领导所在的部门");
            let link = workflowFormList.find((item: any) => item.name === "超链接");
            let map = {
                [consultationNumber.id]: consultationNumber.props.value,
                [consultationDep.id]: consultationDep.props.value,
                [leaderDep.id]: leaderDep.props.value,
                [examineNumber.id]: examineNumber.props.value,
                [examineDep.id]: examineDep.props.value,
                [examineLeaderDep.id]: examineLeaderDep.props.value,
                [link.id]: link.props.value,
            };
            Object.assign(paramMap, map);
        })

    }
    catch (err) {
        Modal.alert(`获取数据错误,原因如下：${err}`);
        emit('close');
    }
    finally {
        state.loading.close();
    }
};

// 初始化请求数据
onMounted(async () => {
    fetchData();
});


// 定义派发事件
const emit = defineEmits(['close']);

async function handleSubmit(approveState: boolean) {
    // 请求flyflow接口
    let completeProcessVM = {
        approveDesc: createData.approveDesc,
        approveResult: approveState,
        taskId:props.taskId,
        processInstanceId:props.processInstanceId,
        paramMap,
    }
    await workflowaxios.post('/task/completeTask', completeProcessVM).then(async (res1: any) => {
        console.log("res1",res1);
        if (res1.data.ok) {
            Modal.alert('操作成功');
            emit('close');
        }
        else {
            Modal.alert('操作失败');
        }
    })
    emit('close');
}

</script>

<style scoped></style>