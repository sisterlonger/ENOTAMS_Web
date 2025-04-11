<template>
  <div>
    <div class="demo-form">
      <tiny-form ref="ruleFormRef" :model="formData.value" :rules="rules" label-suffix=":" label-width="150px"
        :display-only="true">
        <tiny-row class="title">管制区/限制区信息</tiny-row>
        <tiny-row>
          <tiny-col :span="3">
            <tiny-form-item label="名称" prop="txtName">
              <tiny-input v-model="formData.txtName"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="编号" prop="codeId">
              <tiny-input v-model="formData.codeId"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="区域类型" prop="txtLocalType">
              <tiny-input v-model="formData.horizontalRange"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="说明" prop="txtRmk">
              <tiny-input v-model="formData.txtRmk"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="6">
            <tiny-form-item label="水平备注" prop="horizontalRange">
              <tiny-input v-model="formData.horizontalRange"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="6">
            <tiny-form-item label="垂直备注" prop="verticalRange">
              <tiny-input v-model="formData.verticalRange"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="限制原因" prop="exRestrictReason">
              <tiny-input v-model="formData.exRestrictReason"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="限制时间" prop="exRestrictTime">
              <tiny-input v-model="formData.exRestrictTime"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
         <tiny-row class="title">垂直范围信息</tiny-row>
        <tiny-row>
          <tiny-col :span="3">
            <tiny-form-item label="气压基准面" prop="codeDistVerUpper">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.codeDistVerUpper"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="高度上限(M)" prop="valDistVerUpper">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.valDistVerUpper"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="是否包含高度上限" prop="isContainVerUpper">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.isContainVerUpper"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="高度下限类型" prop="codeDistVerLower">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.codeDistVerLower"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="高度下限(M)" prop="valDistVerLower">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.valDistVerLower"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="是否包含高度下限" prop="isContainVerLower">
              <tiny-input v-if='formData.class && formData.class.isContainVerLower'
                v-model="formData.class.isContainVerLower"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
        <tiny-row class="title">水平范围信息</tiny-row>
        <tiny-grid ref="theGridRef1"  :data="formData.borderVertexs" seq-serial :stripe="true">
          <tiny-grid-column field="noSeq" title="序号"></tiny-grid-column>
          <tiny-grid-column field="txtName" title="点名称"></tiny-grid-column>
          <tiny-grid-column field="geoLat" title="点纬度"></tiny-grid-column>
          <tiny-grid-column field="geoLong" title="点经度"></tiny-grid-column>
          <tiny-grid-column field="codeType" title="空域类型"></tiny-grid-column>
          <tiny-grid-column field="curveSegmentType" title="线段类型"></tiny-grid-column>
        </tiny-grid>
        <tiny-row class="title" v-if="formData.radios">通信信息</tiny-row>
        <tiny-grid ref="theGridRef"  v-if="formData.radios" :data="formData.radios" seq-serial :stripe="true">
          <tiny-grid-column type="index" title="序号"></tiny-grid-column>
          <tiny-grid-column field="txtSector" title="扇区名称"></tiny-grid-column>
          <tiny-grid-column field="txtFreqType" title="频率类型"></tiny-grid-column>
          <tiny-grid-column field="valFreq" title="频率"></tiny-grid-column>
          <tiny-grid-column field="uomFreq" title="频率单位"></tiny-grid-column>
          <tiny-grid-column field="codeHighlow" title="高低空标志"></tiny-grid-column>
          <tiny-grid-column field="txtOpenTime" title="开放时间"></tiny-grid-column>
        </tiny-grid>
      </tiny-form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, toRefs, onMounted } from 'vue';
import {
  TinyForm,
  TinyFormItem,
  TinyInput,
  TinyRow,
  TinyCol,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from '@opentiny/vue';
import { queryRwyDirectionDetail } from '@/api/fetchInterface';

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  formData: {},
});
const theGridRef = ref('theGridRef');
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