<template>
  <div class="container">
      <Breadcrumb :items="['menu.systemManager', 'menu.menu']" />
      <div class="content">
        <div class="content-main">
          <tiny-button type="primary" @click="add()">新增根目录</tiny-button>
          <div class="tiny-tree">
            <tiny-tree ref="treeRef" :data="data" :props="props" node-key="id" highlight-current current-node-key="1"
              :show-contextmenu="true" :indent="16" show-line size="medium" default-expand-all
              :expand-on-click-node="false">
              <template #operation="{ node }">
                <tiny-link type="success" @click="editMenuEvent(node, 'add')">
                  新增子目录
                </tiny-link>
                &nbsp;
                <tiny-link type="primary" @click="editMenuEvent(node, 'edit')">
                  修改
                </tiny-link>
                &nbsp;
                <tiny-link cltypess="info" @click="editMenuEvent(node, 'delete')">
                  删除
                </tiny-link>
              </template>
            </tiny-tree>
          </div>
        </div>
        <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
          <dictionaryForm :menuID="menuID" :parentID="parentID" @close="dialogClose" />
        </tiny-dialog-box>
      </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse, TinyTree, CollapseItem as TinyCollapseItem, TinyLink,
} from '@opentiny/vue';
import { queryMenuTreeList, deleteMenu } from '@/api/fetchInterface';
import GeneralLayout from '@/layout/general-layout.vue';
import dictionaryForm from './components/form.vue';

const props = ref({
  label: 'menuName', // 别名
  id: 'menuID'
})
const data = ref([

])
const tableData = ref([
])
const menuID = ref(0)
const parentID = ref(0)
const boxVisibility = ref(false)

// 获取列表数据
async function getData() {
  let response = await queryMenuTreeList();
  data.value = response.data;
}
const add = async () => {
  parentID.value = null;
  menuID.value = 0;
  boxVisibility.value = true;
}
// 行操作
const editMenuEvent = async (row, action) => {
  if (action === 'edit') {
    menuID.value = row.data.menuID;
    boxVisibility.value = true;
  }
  else if (action === 'add') {
    parentID.value = row.data.menuID;
    menuID.value = 0;
    boxVisibility.value = true;
  }
  else {
    await deleteMenu([row.data.menuID]);
    Modal.message({
      message: '删除成功!',
      status: 'success',
    });
    await getData();
  }
}
// 关闭弹窗
async function dialogClose() {
  menuID.value = 0;
  boxVisibility.value = false;
  await getData();
}
// 初始化请求数据
onMounted(async () => {
  await getData();
});
</script>

<style lang="less" scoped>

.tiny-tree {
  height: 100%;
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
  padding: 15px 15px;
}

.search-btn {
  height: 30px;
  width: 100px;
  border-radius: 4px;
}
</style>