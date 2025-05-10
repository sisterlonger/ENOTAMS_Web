<template>
    <div class="container">
        <Breadcrumb :items="['menu.systemManager', 'menu.userlist']" />
        <div class="content">
            <div class="content-main">
                <!--查询组件、选择-->
                <tiny-collapse v-model="activeNames">
                    <tiny-collapse-item title="查询" name="0">
                        <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
                            <tiny-row>
                                <tiny-col :span="4">
                                    <tiny-form-item label="用户名">
                                        <tiny-input v-model="formData.userName" placeholder="请输入用户名"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="角色">
                                        <tiny-input v-model="formData.role" placeholder="请输入角色" clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="部门">
                                        <tiny-cascader v-model="formData.depName" :options="departmentOptions"
                                            style="width:100%"
                                            :props="{ emitPath: false, value: 'depName', label: 'depName', expandTrigger: 'hover' }"
                                            autosize filterable clearable>
                                        </tiny-cascader>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item>
                                        <div>
                                            <tiny-button v-permission="[router.currentRoute.value.meta.locale, '查询']"
                                                class="search-btn" type="primary" @click="queryClick">
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
                    <tiny-grid-column field="userName" title="用户名"></tiny-grid-column>
                    <tiny-grid-column field="role" title="角色"></tiny-grid-column>
                    <tiny-grid-column field="depName" title="部门"></tiny-grid-column>
                    <tiny-grid-column field="mobile" title="手机号"></tiny-grid-column>
                    <tiny-grid-column field="email" title="邮箱"></tiny-grid-column>
                    <tiny-grid-column title="操作" width="200" align="center">
                        <template #default="data">
                            <tiny-button size="mini" type="primary" @click="editRowEvent(data.row)">编辑</tiny-button>
                        </template>
                    </tiny-grid-column>
                </tiny-grid>
                <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <userForm :userID="userID" @close="dialogClose" />
                </tiny-dialog-box>
            </div>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import {
    Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
    FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse,
    CollapseItem as TinyCollapseItem, Cascader as TinyCascader,
} from '@opentiny/vue';
import router from '@/router';
import { queryUserList, deleteUser, queryDepartmentTreeList } from '@/api/fetchInterface';
import { useWorkFlowStore } from '@/store';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import userForm from './components/form.vue';


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
const userID = ref(0)
const formData = ref({
    userName: "",
})
const gridRef = ref()
const activeNames = ref(['0'])

const departmentOptions = ref([
])
const userWorkFlowStore = useWorkFlowStore();


async function queryClick() {
    //getData({ page: pagerConfig.value.attrs });
    gridRef.value.handleFetch();
}
// 获取列表数据
async function getData({ page }) {
    const { currentPage, pageSize } = page;
    formData.value.pageIndex = currentPage;
    formData.value.pageSize = pageSize;
    let response = await queryUserList(formData.value);
    tableData.value = response.data;
    return Promise.resolve({
        result: tableData.value,
        page: { total: response.count },
    })
}
// 行操作
const editRowEvent = (row) => {
    userID.value = row.userID;
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
            userID.value = 0;
            boxVisibility.value = true;
            break
        }
        case 'deleteSelection': {
            let ids = $grid.getSelectRecords().map((item) => { return item.userID });
            await deleteUser(ids).then(res => {
                workflowaxios.defaults.headers.common = {
                    'Flyflow-Tenant-Id': '1',
                    'AuthUserId': userWorkFlowStore.user.loginId,
                    "Authorization": userWorkFlowStore.user.tokenValue,
                }
                let flag = true;
                ids.forEach((id) => {
                    workflowaxios.delete('/user/delete', { data: { id: String(id) } }).then((res1) => {
                        if (res1.data.ok === false) {
                            Modal.alert('提交失败!');
                            flag = false;
                        }
                    })
                });
                if (flag) {
                    Modal.message({
                        message: '删除成功!',
                        status: 'success',
                    });
                }
            });
            await queryClick();
            break
        }
        default:
    }
}
// 关闭弹窗
function dialogClose() {
    userID.value = 0;
    boxVisibility.value = false;
    queryClick();
}
const getNodeDataSync = async () => {
    const { data } = await queryDepartmentTreeList();
    return data.children;
}
// 初始化请求数据
onMounted(async () => {
    departmentOptions.value = await getNodeDataSync();
    const apiUrl = import.meta.env;
    console.log("apiUrl", apiUrl);
    console.log(router.currentRoute.value.meta.locale);
});

</script>

<style lang="less" scoped>
.tiny-grid {
    height: 60vh;
    overflow-y: visible;
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