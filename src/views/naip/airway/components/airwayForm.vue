<template>
  <div>
    <div class="demo-form">
      <tiny-form
        ref="ruleFormRef"
        :model="formData.value"
        :rules="rules"
        label-suffix=":"
        label-width="150px"
        :display-only="true"
      >
        <tiny-row class="title">航路信息（民航航路）</tiny-row>
        <tiny-row>
          <tiny-col :span="3">
            <tiny-form-item label="航路信息" prop="txtDesig">
              <tiny-input v-model="formData.txtDesig"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="航路类型" prop="txtLocType">
              <tiny-input v-model="formData.txtLocType"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
        <tiny-row class="title">航路数据</tiny-row>
        <tiny-grid
          ref="theGridRef"
          :data="formData.segments"
          seq-serial
          :stripe="true"
        >
          <tiny-grid-column type="index" title="序号"></tiny-grid-column>
          <tiny-grid-column
            field="codePointStartEnd"
            title="航段"
          ></tiny-grid-column>
          <tiny-grid-column
            field="valLen"
            title="航段距离(KM)"
          ></tiny-grid-column>
          <tiny-grid-column
            field="valLenSeamile"
            title="航段距离(NM)"
          ></tiny-grid-column>
          <tiny-grid-column
            field="valMtca"
            title="最低安全高度(m)"
          ></tiny-grid-column>
          <tiny-grid-column
            field="valMagTrackRadio"
            title="磁航迹(度)"
          ></tiny-grid-column>
        </tiny-grid>
      </tiny-form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, onMounted, watch } from 'vue';
import {
  TinyForm,
  TinyFormItem,
  TinyInput,
  TinyRow,
  TinyCol,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from '@opentiny/vue';

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  formData: { type: Object, required: true },
});
const { formData } = toRefs(props);
</script>

<style scoped>
.title {
  font-size: 20px;
  color: #000000;
  font-weight: bold;
  margin: 10px;
}
</style>