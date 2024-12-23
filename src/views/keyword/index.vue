<template>
  <div class="container">
    <Breadcrumb :items="['menu.notam', 'menu.keyword']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse class="demo-collapse-wrap" v-model="activeNames">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="关键字">
                    <tiny-input v-model="formData.keyWord" placeholder="请输入关键字" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="输入类型">
                    <tiny-select v-model="formData.inputType" searchable placeholder="请选择输入类型"
                      :options="inputTypeOption">
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="状态">
                    <tiny-input v-model="formData.state" placeholder="请输入状态" clearable></tiny-input>
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
          <tiny-grid-column type="selection" width="60"></tiny-grid-column>
          <tiny-grid-column field="keyWord" title="关键字"></tiny-grid-column>
          <tiny-grid-column field="inputType" title="输入类型"></tiny-grid-column>
          <tiny-grid-column field="state" title="状态"></tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button size="mini" type="primary" @click="editRowEvent(data.row)">编辑</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
          <keywordForm :keyWordID="keyWordID" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse,
  CollapseItem as TinyCollapseItem, Select as TinySelect,
} from '@opentiny/vue';
import { queryKeyWordList, deleteKeyWord } from '@/api/fetchInterface';
import keywordForm from './components/form.vue';


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
const boxVisibility = ref(false)
const keyWordID = ref(0)
const formData = ref({
  keyWord: "",
  inputType: "",
  state: "",
})
const inputTypeOption = ref(
  [
    { key: "input", value: "input", label: "输入框" },
    { key: "select", value: "select", label: "选择框" },
    { key: "children", value: "children", label: "父组件" },
    { key: "selectChildren", value: "selectChildren", label: "选择型父组件" },
  ]
)
const gridRef = ref()
const activeNames = ref(['0'])
async function queryClick() {
  getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
}
async function submitClick() {
  getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
}
// 获取列表数据
async function getData({ page }) {
  const { currentPage, pageSize } = page;
  formData.value.pageIndex = currentPage;
  formData.value.pageSize = pageSize;
  let response = await queryKeyWordList(formData.value);
  tableData.value = response.data;
  // 置换inputType的内容
  tableData.value.forEach((item) => { let option = inputTypeOption.value.find((dic) => { return (dic.key === item.inputType) }); if (option) { item.inputType = option.label } })
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = (row) => {
  keyWordID.value = row.keyWordID;
  console.log(row);
  boxVisibility.value = true;
}
// 表操作
const toolbarButtons = ref([
  {
    code: 'addSelection',
    name: '新增',
    type: "success",
  },
  {
    code: 'deleteSelection',
    name: '删除',
    type: "danger",
  },
])
async function toolbarButtonClickEvent({ code, $grid }) {
  switch (code) {
    case 'addSelection': {
      keyWordID.value = 0;
      boxVisibility.value = true;
      break
    }
    case 'deleteSelection': {
      let ids = $grid.getSelectRecords().map((item) => { return item.keyWordID });
      await deleteKeyWord(ids);
      Modal.message({
        message: '删除成功!',
        status: 'success',
      });
      await submitClick();
      break
    }
    default: { console.log("test"); }
  }
}
// 关闭弹窗
function dialogClose() {
  keyWordID.value = 0;
  boxVisibility.value = false;
  submitClick();
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