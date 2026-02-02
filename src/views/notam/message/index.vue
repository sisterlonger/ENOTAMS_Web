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
                    <tiny-select v-model="formData.type" :options="typeOptions" placeholder="请输入报文类型" clearable>
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
                  <tiny-form-item label="当前处理人">
                    <tiny-input v-model="formData.taskAssignShow" placeholder="请输入当前处理人" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="处理状态">
                    <tiny-select v-model="formData.workflowStatus" placeholder="请选择处理状态" filterable clearable>
                      <tiny-option v-for="item in workflowStatusOptions" :key="item.label" :label="item.label"
                        :value="item.value"></tiny-option>
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="状态">
                    <tiny-select v-model="formData.status" placeholder="请选择状态" filterable clearable>
                      <tiny-option v-for="item in statusOptions" :key="item.label" :label="item.label"
                        :value="item.value"></tiny-option>
                    </tiny-select>
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
          <tiny-grid-column field="messageId" title="通告序列号" width="60"></tiny-grid-column>
          <!-- <tiny-grid-column field="qCode" title="Q码"></tiny-grid-column> -->
          <tiny-grid-column field="airSpaceCodeId" title="发生地" width="10%"></tiny-grid-column>
          <tiny-grid-column field="type" title="报文类型" width="10%"></tiny-grid-column>
          <tiny-grid-column field="telegramText" title="主要内容(E项)" show-overflow></tiny-grid-column>
          <tiny-grid-column field="createTime" title="创建时间" width="11%" :renderer="renderName"></tiny-grid-column>
          <tiny-grid-column field="taskAssignShow" title="当前处理人" width="10%"></tiny-grid-column>
          <tiny-grid-column field="workflowStatus" title="处理状态"></tiny-grid-column>
          <tiny-grid-column field="status" title="状态" width="10%">
            <template #default="data">
              <tiny-tag size="mini" :type="data.row.buttonType" effect="dark">{{
                data.row.status }}</tiny-tag>
            </template>
          </tiny-grid-column>
          <tiny-grid-column title="操作" width="300" align="center">
            <template #default="data">
              <!-- <tiny-button v-show="data.row.status !== '未开始'" v-track="'电报'" size="mini" type="success"
                @click="editRowEvent(data.row, '电报')">电报</tiny-button> -->
              <tiny-button v-show="data.row.workflowStatus === '未开始'" v-track="'详情'" size="mini" type="info"
                @click="editRowEvent(data.row, '处理关联通告')">处理关联通告</tiny-button>
              <tiny-button v-show="data.row.status !== '未开始'" v-track="'详情'" size="mini" type="info"
                @click="editRowEvent(data.row, '详情')">详情</tiny-button>
              <tiny-button v-show="data.row.workflowStatus === '待办'" v-track="'处理'" size="mini" type="warning"
                @click="editRowEvent(data.row, '处理')">处理</tiny-button>
              <tiny-button v-show="data.row.status === '已完成'" v-track="'发布'" size="mini" type="success"
                @click="editRowEvent(data.row, '发布')">发布</tiny-button>
              <tiny-button v-show="data.row.status === '已发布'" v-track="'代替'" size="mini" type="primary"
                @click="editRowEvent(data.row, '代替')">代替报</tiny-button>
              <tiny-button v-show="data.row.status === '已发布'" v-track="'取消'" size="mini" type="primary"
                @click="editRowEvent(data.row, '取消')">取消报</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box :modal="false" v-if="messageVisibility" v-model:visible="messageVisibility" title="电报"
          width="40%">
          <messageForm :id="messageId" @close="dialogClose" />
        </tiny-dialog-box>
        <!--已有流程的notice-->
        <tiny-dialog-box :modal="false" v-if="workflowVisibility" v-model:visible="workflowVisibility" title="详情"
          width="80%" max-height="1000px" top="5%" :close-on-click-modal="true">
          <notice :messageId="messageId" :templateID="templateId" :processInstanceId="processInstanceId"
            :flowId="flowId" :taskId="taskId" :act="act" @close="dialogClose" />
        </tiny-dialog-box>
        <!--新增的关联通告-->
        <tiny-dialog-box :modal="false" v-if="addVisibility" v-model:visible="addVisibility" title="详情" width="80%"
          max-height="1000px" top="5%" :close-on-click-modal="true">
          <enotam :messageId="messageId" :templateID="templateId" :parentId="parentId" :messageType="messageType" :act="act" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted, watch } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm, TinyTag,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, TinyDatePicker, Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Option as TinyOption, Select as TinySelect,
} from '@opentiny/vue';
import { queryMessageList, queryAirSpaceList, publishMessage } from '@/api/fetchInterface';
import { isEmpty } from '@/utils/string-utils';
import { useRoute } from 'vue-router'

import workflowaxios from '@/views/workflow/components/workflow-axios';
import notice from '@/views/notam/message/components/notice.vue';
import enotam from '@/views/notam/assemble/components/enotam.vue';
import messageForm from './components/form.vue';

const pagerConfig = ref({
  attrs: {
    currentPage: 1,
    pageSize: 10,
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
const addVisibility = ref(false)
const messageId = ref(0)
const parentId = ref(0)
const messageType=ref("")
const templateId = ref(0)
const processInstanceId = ref("")
const flowId = ref("")
const taskId = ref("")
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
  taskAssignShow: "",
  workflowStatus: "",
  timeRange: [],
})
let workFlowList = ref([]);
const preCondition = ref(false)
const gridRef = ref()
const airSpaceOptions = ref([]);
const workflowStatusOptions = [
  {
    value: '待办',
    label: '待办'
  },
  {
    value: '已办',
    label: '已办'
  },
  {
    value: '未开始',
    label: '未开始'
  },
]
const statusOptions = [
  {
    value: '进行中',
    label: '进行中'
  },
  {
    value: '已发布',
    label: '已发布'
  },
  {
    value: '已代替',
    label: '已代替'
  },
  {
    value: '已取消',
    label: '已取消'
  },
  {
    value: '已完成',
    label: '已完成'
  },
  {
    value: '未开始',
    label: '未开始'
  },
]
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

const route = useRoute()

// 监听路由参数变化
watch(() => route.query.workflowStatus, async (newStatus) => {
  if (newStatus) {
    formData.value.workflowStatus = newStatus
    // 可选：自动触发查询
    await queryClick()
  }
})

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
  formData.value.AuthUserId = workflowaxios.defaults.headers.common.AuthUserId
  formData.value.Authorization = workflowaxios.defaults.headers.common.Authorization
  formData.value.FlyflowTenantId = workflowaxios.defaults.headers.common.FlyflowTenantId
  let response = await queryMessageList(formData.value);
  tableData.value = response.data;
  console.log(response.data);
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = async (row, type) => {
  messageId.value = row.messageId;
  templateId.value = row.templateId;
  processInstanceId.value = row.processInstanceId;
  flowId.value = row.flowId;
  taskId.value = row.taskId;
  // 组装发布接口的数据
  let publishData = {
    messageId: row.messageId,
    state: `已${type}`,
  }
  if (type === "详情") {
    workflowVisibility.value = true;
    act.value = "detail";
  }
  else if (type === "电报") {
    messageVisibility.value = true;
  }
  else if (type === "处理关联通告") {
    act.value = "add";
    addVisibility.value = true;
  }
  else if (type === "处理") {
    act.value = "edit";
    workflowVisibility.value = true;
  }
  else if (type === "发布") {
    await publishMessage(publishData).then(async (res) => {
      console.log("res", res);
      if (res.code === 200) {
        Modal.alert({ message: '发布成功', status: 'success' })
      }
    })
    await queryClick();

  }
  else if (type === "取消") {
    act.value = "add";
    messageType.value ="cnl"
    addVisibility.value = true;
    parentId.value = messageId.value;
    messageId.value = null;
  }
  else if (type === "代替") {
    // await publishMessage(publishData).then(async (res) => {
    //   console.log("res", res);
    //   if (res.code === 200) {
    //     act.value = "add";
    //     addVisibility.value = true;
    //     messageId.value = res.data;
    //     //Modal.alert({ message: '代替成功', status: 'success' })
    //   }
    // })
    // await queryClick();
    act.value = "add";
    messageType.value ="replace"
    addVisibility.value = true;
    parentId.value = messageId.value;
    messageId.value = null;
  }
}
// 关闭弹窗
function dialogClose() {
  messageId.value = 0;
  templateId.value = 0;
  parentId.value = 0;
  processInstanceId.value = "";
  flowId.value = "0";
  act.value = "";
  messageType.value = ""
  messageVisibility.value = false;
  workflowVisibility.value = false;
  addVisibility.value = false;
  queryClick();
}
const fetchConfig = async () => {
  let airspaceList = await queryAirSpaceList();
  airSpaceOptions.value = airspaceList.data;
}

// 初始化请求数据
onMounted(async () => {
  // 检查是否有传入的workflowStatus参数
  if (route.query.workflowStatus) {
    formData.value.workflowStatus = route.query.workflowStatus
  }
  await fetchConfig();
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