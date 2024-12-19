<template>
  <div>
    <div class="tiny-tree">
      <tiny-tree ref="treeRef" :data="treeData" node-key="id" highlight-current current-node-key="1" show-checkbox
        :show-contextmenu="true" :indent="16" show-line size="medium" default-expand-all :expand-on-click-node="false"
        @check-change="onChange">
      </tiny-tree>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted, defineEmits, defineProps, toRefs } from 'vue'
import {
  Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox, GridToolbar as TinyGridToolbar, Input as TinyInput, Form as TinyForm,
  FormItem as TinyFormItem, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Collapse as TinyCollapse, TinyTree, CollapseItem as TinyCollapseItem, TinyLink,
} from '@opentiny/vue';
import { queryMenuPermissionTreeList } from '@/api/fetchInterface';

const emit = defineEmits(['onChange']);
const props = defineProps({
  menuPermissions: {
    type: Array,
    default() {
      return [];
    },
  },
});
const { menuPermissions } = toRefs(props);
const treeData = ref([])
const tableData = ref([
])
const menuID = ref(0)
const parentID = ref(0)
const boxVisibility = ref(false)

// 获取列表数据
async function getData() {
  let response = await queryMenuPermissionTreeList();
  treeData.value = response.data;
  handleCheckKey(menuPermissions);
}
// 组件ref
const treeRef = ref(null);
// 树节点变化，传递值到父组件
const onChange = function (data, node, vm) {
  let checkedData = treeRef.value.getCheckedNodes(true);
  emit('onChange', checkedData);
  //console.log("checkedData", checkedData);

}
// 
const handleCheckKey = (checkedData) => {
  let checkedIds = checkedData.value.map(item => { return `${item.menuID}|${item.permissionID}`});
  treeRef.value.setCheckedKeys(checkedIds);
}

// 初始化请求数据
onMounted(async () => {
  await getData();
});
</script>

<style lang="less" scoped>
.tiny-tree {
  overflow-y: auto;
}
</style>