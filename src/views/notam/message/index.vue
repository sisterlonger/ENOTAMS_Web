<template>
  <div class="container">
    <Breadcrumb :items="['menu.notam', 'menu.message']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="报文类型">
                    <tiny-select
                      v-model="formData.validType" :options="typeOptions" placeholder="请输入报文类型" clearable>
                    </tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="报文生效类型">
                    <tiny-select
                      v-model="formData.validType" :options="validTypeOptions" placeholder="请输入报文生效类型" clearable>
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
                  <tiny-form-item label="电报正文">
                    <tiny-input v-model="formData.telegramText" placeholder="请输入电报正文" clearable></tiny-input>
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


        <tiny-grid ref="gridRef" :fetch-data="fetchData" seq-serial :pager="pagerConfig" :fit="true">
          <template #toolbar>
            <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
          </template>
          <tiny-grid-column type="index" width="60"></tiny-grid-column>
          <tiny-grid-column field="type" title="报文类型" ></tiny-grid-column>
          <tiny-grid-column field="validType" title="报文生效类型"></tiny-grid-column>
          <tiny-grid-column field="lat" title="纬度"></tiny-grid-column>
          <tiny-grid-column field="long" title="经度" ></tiny-grid-column>
          <tiny-grid-column field="radius" title="半径" ></tiny-grid-column>
          <tiny-grid-column field="telegramText" title="电报正文"></tiny-grid-column>
          <tiny-grid-column field="createTime" title="创建时间" ></tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button v-track="'电报记录'" size="mini" type="primary" @click="editRowEvent(data.row)">查看</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="查看" width="30%">
          <messageForm :id="messageId" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal,TinyDatePicker,  Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Select as TinySelect,
} from '@opentiny/vue';
import { queryMessageList } from '@/api/fetchInterface';
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
const boxVisibility = ref(false)
const messageId = ref(0)
const formData = ref({
  type: "",
  validType: "",
  lat: "",
  radius: "",
  telegramText: "",
  createTime:"",
  long: "",
  timeRange: [],
})
const gridRef = ref()
const activeNames = ref(['0'])
const typeOptions = [
  {
    value: '新报',
    label: '新报',
  },
  {
    value: '代替报',
    label: '代替报',
  },
  {
    value: '取消报',
    label: '取消报',
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
async function queryClick() {
  //getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
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
  else{
    formData.value.startTime = "";
    formData.value.endTime = "";
  }
  let response = await queryMessageList(formData.value);
  tableData.value = response.data;
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = (row) => {
  messageId.value = row.messageId;
  boxVisibility.value = true;
}
// 关闭弹窗
function dialogClose() {
  messageId.value = 0;
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