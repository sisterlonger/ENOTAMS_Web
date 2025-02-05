<template>
    <div class="container">
        <Breadcrumb :items="['menu.notam', 'menu.airspace']" />
        <div class="content">
            <div class="content-main">
                <!--查询组件、选择-->
                <tiny-collapse v-model="activeNames">
                    <tiny-collapse-item title="查询" name="0">
                        <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
                            <tiny-row>
                                <tiny-col :span="4">
                                    <tiny-form-item label="四字代码">
                                        <tiny-input v-model="formData.codeId" placeholder="请输入四字代码"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="情报区名称">
                                        <tiny-input v-model="formData.txtName" placeholder="请输入情报区名称"
                                            clearable></tiny-input>
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
                    >
                    <tiny-grid-column type="index" width="60"></tiny-grid-column>
                    <tiny-grid-column type="selection" width="60"></tiny-grid-column>
                    <tiny-grid-column field="codeType" title="代码类型"></tiny-grid-column>
                    <tiny-grid-column field="codeId" title="四字代码"></tiny-grid-column>
                    <tiny-grid-column field="txtName" title="情报区名称"></tiny-grid-column>
                    <tiny-grid-column field="horizontalRange" title="水平距离" show-overflow></tiny-grid-column>
                    <tiny-grid-column field="verticalRange" title="垂直距离" show-overflow></tiny-grid-column>
                    <tiny-grid-column field="txtRmk" title="备注" show-overflow></tiny-grid-column>
                </tiny-grid>
                <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <airspaceForm :dicID="airspaceId" @close="dialogClose" />
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
    CollapseItem as TinyCollapseItem,
} from '@opentiny/vue';
import { queryAirSpaceList } from '@/api/fetchInterface';
import airspaceForm from './components/form.vue';


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
const airspaceId = ref(0)
const formData = ref({
    codeId: "",
    txtName: "",
})
const gridRef = ref()
const activeNames = ref(['0'])

async function queryClick() {
    //getData({ page: pagerConfig.value.attrs });
    gridRef.value.handleFetch();
}
// 获取列表数据
async function getData({ page }) {
    const { currentPage, pageSize } = page;
    formData.value.pageIndex = currentPage;
    formData.value.pageSize = pageSize;
    let response = await queryAirSpaceList(formData.value);
    tableData.value = response.data;
    return Promise.resolve({
        result: tableData.value,
        page: { total: response.count },
    })
}
// 表操作
const toolbarButtons = ref([
])
// 关闭弹窗
function dialogClose() {
    airspaceId.value = 0;
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