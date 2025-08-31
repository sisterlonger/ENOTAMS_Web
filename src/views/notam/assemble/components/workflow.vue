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
        </tiny-grid>
    </div>
</template>

<script setup lang="ts">
import { ref,toRefs, reactive, defineProps, onMounted } from 'vue'
import { queryGetRelateMessage } from '@/api/fetchInterface';
import { TinyTimeLine, Modal, TinyGrid, TinyGridColumn, } from '@opentiny/vue'
import workflowaxios from '@/views/workflow/components/workflow-axios';

const props = defineProps({
    processInstanceId: String,
    flowId: String,
    messageId: Number
});

const { processInstanceId, flowId, messageId } = toRefs(props);

// 使用reactive创建响应式数组
const data = reactive<Array<{ name: string, time: string, type: string }>>([]);
let tableData = reactive<any>;
let preCondition = ref(false)

const getWorkflowProgress = async () => {
    await workflowaxios.post('/form/getFormDetail', {
        processInstanceId: processInstanceId.value,
        flowId: flowId.value
    },).then(async (res1: any) => {
        let parmMap = {};
        res1.data.data.formList.forEach((item: any) => {
            parmMap[item.id] = item.props.value;
        });
        await workflowaxios.post('/base/formatStartNodeShow', {
            processInstanceId: processInstanceId.value,
            flowId: flowId.value,
            paramMap: parmMap
        },).then((res2: any) => {
            // res为请求到流程历史，只记录已经完成的和正在进行的
            data.length = 0;
            // 0未开始，1正在进行，2已完成
            const statusMap = {
                0: 'primary',
                1: 'info',
                2: 'success'
            };
            res2.data.data.processNodeShowDtoList.forEach((item: any) => {
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
        }).catch((err: any) => {
            console.log(err);
            Modal.message({ message: `获取工作进展失败，原因：${err}`, status: 'error' })
        });
    }).catch((err: any) => {
        console.log(err);
        Modal.message({ message: `获取工作进展失败，原因：${err}`, status: 'error' })
    });
};
const getRelateMessage = async () => {
    await queryGetRelateMessage({ id: messageId.value }).then(async (res: any) => {
        tableData = res.data;
        tableData.forEach((item: any) => {
            if(item.parentId === messageId){
                item.status = "子"
            }
            else{
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
