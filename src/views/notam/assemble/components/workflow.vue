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
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, defineProps, onMounted } from 'vue'
import { queryGetRelateMessage, queryGetWorkflowProgress } from '@/api/fetchInterface';
import { TinyTimeLine, Modal, TinyGrid, TinyGridColumn, Button as TinyButton, } from '@opentiny/vue'
import workflowaxios from '@/views/workflow/components/workflow-axios';

const props = defineProps({
    processInstanceId: String,
    flowId: String,
    messageId: Number
});

const { processInstanceId, flowId, messageId } = toRefs(props);
const workflowVisibility = ref(false)
const act = ref("")


// 使用reactive创建响应式数组
const data = reactive<Array<{ name: string, time: string, type: string }>>([]);
let tableData = reactive<any>;
let preCondition = ref(false)


// 行操作
const queryRowEvent = async (row: any, type: string) => {
    if (type === "详情") {
        // 递归用当前页面去打开下一个关联通告
        workflowVisibility.value = true;
        act.value = "detail";
    }
}
const getWorkflowProgress = async () => {
    await queryGetWorkflowProgress({
        processInstanceId: processInstanceId.value,
        flowId: flowId.value,
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
        res.data.forEach((item: any) => {
            // 一级
            if (item.status !== 0 && item.userVoList.length > 0) {
                let safeNamesString = item.userVoList
                    .map((user: any) => user.name || '') // 如果name可能为空则添加空字符串
                    .filter((name: any) => name)        // 过滤掉空值
                    .join(',');

                data.push({
                    name: `${item.name}${safeNamesString === '' ? '' : `【${safeNamesString}】`}`,
                    time: item.showTimeStr,
                    type: statusMap[item.status] || 'danger'
                });
            }
            // 二级
            // 目前只支持一级分支，以后再搞更深层的
            if (item.status !== 0) {
                item.branch.forEach((branch: any) => {
                    branch.children.forEach((child: any) => {
                        let safeNamesString = child.userVoList
                            .map((user: any) => user.name || '') // 如果name可能为空则添加空字符串
                            .filter((name: any) => name)        // 过滤掉空值
                            .join(',');
                        data.push({
                            name: `${child.name}${safeNamesString === '' ? '' : `【${safeNamesString}】`}`,
                            time: child.showTimeStr,
                            type: statusMap[child.status] || 'danger'
                        })
                    })
                })
            }
        });
        console.log(res);
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
                item.status = "子"
            }
            else {
                item.status = "父"
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
