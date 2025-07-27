<template>
    <div>
      <tiny-grid ref="theGridRef" :data="tableData.value" seq-serial
        :edit-config="{ trigger: 'manual', mode: 'cell', autoClear: false }">
        <tiny-grid-column type="index" width="60"></tiny-grid-column>
        <tiny-grid-column field="template" title="标准规范"></tiny-grid-column>
        <tiny-grid-column field="example" title="例子"></tiny-grid-column>
        <tiny-grid-column field="remark" title="备注"></tiny-grid-column>
        <tiny-grid-column field="state" title="状态" show-overflow="ellipsis"></tiny-grid-column>
        <tiny-grid-column title="操作" width="200" align="center">
          <template #default="data">
            <tiny-button size="mini" type="primary"  @click="editRowEvent(data.row)"> 编辑 </tiny-button>
          </template>
        </tiny-grid-column>
      </tiny-grid>
      <tiny-dialog-box  :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="50%">
        <templateForm :templateID="templateID" :destroy-on-close="true" @close="dialogClose" />
      </tiny-dialog-box>
    </div>
  </template>
  
  <script setup>
  
  import { ref, defineProps, toRefs } from 'vue'
  import { Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton,DialogBox as TinyDialogBox } from '@opentiny/vue'
  import templateForm from './form.vue'
  
  const props = defineProps({
    // eslint-disable-next-line vue/require-prop-types
    tableData: {},
  });
  const theGridRef = ref('theGridRef')
  const boxVisibility = ref(false)
  const templateID = ref(0)
  
  const editRowEvent = (row) => {
    templateID.value = row.templateID;
    boxVisibility.value = true;
  
  }
  // 关闭弹窗
  function dialogClose() {
    boxVisibility.value = false;
    templateID.value = 0;
  }
  
  </script>
  
  <style scoped>
  .title {
    font-size: 16px;
    padding: 15px;
    font-weight: bolder;
    color: #444;
  }
  </style>