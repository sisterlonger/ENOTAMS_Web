<template>
  <div class="container">
    <Breadcrumb v-show="false"  :items="['menu.systemManager', 'menu.userlog']" />
    <div class="content">
      <div class="content-main">
        <!--查询组件、选择-->
        <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
          <tiny-collapse-item title="查询" name="0">
            <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
              <tiny-row>
                <tiny-col :span="4">
                  <tiny-form-item label="时间范围">
                    <tiny-date-picker v-model="formData.timeRange" type="datetimerange" placeholder="请选择时间"
                      format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></tiny-date-picker>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="请求方式">
                    <tiny-select v-model="formData.method" placeholder="请选择请求方式" :options="methodOptions"
                      clearable></tiny-select>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="接口地址">
                    <tiny-input v-model="formData.url" placeholder="请输入接口地址" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="请求参数">
                    <tiny-input v-model="formData.body" placeholder="请输入请求参数" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="响应结果">
                    <tiny-input v-model="formData.result" placeholder="请输入响应结果" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="报错日志">
                    <tiny-input v-model="formData.error" placeholder="请输入报错日志" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="操作人">
                    <tiny-input v-model="formData.logger" placeholder="请输入操作人" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="请求ip">
                    <tiny-input v-model="formData.ip" placeholder="请输入请求ip" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
                <tiny-col :span="4">
                  <tiny-form-item label="状态">
                    <tiny-select v-model="formData.status" placeholder="请选择状态" :options="statusOptions"
                      clearable></tiny-select>
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
            <tiny-grid-toolbar></tiny-grid-toolbar>
          </template>
          <!-- <tiny-grid-column type="index" width="60"></tiny-grid-column> -->
          <tiny-grid-column field="ts" title="时间"></tiny-grid-column>
          <tiny-grid-column field="method" title="请求方式"></tiny-grid-column>
          <tiny-grid-column field="url" title="接口地址"></tiny-grid-column>
          <tiny-grid-column field="body" title="请求参数" show-overflow></tiny-grid-column>
          <tiny-grid-column field="result" title="响应结果" show-overflow></tiny-grid-column>
          <tiny-grid-column field="error" title="报错日志" show-overflow></tiny-grid-column>
          <tiny-grid-column field="depName" title="部门"></tiny-grid-column>
          <tiny-grid-column field="userName" title="用户名"></tiny-grid-column>
          <tiny-grid-column field="ip" title="请求ip"></tiny-grid-column>
          <tiny-grid-column field="duration" title="响应时长(ms)"></tiny-grid-column>
          <tiny-grid-column title="操作" width="200" align="center">
            <template #default="data">
              <tiny-button v-track="route.name" size="mini" type="primary"
                @click="editRowEvent(data.row)">查看</tiny-button>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-dialog-box  :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="查看" width="50%">
          <dictionaryForm :ts="ts" @close="dialogClose" />
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
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, TinyDatePicker, Modal, Collapse as TinyCollapse, CollapseItem as TinyCollapseItem, Select as TinySelect,
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
const ts = ref("")
const formData = ref({
  timeRange: [],
  startTime: '',
  endTime: '',
  method: "",
  url: "",
  body: "",
  result: "",
  error: "",
  ip: "",
  status: '',
  logger: "",
})
const gridRef = ref()
const activeNames = ref(['0'])
const statusOptions = [
  {
    value: '0',
    label: '正常',
  },
  {
    value: '1',
    label: '异常',
  },
];
const methodOptions = [{
  value: 'GET',
  label: 'GET',
},
{
  value: 'POST',
  label: 'POST',
},];
async function queryClick() {
  //getData({ page: pagerConfig.value.attrs });
  gridRef.value.handleFetch();
}

/**
 * 将 ISO 8601 时间字符串转换为 "YYYY-MM-DD HH:mm:ss" 格式
 * @param {string} isoString - ISO 8601 时间字符串（如 "2025-06-11T14:50:52.297+08:00"）
 * @returns {string} 格式化后的时间字符串
 */
function formatIsoToSimple(isoString) {
  const date = new Date(isoString);

  // 提取各部分并补零（月份从 0 开始，需 +1）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 补零到两位
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // 拼接为目标格式
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 使用示例
const isoTime = "2025-06-11T14:50:52.297+08:00";
const formattedTime = formatIsoToSimple(isoTime);
console.log(formattedTime); // 输出：2025-06-11 14:50:52
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
  console.log(formData.value);
  let response = await queryUserLogsList(formData.value);
  tableData.value = response.data;
  return Promise.resolve({
    result: tableData.value,
    page: { total: response.count },
  })
}
// 行操作
const editRowEvent = (row) => {
  ts.value = row.ts;
  boxVisibility.value = true;
}
// 关闭弹窗
function dialogClose() {
  ts.value = "";
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