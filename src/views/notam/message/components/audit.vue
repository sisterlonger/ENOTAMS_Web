<template>
    <div class="demo-form" v-if="preCondition">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="150px" overflow-title style="margin-top: 20px;">
            <tiny-form-item v-if="addSignature" label="加批领导：">
                <template #label>
                    <tiny-tooltip type="info" content="加批领导提供意见后方可继续" placement="top">
                        <div>加批领导：<tiny-icon-help-solid class="IconHelpSolid"></tiny-icon-help-solid></div>
                    </tiny-tooltip>
                </template>
                <tiny-cascader ref="cascaderLeaderRef" v-model="leaderNodes" :options="departmentTreeData"
                    placeholder="需加批领导请选择" filterable clearable :props="{
                        children: 'children',
                        value: 'userID',
                        label: 'userName',
                        disabled: 'disabled',
                        emitPath: false,
                        multiple: true
                    }" @change="onChangeLeaderNodeList"></tiny-cascader>
            </tiny-form-item>
            <tiny-form-item v-if="showTwoPerson" label="紧急情况下，跳过双岗制审批请点击关闭" prop="showTwoPerson">
                <tiny-switch v-model="createData.isTwoPerson"></tiny-switch>
            </tiny-form-item>
            <tiny-form-item v-if="showAftnSn" label="通告号" prop="aftnSn">
                <tiny-input v-model="createData.aftnSn" placeholder="请输入通告号"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="意见" prop="approveDesc">
                <tiny-input v-model="createData.approveDesc" placeholder="请填写意见"></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button v-if="nodeName !=='情报值班人员审批'"  type="primary" :disabled="leaderNodes.length > 0" @click="handleSubmit(true)">
                    {{ nodeName === '原始资料经办人' || nodeName === "原始资料经办人加签处理1" || nodeName === "原始资料经办人加签处理2" ? "送情报审批" :
                        "通过" }}
                </tiny-button>
                <tiny-button v-if="addSignature" type="warning" :disabled="leaderNodes.length === 0"
                    @click="handleSubmit(true)">
                    加批
                </tiny-button>
                <tiny-button type="info" @click="close">
                    取消
                </tiny-button>
                <!--当节点为情报值班人员审批时，显示，并且将通过按钮隐藏，实际上你可以理解成按钮转移到这里-->
                <tiny-button v-if="nodeName ==='情报值班人员审批'"  style="margin-left: 40%;" type="danger" @click="handleSubmit(false)">
                    特殊情况下，先发布后审批
                </tiny-button>
                <tiny-button v-if="isInitiator"  style="margin-left: 40%;" type="danger" @click="handleSubmit(false)">
                    终止流程，慎用！
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
    TinyCascader, TinySwitch
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { isEmpty } from '@/utils/string-utils';
import { useUserStore } from '@/store';
import { SubmitWorkflowAudit, queryUserTreeList, queryGetWorkflowProgress } from '@/api/fetchInterface';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import node from '@/router/routes/modules/node';


const props = defineProps({
    processInstanceId: String,
    flowId: String,
    taskId: String,
    isInitiator: Boolean,
    isRecipient: Boolean,
    // 当前节点名称
    nodeName: String,
    messageId: Number,
});
const userStore = useUserStore();
const departmentTreeData = ref([]);
const leaderNodes = ref([]);
const cascaderLeaderRef = ref();
const leaderNodeList = ref([]);

const preCondition = ref(false);
const paramMap = reactive({})
const createData = reactive({
    approveDesc: "",
    // 是否双岗
    isTwoPerson: true,
    // 通告序列号
    aftnSn: '',
})
// 双岗显示标识
const showTwoPerson = ref(false);
// 通告序列号显示标识
const showAftnSn = ref(false);
// 加签显示标识
const addSignature = ref(false);
const nodeNameList = ref(["原始资料经办人", "原始资料经办人加签处理1", "情报值班人员审批", "情报值班人员加签处理1"])
const rules = ref({
    approveDesc: [{ required: true, message: '必填', trigger: 'change' }],
    aftnSn: [{ required: true, message: '必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});


// 初始化请求数据
onMounted(async () => {
    const { data } = await queryUserTreeList();
    console.log(data, props.nodeName);
    departmentTreeData.value = data.children;
    if ((props.isInitiator || props.isRecipient) && nodeNameList.value.includes(props.nodeName)) {
        addSignature.value = true;
    }
    if (props.isRecipient && props.nodeName === "确定可发布") {
        showTwoPerson.value = true;
    }
    console.log(props.isRecipient, props.nodeName);
    if (props.isRecipient && props.nodeName === "发布，输入通告号") {
        showAftnSn.value = true;
    }
    preCondition.value = true;
});



// 定义派发事件
const emit = defineEmits(['close']);


const onChangeLeaderNodeList = () => {
    let checkVal = cascaderLeaderRef.value.getCheckedNodes(true);
    console.log(checkVal);
    leaderNodeList.value = checkVal.map((item: any) => { return { id: item.value, type: "user", name: item.label, parentId: item.parent.value, } })
    console.log(leaderNodeList.value, leaderNodeList.value.map(item => item.id).join(","))
}

async function handleSubmit(approveState: boolean) {
    if (isEmpty(createData.approveDesc)) {
        Modal.alert('请填写意见！');
        return;
    }
    console.log("通告号校验",isEmpty(createData.aftnSn) ,showAftnSn.value);
    if (isEmpty(createData.aftnSn) && showAftnSn.value) {
        Modal.alert('请填写通告号！');
        return;
    }
    // 处理加批数据！！！关键是识别步骤点目前在哪

    // 构建请求参数
    const auditRequest = {
        messageId: props.messageId,
        flowId: props.flowId,
        processInstanceId: props.processInstanceId,
        taskId: props.taskId,
        approveDesc: createData.approveDesc,
        approveResult: approveState,
        authUserId: workflowaxios.defaults.headers.common.AuthUserId,
        authorization: workflowaxios.defaults.headers.common.Authorization,
        flyflowTenantId: workflowaxios.defaults.headers.common.FlyflowTenantId || "1",
        leaderNodes: leaderNodeList.value.map(item => item.id).join(","),
        leaderParentNodes: [...new Set(leaderNodeList.value.map(item => item.parentId))].map(id => id / 10000).join(','),
        nodeName: props.nodeName,
        isTwoPerson: createData.isTwoPerson,
        aftnSn: createData.aftnSn
    }

    try {
        await SubmitWorkflowAudit(auditRequest).then(async (res: any) => {
            if (res.code === 200) {
                Modal.alert('操作成功！');
            }
            else {
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

function close() {
    emit('close');
}

</script>

<style scoped></style>