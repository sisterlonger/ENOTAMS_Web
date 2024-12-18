<template>
    <div class="container">
        <Breadcrumb :items="['menu.role']" />
        <div class="content">
            <div class="content-main">
                <!--查询组件、选择-->
                <tiny-collapse v-model="activeNames">
                    <tiny-collapse-item title="查询" name="0">
                        <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
                            <tiny-row>
                                <tiny-col :span="4">
                                    <tiny-form-item label="角色名">
                                        <tiny-input v-model="formData.roleName" placeholder="请输入角色名"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="角色类型">
                                        <tiny-input v-model="formData.roleType" placeholder="请输入角色类型"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="角色等级">
                                        <tiny-input v-model="formData.roleLevel" placeholder="请输入角色等级"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="备注">
                                        <tiny-input v-model="formData.remark" placeholder="请输入备注"
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
                    @toolbar-button-click="toolbarButtonClickEvent">
                    <template #toolbar>
                        <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
                    </template>
                    <tiny-grid-column type="index" width="60"></tiny-grid-column>
                    <tiny-grid-column type="selection" width="60"></tiny-grid-column>
                    <tiny-grid-column field="roleName" title="角色名" show-overflow></tiny-grid-column>
                    <tiny-grid-column field="roleType" title="角色类型"></tiny-grid-column>
                    <tiny-grid-column field="roleLevel" title="角色级别"></tiny-grid-column>
                    <tiny-grid-column field="remark" title="备注"></tiny-grid-column>
                    <tiny-grid-column title="操作" width="200" align="center">
                        <template #default="data">
                            <tiny-button size="mini" type="primary" @click="editRowEvent(data.row)">编辑</tiny-button>
                        </template>
                    </tiny-grid-column>
                </tiny-grid>
                <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="60%">
                    <roleForm :roleID="roleID" @close="dialogClose" />
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
import { queryRoleList, deleteRole } from '@/api/role';
import roleForm from './components/form.vue';


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
const roleID = ref(0)
const formData = ref({
    roleType: "",
    roleName: "",
    roleLevel: "",
    remark: "",
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
    let response = await queryRoleList(formData.value);
    tableData.value = response.data;
    return Promise.resolve({
        result: tableData.value,
        page: { total: response.count },
    })
}
// 行操作
const editRowEvent = (row) => {
    roleID.value = row.roleID;
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
            roleID.value = 0;
            boxVisibility.value = true;
            break
        }
        case 'deleteSelection': {
            let ids = $grid.getSelectRecords().map((item) => { return item.roleID });
            console.log(ids);
            await deleteRole(ids);
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
    roleID.value = 0;
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