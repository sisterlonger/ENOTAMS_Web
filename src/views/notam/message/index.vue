<template>
  <div class="container">
    <Breadcrumb v-show="false" :items="['menu.publish', 'menu.message']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="Q码">
                    <tiny-input v-model="formData.qCode" placeholder="请输入Q码" clearable></tiny-input>
                    <!-- <tiny-select v-model="formData.qCode" :options="qOptions" placeholder="请选择Q码" clearable>
                    </tiny-select> -->
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="发生地">
                    <tiny-select v-model="formData.airSpaceCodeId" placeholder="请选择发生地" filterable clearable>
                      <tiny-option v-for="item in airSpaceOptions" :key="item.codeId" :label="item.codeId"
                        :value="item.codeId"></tiny-option>
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="报文类型">
                    <tiny-select v-model="formData.validType" :options="typeOptions" placeholder="请输入报文类型" clearable>
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="生效类型">
                    <tiny-select v-model="formData.validType" :options="validTypeOptions" placeholder="请输入报文生效类型"
                      clearable>
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="纬度">
                    <tiny-input v-model="formData.lat" placeholder="请输入纬度" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="经度">
                    <tiny-input v-model="formData.long" placeholder="请输入经度" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="半径">
                    <tiny-input v-model="formData.radius" placeholder="请输入半径" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="主要内容(E项)">
                    <tiny-input v-model="formData.telegramText" placeholder="请输入主要内容(E项)" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="时间范围">
                    <tiny-date-picker v-model="formData.timeRange" type="datetimerange" placeholder="请选择时间"
                      format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></tiny-date-picker>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item>
                    <div>
                      <tiny-button class="search-btn" type="primary" @click="queryClick">
                        查询
                      </tiny-button>
                    </div>
                  </tiny-form-item>
                </tiny-col>
              </tiny-row>
            </tiny-form>
          </tiny-collapse-item>
        </tiny-collapse>


        <tiny-grid v-if="preCondition" ref="gridRef" :fetch-data="fetchData" seq-serial :pager="pagerConfig"
          :fit="true">
          <template #toolbar>
            <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
          </template>
          <tiny-grid-column type="index" width="60"></tiny-grid-column>
          <!-- <tiny-grid-column field="qCode" title="Q码"></tiny-grid-column> -->
          <tiny-grid-column field="airSpaceCodeId" title="发生地" width="10%"></tiny-grid-column>
          <tiny-grid-column field="type" title="报文类型" width="10%"></tiny-grid-column>
          <!-- <tiny-grid-column field="validType" title="报文生效类型"></tiny-grid-column> -->
          <!-- <tiny-grid-column field="lat" title="纬度"></tiny-grid-column>
          <tiny-grid-column field="long" title="经度"></tiny-grid-column>
          <tiny-grid-column field="radius" title="半径"></tiny-grid-column> -->
          <tiny-grid-column field="telegramText" title="主要内容(E项)" show-overflow></tiny-grid-column>
          <tiny-grid-column field="createTime" title="创建时间" width="11%" :renderer="renderName"></tiny-grid-column>
          <tiny-grid-column field="taskAssignShow" title="当前处理人" width="10%"></tiny-grid-column>
          <tiny-grid-column field="status" title="状态" width="10%">
            <template #default="data">
              <tiny-tag size="mini" :type="data.row.buttonType" effect="dark">{{
                data.row.status }}</tiny-tag>
            </template>
          </tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button v-show="data.row.status !== '未开始'" v-track="'电报'" size="mini" type="success"
                @click="editRowEvent(data.row, '电报')">电报</tiny-button>
              <tiny-button v-show="data.row.status !== '未开始'" v-track="'详情'" size="mini" type="info"
                @click="editRowEvent(data.row, '详情')">详情</tiny-button>
              <tiny-button v-show="data.row.status === '未开始'" v-track="'处理'" size="mini" type="primary"
                @click="editRowEvent(data.row, '处理')">处理</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box :modal="false" v-if="messageVisibility" v-model:visible="messageVisibility" title="电报"
          width="40%">
          <messageForm :id="messageId" @close="dialogClose" />
        </tiny-dialog-box>
        <!--包含工作进展、提醒设置、关联通告-->
        <tiny-dialog-box :modal="false" v-if="workflowVisibility" v-model:visible="workflowVisibility" title="详情"
          width="80%" max-height="1000px" top="5%" :close-on-click-modal="true">
          <enotam :messageId="messageId" :templateID="templateId" :processInstanceId="processInstanceId"
            :flowId="flowId" :act='act' @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm, TinyTag,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, TinyDatePicker, Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Option as TinyOption, Select as TinySelect,
} from '@opentiny/vue';
import { queryMessageList, queryAirSpaceList } from '@/api/fetchInterface';
import { isEmpty } from '@/utils/string-utils';

import workflowaxios from '@/views/workflow/components/workflow-axios';
import enotam from '@/views/notam/assemble/components/enotam.vue';
import messageForm from './components/form.vue';

const pagerConfig = ref({
  attrs: {
    currentPage: 1,
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    total: 0,
    align: 'left', // 可选值：['left', 'center', 'right']
    layout: 'total, prev, pager, next, jumper, sizes'
  }
})
const fetchData = ref({
  api: getData
})
const tableData = ref([
])
const messageVisibility = ref(false)
const workflowVisibility = ref(false)
const messageId = ref(0)
const templateId = ref(0)
const processInstanceId = ref("")
const flowId = ref("")
const formData = ref({
  qCode: "",
  airSpaceCodeId: "",
  type: "",
  validType: "",
  lat: "",
  radius: "",
  telegramText: "",
  createTime: "",
  long: "",
  timeRange: [],
})
let workFlowList = ref([]);
const preCondition = ref(false)
const gridRef = ref()
const airSpaceOptions = ref([]);
const activeNames = ref(['0'])
const typeOptions = [
  {
    value: '新发报文',
    label: '新发报文',
  },
  {
    value: '代替现有报文',
    label: '代替现有报文',
  },
  {
    value: '取消现有报文',
    label: '取消现有报文',
  },
];
const validTypeOptions = [
  {
    value: 'EST',
    label: 'EST',
  },
  {
    value: 'PERM',
    label: 'PERM',
  },
  {
    value: 'NEITHER',
    label: 'NEITHER',
  },
];
const act = ref("")
async function queryClick() {
  //getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
}

function renderName(h, { row }) {
  return row.createTime.slice(0, 10)
}

// 获取列表数据
async function getData({ page }) {
  //this.$trackEvent('button_click', { buttonId: 'myButton' });
  const { currentPage, pageSize } = page
  formData.value.pageIndex = currentPage;
  formData.value.pageSize = pageSize;
  if (formData.value.timeRange.length > 0) {
    formData.value.startTime = String(formData.value.timeRange[0]);
    formData.value.endTime = String(formData.value.timeRange[1]);
  }
  else {
    formData.value.startTime = "";
    formData.value.endTime = "";
  }
  let response = await queryMessageList(formData.value);
  tableData.value = response.data;

  // 核心实现：将workFlowList的值赋值给匹配的tableData
  const workflowMap = new Map();

  // 1. 创建workFlowList的快速查找映射
  workFlowList.value.forEach(item => {
    if (item.processInstanceId) {
      workflowMap.set(item.processInstanceId, {
        taskAssignShow: item.taskAssignShow,
        flowId: item.flowId,
        taskId: item.taskId,
        processInstanceId: item.processInstanceId
      });
    }
  });
  // 2. 遍历tableData进行匹配赋值,table的workflowid对应的是processInstanceId
  tableData.value.forEach(item => {
    if (item.workflowId && workflowMap.has(item.workflowId)) {
      const workflowData = workflowMap.get(item.workflowId);
      Object.assign(item, {
        taskAssignShow: workflowData.taskAssignShow,
        flowId: workflowData.flowId,
        taskId: workflowData.taskId,
        processInstanceId: workflowData.processInstanceId,
      });
    }
    if (isEmpty(item.taskAssignShow) && !isEmpty(item.type)) {
      item.status = "已完成";
      item.buttonType = "success"
    }
    else if (!isEmpty(item.taskAssignShow) && !isEmpty(item.type)) {
      item.status = "进行中";
      item.buttonType = "danger"
    }
    else {
      item.status = "未开始";
      item.buttonType = "primary"
    }
  });
  //console.log("table----------", tableData.value)
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = (row, type) => {
  messageId.value = row.messageId;
  templateId.value = row.templateId;
  processInstanceId.value = row.processInstanceId;
  flowId.value = row.flowId;
  if (type === "详情") {
    workflowVisibility.value = true;
    act.value = "edit";
  }
  else if (type === "电报") {
    messageVisibility.value = true;
  }
  else if (type === "处理") {
    act.value = "add";
    workflowVisibility.value = true;
  }
}
// 关闭弹窗
function dialogClose() {
  messageId.value = 0;
  templateId.value = 0;
  processInstanceId.value = "";
  flowId.value = "0";
  act.value = "";
  messageVisibility.value = false;
  workflowVisibility.value = false;
  queryClick();
}
const fetchConfig = async () => {
  let airspaceList = await queryAirSpaceList();
  airSpaceOptions.value = airspaceList.data;
}
// 通过属性去重
const uniqueByProp = (arr, prop) => {
  return [...new Map(arr.map(item => [item[prop], item])).values()];
}
// 初始化请求数据
onMounted(async () => {
  await fetchConfig();
  // 获取已办、待办、发起
  // 获取具体某个流程实例的详情
  // await workflowaxios.get('/process-instance/queryDetailByProcessInstanceId',
  //       {params:{processInstanceId:"e055348b-5d5c-11f0-a1ba-0242ac150004"}}
  //     ).then(async (res2: any) => {
  //       console.log("res2", res2);

  //     }).catch((err: any) => {
  //       console.log(err);
  //       Modal.message({ message: `通知单生成失败，原因${err}`, status: 'error' })
  //     });
  // 待办
  await workflowaxios.post('combination/group/queryTodoTaskList', {
    "pageNum": 1,
    "pageSize": 1000
  },).then((res1) => {
    workFlowList.value = workFlowList.value.concat(res1.data.data.records)
  }).catch((err) => {
    console.log(err);
    Modal.message({ message: `获取流程详情失败，原因：${err}`, status: 'error' })
  });
  // 发起
  await workflowaxios.post('/combination/group/queryInitiatedTaskList', {
    "pageNum": 1,
    "pageSize": 1000
  },).then((res1) => {
    workFlowList.value = workFlowList.value.concat(res1.data.data.records)
  }).catch((err) => {
    console.log(err);
    Modal.message({ message: `获取流程详情失败，原因：${err}`, status: 'error' })
  });
  // 已办
  await workflowaxios.post('/combination/group/queryFinishedTaskList', {
    "pageNum": 1,
    "pageSize": 1000
  },).then((res1) => {
    workFlowList.value = workFlowList.value.concat(res1.data.data.records)
  }).catch((err) => {
    console.log(err);
    Modal.message({ message: `获取流程详情失败，原因：${err}`, status: 'error' })
  });
  workFlowList.value = uniqueByProp(workFlowList.value, "processInstanceId")
  preCondition.value = true;
});
</script>

<style lang="less" scoped>
.tiny-grid {
  overflow-y: auto;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 98%;
  height: inherit;
  margin: 0 auto;
  overflow: hidden;

  :deep(.tiny-steps) {
    margin-top: 10px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
}

.content-main {
  padding: 15px 15px 50px;
}

.search-btn {
  height: 30px;
  width: 100px;
  border-radius: 4px;
}
</style>