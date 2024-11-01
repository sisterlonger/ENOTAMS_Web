<template>
    <div>
        <Breadcrumb :items="['menu.dictionary']" />
        
        <div class="content">
            <div class="content-main">
                <!--查询组件、选择-->
                <tiny-collapse class="demo-collapse-wrap" v-model="activeNames">
                    <tiny-collapse-item title="查询" name="0">
                        <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
                            <tiny-row>
                                <tiny-col :span="4">
                                    <tiny-form-item label="字典组">
                                        <tiny-input v-model="formData.dicType" placeholder="请输入字典组" clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="键">
                                        <tiny-input v-model="formData.dicKey" placeholder="请输入键" clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="值">
                                        <tiny-input v-model="formData.dicValue" placeholder="请输入值" clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="模块">
                                        <tiny-input v-model="formData.moduleName" placeholder="请输入模块" clearable></tiny-input>
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
                    <tiny-grid-column field="dicType" title="字典组"></tiny-grid-column>
                    <tiny-grid-column field="dicKey" title="键"></tiny-grid-column>
                    <tiny-grid-column field="dicValue" title="值"></tiny-grid-column>
                    <tiny-grid-column field="orderID" title="排序号" show-overflow></tiny-grid-column>
                    <tiny-grid-column field="moduleName" title="模块" show-overflow></tiny-grid-column>
                    <tiny-grid-column title="操作" width="200" align="center">
                        <template #default="data">
                            <tiny-button size="mini" type="primary"
                                @click="editRowEvent(data.row)">编辑</tiny-button>
                        </template>
                    </tiny-grid-column>
                </tiny-grid>
                <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <dictionaryForm :dicID="dicID" @close="dialogClose" />
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
import { queryDictionaryList, deleteDictionary } from '@/api/dictionary';
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
const fetchData = ref({
    api: getData
})
const tableData = ref([
])
const boxVisibility = ref(false)
const dicID = ref(0)
const formData = ref({
    dicType: "",
    moduleName: "",
    dicKey: "",
    dicValue: "",
    dicDescription: "",
})
const gridRef = ref()
const activeNames = ref(['0'])

async function queryClick() {
    getData({ page: pagerConfig.value.attrs });
    gridRef.value.handleFetch();
}
// 获取列表数据
async function getData({ page }) {
    const { currentPage, pageSize } = page;
    formData.value.pageIndex = currentPage;
    formData.value.pageSize = pageSize;
    let response = await queryDictionaryList(formData.value);
    tableData.value = response.data;
    return Promise.resolve({
        result: tableData.value,
        page: { total: response.count },
    })
}
// 行操作
const editRowEvent = (row) => {
    dicID.value = row.dicID;
    console.log(dicID.value);
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
            dicID.value = 0;
            boxVisibility.value = true;
            break
        }
        case 'deleteSelection': {
            let ids = $grid.getSelectRecords().map((item) => { return item.dicID });
            console.log(ids);
            await deleteDictionary(ids);
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
    dicID.value = 0;
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