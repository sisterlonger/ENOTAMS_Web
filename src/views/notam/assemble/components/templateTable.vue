<template>
  <div>
    <tiny-grid ref="theGridRef" :data="tableData.value" seq-serial :stripe="true"
      :edit-config="{ trigger: 'manual', mode: 'cell', autoClear: false }">
      <!-- <tiny-grid-column type="index" width="5%"></tiny-grid-column> -->
      <tiny-grid-column field="qCode" title="事件场景" width="20%" :filter="nameFilter"></tiny-grid-column>
      <tiny-grid-column field="example" title="例子" width="20%" :filter="nameFilter"></tiny-grid-column>
      <tiny-grid-column field="template" title="标准规范" width="30%" :filter="nameFilter"></tiny-grid-column>
            <tiny-grid-column field="remark" title="备注" width="20%" :filter="nameFilter"></tiny-grid-column>
      <tiny-grid-column title="操作" width="10%" align="center">
        <template #default="data">
          <tiny-button size="mini" @click="selectRowEvent(data.row)" type="primary"> 选择 </tiny-button>
        </template>
      </tiny-grid-column>
    </tiny-grid>
    <tiny-dialog-box :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="需要发布通告的内容" width="80%"
      max-height="1000px" top="5%" :close-on-click-modal="true">
      <enotam :templateID="templateID" act='add' @close="dialogClose" />
    </tiny-dialog-box>
  </div>
</template>

<script setup>

import { ref, defineProps, toRefs } from 'vue'
import { Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox } from '@opentiny/vue'
import assembleForm from './assembleForm.vue';
import enotam from './enotam.vue';

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  tableData: {},
});
const activedRow = ref('')
const theGridRef = ref('theGridRef')
const boxVisibility = ref(false)
const templateID = ref(0)

const selectRowEvent = (row) => {
  templateID.value = row.templateID;
  boxVisibility.value = true;
}

const nameFilter = ref({
  multi: true,
  enumable: true,
  defaultFilter: false,
  inputFilter: true
})
// 关闭弹窗
function dialogClose() {
  templateID.value = 0;
  boxVisibility.value = false;
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