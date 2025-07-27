<template>
    <div class="container">
        <Breadcrumb v-show="false" :items="['menu.board', 'menu.feedback']" />
        <div class="content">
            <div class="content-main">
                <!--查询组件、选择-->
                <tiny-collapse v-model="activeNames">
                    <tiny-collapse-item title="查询" name="0">
                        <tiny-form label-width="100px" label-position="right" class="filter-form" size="small">
                            <tiny-row>
                                <tiny-col :span="4">
                                    <tiny-form-item label="反馈内容">
                                        <tiny-input v-model="formData.content" placeholder="请输入反馈内容"
                                            clearable></tiny-input>
                                    </tiny-form-item>
                                </tiny-col>
                                <tiny-col :span="4">
                                    <tiny-form-item label="审批意见">
                                        <tiny-input v-model="formData.comment" placeholder="请输入审批意见"
                                            clearable></tiny-input>
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
                    <tiny-grid-column field="content" title="反馈内容"></tiny-grid-column>
                    <tiny-grid-column field="comment" title="审批意见"></tiny-grid-column>
                    <tiny-grid-column field="state" title="状态"></tiny-grid-column>
                    <tiny-grid-column title="操作" width="300" align="center">
                        <template #default="data">
                            <tiny-button v-if="userStore.userInfo.userID == data.row.userID && data.row.state != '已处理'"
                                size="mini" type="primary" @click="editRowEvent('edit', data.row)">编辑</tiny-button>
                            <tiny-button v-permission="[router.currentRoute.value.meta.locale, '审批']" size="mini"
                                type="info" @click="editRowEvent('audit', data.row)">审批</tiny-button>
                            <tiny-button v-if="userStore.userInfo.userID == data.row.userID && data.row.state != '已处理'"
                                size="mini" type="danger" @click="editRowEvent('delete', data.row)">删除</tiny-button>
                        </template>
                    </tiny-grid-column>
                </tiny-grid>
                <tiny-dialog-box  :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <feedbackForm :feedbackID="feedbackID" :action="action" @close="dialogClose" />
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
import router from '@/router';
import { queryFeedbackList, deleteFeedback } from '@/api/fetchInterface';
import { useUserStore } from '@/store';
import feedbackForm from './components/form.vue';

const userStore = useUserStore();

const pagerConfig = ref({
    attrs: {
        currentPage: 1,
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        align: 'left', // 可选状态：['left', 'center', 'right']
        layout: 'total, prev, pager, next, jumper, sizes'
    }
})
const fetchData = ref({
    api: getData
})
const tableData = ref([
])
const boxVisibility = ref(false)
const feedbackID = ref(0)
const action = ref('')
const formData = ref({
    content: "",
    comment: "",
    state: "",
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
    let response = await queryFeedbackList(formData.value);
    tableData.value = response.data;
    return Promise.resolve({
        result: tableData.value,
        page: { total: response.count },
    })
}
// 行操作
const editRowEvent = async (flag, row) => {
    if (flag === 'edit') {
        feedbackID.value = row.feedbackID;
        action.value = 'edit';
        boxVisibility.value = true;
    }
    else if (flag === 'audit') {
        feedbackID.value = row.feedbackID;
        action.value = 'audit';
        boxVisibility.value = true;
    }
    else if (flag === 'delete') {
        await deleteFeedback([row.feedbackID]);
        Modal.message({
            message: '删除成功!',
            status: 'success',
        });
    }
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
            feedbackID.value = 0;
            action.value = 'edit';
            boxVisibility.value = true;
            break
        }
        case 'deleteSelection': {
            let ids = $grid.getSelectRecords().map((item) => { return item.feedbackID });
            await deleteFeedback(ids);
            Modal.message({
                message: '删除成功!',
                status: 'success',
            });
            await queryClick();
            break
        }
        default:
    }
}
// 关闭弹窗
function dialogClose() {
    feedbackID.value = 0;
    boxVisibility.value = false;
    action.value = '';
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