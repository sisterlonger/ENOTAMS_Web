<template>
    <div class="demo-timeline">
        <tiny-time-line :data="data" :active="2" vertical shape="dot"></tiny-time-line>
        <div>关联通告列表</div>
        <tiny-grid v-if="preCondition" ref="basicGridRef" :data="tableData">
            <tiny-grid-column type="index" width="60"></tiny-grid-column>
            <tiny-grid-column v-if="false" type="selection" width="60"></tiny-grid-column>
            <tiny-grid-column field="qCode" title="Q码" width="120"></tiny-grid-column>
            <tiny-grid-column field="telegramText" title="内容"></tiny-grid-column>
            <tiny-grid-column field="status" title="与当前通知单关系" width="200"></tiny-grid-column>
            <tiny-grid-column field="taskAssignShow" title="当前处理人" width="200"></tiny-grid-column>
            <tiny-grid-column title="操作" width="100" align="center">
                <template #default="data">
                    <tiny-button size="mini" type="primary" @click="queryRowEvent(data.row, '详情')">详情</tiny-button>
                </template>
            </tiny-grid-column>
        </tiny-grid>
        <!--已有流程的notice-->
        <!-- <tiny-dialog-box :modal="false" v-if="workflowVisibility" v-model:visible="workflowVisibility" title="详情"
          width="80%" max-height="1000px" top="5%" :close-on-click-modal="true">
          <notice :messageId="messageId" :templateID="templateId" :processInstanceId="processInstanceId"
            :flowId="flowId" :taskId="taskId" :act="act" @close="dialogClose" />
        </tiny-dialog-box> -->
        <!--新增的关联通告-->
        <!-- <tiny-dialog-box :modal="false" v-if="addVisibility" v-model:visible="addVisibility" title="详情" width="80%"
          max-height="1000px" top="5%" :close-on-click-modal="true">
          <enotam :messageId="messageId" :templateID="templateId" :parentId="parentId" :messageType="messageType" :act="act" @close="dialogClose" />
        </tiny-dialog-box> -->

        <!--先这样，用export应付，后续再用notice-->
        <tiny-dialog-box :modal="false" v-if="workflowVisibility" v-model:visible="workflowVisibility" title="详情"
            width="80%" max-height="1000px" top="5%" :close-on-click-modal="true">
            <exportMessage :formData="formData" :act="'detail'" />
        </tiny-dialog-box>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, defineProps, onMounted,defineEmits } from 'vue'
import { queryGetRelateMessage, queryGetWorkflowProgress, queryMessageDetail } from '@/api/fetchInterface';
import { TinyTimeLine, Modal, TinyGrid, TinyGridColumn, Button as TinyButton, } from '@opentiny/vue'
import exportMessage from '@/views/notam/assemble/components/export.vue';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import task from '@/router/routes/modules/task';

const props = defineProps({
    processInstanceId: String,
    flowId: String,
    taskId: String,
    messageId: Number
});

const { processInstanceId, flowId, messageId, taskId } = toRefs(props);
const workflowVisibility = ref(false)
const act = ref("")
const formData = reactive({});

// 使用reactive创建响应式数组
const data = reactive<Array<{ name: string, time: string, type: string }>>([]);
let tableData = reactive<any>;
let preCondition = ref(false)
// 定义派发事件
const emit = defineEmits(['getCurrentNode']);


// 行操作
const queryRowEvent = async (row: any, type: string) => {
    if (type === "详情") {
        // 递归用当前页面去打开下一个关联通告
        fetchData(row.messageId)
        workflowVisibility.value = true;
        act.value = "detail";
    }
}
// 请求关联通告接口方法
const fetchData = async (id: any) => {
    try {
        const { data: detailData } = await queryMessageDetail({ id });
        Object.assign(formData, detailData);
        console.log("formData--------", formData)
    }
    catch (err) {
        console.log(err);
        Modal.alert('获取数据错误');
    }
}
const getWorkflowProgress = async () => {
    await queryGetWorkflowProgress({
        processInstanceId: processInstanceId.value,
        flowId: flowId.value,
        taskId: taskId.value,
        authUserId: workflowaxios.defaults.headers.common.AuthUserId,
        authorization: workflowaxios.defaults.headers.common.Authorization,
        flyflowTenantId: workflowaxios.defaults.headers.common.FlyflowTenantId || "1"
    }).then(async (res: any) => {
        // 0未开始，1正在进行，2已完成
        const statusMap = {
            0: 'primary',
            1: 'info',
            2: 'success'
        };

        // 构建节点信息的函数
        const buildNode = (item: any) => {
            // 使用 placeholder 作为节点名，如果不存在则使用 name
            const nodeName = item.name;

            // 获取人员名称
            let safeNamesString = '';
            if (item.userVoList && item.userVoList.length > 0) {
                safeNamesString = item.userVoList
                    .map((user: any) => user.name || '')
                    .filter((name: any) => name)
                    .join(',');
            }

            // 获取评论内容
            let comment = '';
            if (item.approveDescList && item.approveDescList.length > 0) {
                const firstDesc = item.approveDescList[0];
                try {
                    const descObj = typeof firstDesc.desc === 'string'
                        ? JSON.parse(firstDesc.desc)
                        : firstDesc.desc;
                    comment = descObj.content || '';
                } catch (e) {
                    comment = firstDesc.desc || '';
                }
            }

            // 构建显示名称
            let displayName = nodeName;
            if (safeNamesString) {
                displayName += `【${safeNamesString}】`;
            }
            if (comment) {
                displayName += ` 评论：${comment}`;
            }
            if (item.status === 1) {
                console.log(nodeName);
                emit('getCurrentNode', nodeName);
            }
            return {
                name: displayName,
                time: item.showTimeStr || '',
                type: statusMap[item.status] || 'danger'
            };
        };

        // 递归处理节点函数
        const processNode = (node: any) => {
            if (node.status !== 0) {
                data.push(buildNode(node));
            }

            // 递归处理分支
            if (node.branch && node.branch.length > 0) {
                node.branch.forEach((branch: any) => {
                    if (branch.children && branch.children.length > 0) {
                        branch.children.forEach((child: any) => {
                            processNode(child);
                        });
                    }
                });
            }
        };

        // 处理所有节点
        res.data.forEach((item: any) => {
            processNode(item);
        });

        console.log('处理后的时间线数据:', data);
    }).catch((err: any) => {
        console.log(err)
    });
};
const getRelateMessage = async () => {
    await queryGetRelateMessage({
        messageId: messageId.value,
        authUserId: workflowaxios.defaults.headers.common.AuthUserId,
        authorization: workflowaxios.defaults.headers.common.Authorization,
        flyflowTenantId: workflowaxios.defaults.headers.common.FlyflowTenantId || "1"
    }).then(async (res: any) => {
        tableData = res.data;
        tableData.forEach((item: any) => {
            if (item.parentId === messageId) {
                item.status = "此条记录为下游"
            }
            else {
                item.status = "此条记录为上游"
            }
        });
        console.log(tableData)
    }).catch((err: any) => {
        console.log(err)
    });
};
// 初始化请求数据
onMounted(async () => {
    await getWorkflowProgress();
    await getRelateMessage();
    preCondition.value = true;
    // await workflowaxios.post('/process-instance/queryTaskListInProgress/43a0c03d-061e-11f1-b74e-0242ac110005', {

    // }).then(async (res1: any) => {
    //     console.log("res1-----------------------", res1);
    // })
});
</script>

<style scoped>
code {
    color: #476582;
    padding: 4px 8px;
    margin: 0 4px;
    border-radius: 3px;
    background-color: rgba(27, 31, 35, 0.05);
}

.demo-line {
    line-height: 24px;
}
</style>
