<template>
  <div>
    <div class="demo-form">
      <tiny-form ref="ruleFormRef" :model="formData.value" :rules="rules" label-suffix=":" label-width="150px"
        :display-only="true">
        <tiny-row class="title">航路点信息</tiny-row>
        <tiny-row>
          <tiny-col :span="4">
            <tiny-form-item label="名称" prop="txtName">
              <tiny-input v-model="formData.txtName"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="报告点类型" prop="codeTypeMilOps">
              <tiny-input v-model="formData.codeTypeMilOps"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="纬度" prop="geoLat">
              <tiny-input v-model="formData.geoLat"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="经度" prop="geoLong">
              <tiny-input v-model="formData.geoLong"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="呼号" prop="codeId">
              <tiny-input v-model="formData.codeId"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="频率" prop="valFreq">
              <tiny-input v-model="formData.valFreq"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="波道" prop="codeChannel">
              <tiny-input v-model="formData.codeChannel"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="4">
            <tiny-form-item label="频率单位" prop="uomFreq">
              <tiny-input v-model="formData.uomFreq"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
      </tiny-form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, onMounted } from 'vue';
import {
  TinyForm,
  TinyFormItem,
  TinyInput,
  TinyRow,
  TinyCol,
} from '@opentiny/vue';

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  formData: {},
});
const { formData } = toRefs(props);
onMounted(async () => {
  console.log(formData);
});
</script>

<style scoped>
.title {
  font-size: 20px;
  color: #000000;
  font-weight: bold;
  margin: 10px;
}
</style>