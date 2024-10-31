<template>
  <div>
    <Breadcrumb :items="['menu.log']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse class="demo-collapse-wrap" v-model="activeNames">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="模块">
                    <tiny-input v-model="formData.module" placeholder="请输入模块" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="日志级别">
                    <tiny-select v-model="formData.level" :options="statusOptions" placeholder="请输入日志级别" clearable></tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="操作人">
                    <tiny-input v-model="formData.logger" placeholder="请输入操作人" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="对象">
                    <tiny-input v-model="formData.object" placeholder="请输入对象" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="日志内容">
                    <tiny-input v-model="formData.message" placeholder="请输入日志内容" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="异常">
                    <tiny-input v-model="formData.exception" placeholder="请输入异常" clearable></tiny-input>
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


        <tiny-grid ref="gridRef" :fetch-data="fetchData" seq-serial :pager="pagerConfig"
          @toolbar-button-click="toolbarButtonClickEvent">
          <template #toolbar>
            <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
          </template>
          <tiny-grid-column type="index" width="60"></tiny-grid-column>
          <tiny-grid-column field="module" title="模块" show-overflow></tiny-grid-column>
          <tiny-grid-column field="level" title="日志级别"></tiny-grid-column>
          <tiny-grid-column field="logger" title="操作人"></tiny-grid-column>
          <tiny-grid-column field="object" title="对象" show-overflow></tiny-grid-column>
          <tiny-grid-column field="message" title="日志内容"></tiny-grid-column>
          <tiny-grid-column field="exception" title="异常"></tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button size="mini" type="primary" :icon="IconSearch" circle
                @click="editRowEvent(data.row)"></tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="查看" width="30%">
          <dictionaryForm :operationID="operationID" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Select as TinySelect,
} from '@opentiny/vue';
import { iconSearch } from '@opentiny/vue-icon';
import { queryLogsList, deleteLogs } from '@/api/log';
import dictionaryForm from './components/form.vue';

const IconSearch = iconSearch()

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
const boxVisibility = ref(false)
const operationID = ref(0)
const formData = ref({
  module: "",
  thread: "",
  level: "",
  logger: "",
  message: "",
  exception: "",
  object: "",
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
  const { currentPage, pageSize } = page
  formData.value.pageIndex = currentPage;
  formData.value.pageSize = pageSize;
  let response = await queryLogsList(formData.value);
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
// 表操作
const toolbarButtons = ref([
  {
    code: 'deleteSelection',
    name: '删除',
    type: "danger",
  },
])
async function toolbarButtonClickEvent({ code, $grid }) {
  switch (code) {
    case 'deleteSelection': {
      let ids = $grid.getSelectRecords().map((item) => { return item.operationID });
      await deleteLogs(ids);
      Modal.message({
        message: '删除成功!',
        status: 'success',
      });
      await queryClick();
      break
    }
    default: { console.log("test"); }
  }
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
  height: 60vh;
  overflow-y: auto;
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
  padding: 15px 15px;
}

.search-btn {
  height: 30px;
  width: 100px;
  border-radius: 4px;
}
</style>