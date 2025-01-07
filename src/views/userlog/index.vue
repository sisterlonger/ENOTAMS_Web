<template>
  <div class="container">
    <Breadcrumb :items="['menu.systemManager', 'menu.userlog']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="模块">
                    <tiny-input v-model="formData.module" placeholder="请输入模块" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="操作人">
                    <tiny-input v-model="formData.logger" placeholder="请输入操作人" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="日志内容">
                    <tiny-input v-model="formData.message" placeholder="请输入日志内容" clearable></tiny-input>
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


        <tiny-grid ref="gridRef" :fetch-data="fetchData" seq-serial :pager="pagerConfig">
          <template #toolbar>
            <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
          </template>
          <tiny-grid-column type="index" width="60"></tiny-grid-column>
          <tiny-grid-column field="module" title="模块" show-overflow></tiny-grid-column>
          <tiny-grid-column field="logger" title="操作人"></tiny-grid-column>
          <tiny-grid-column field="message" title="日志内容"></tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button v-track="route.name" size="mini" type="primary" @click="editRowEvent(data.row)">查看</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="查看" width="30%">
          <dictionaryForm :id="operationID" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Select as TinySelect,
} from '@opentiny/vue';
import { queryUserLogsList } from '@/api/fetchInterface';
import dictionaryForm from './components/form.vue';

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
const route = useRoute();
const fetchData = ref({
  api: getData
})
const tableData = ref([
])
const boxVisibility = ref(false)
const operationID = ref(0)
const formData = ref({
  module: "",
  logger: "",
  message: "",
})
const gridRef = ref()
const activeNames = ref(['0'])
const statusOptions = [
  {
    value: 'normal',
    label: 'normal',
  },
  {
    value: 'warning',
    label: 'warning',
  },
  {
    value: 'error',
    label: 'error',
  },
];
async function queryClick() {
  getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
}

// 获取列表数据
async function getData({ page }) {
  //this.$trackEvent('button_click', { buttonId: 'myButton' });
  const { currentPage, pageSize } = page
  formData.value.pageIndex = currentPage;
  formData.value.pageSize = pageSize;
  let response = await queryUserLogsList(formData.value);
  tableData.value = response.data;
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = (row) => {
  operationID.value = row.operationID;
  boxVisibility.value = true;
}
// 关闭弹窗
function dialogClose() {
  operationID.value = 0;
  boxVisibility.value = false;
  queryClick();
}
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