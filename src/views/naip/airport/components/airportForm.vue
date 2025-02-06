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
        <tiny-row class="title">机场信息</tiny-row>
        <tiny-row>
          <tiny-col :span="3">
            <tiny-form-item label="机场名称" prop="txtName">
              <tiny-input v-model="formData.txtName"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="机场类型" prop="codeTypeMilOps">
              <tiny-input v-model="formData.codeTypeMilOps"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="机场四字码" prop="codeId">
              <tiny-input v-model="formData.codeId"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="机场三字码" prop="codeIada">
              <tiny-input v-model="formData.codeIada"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="纬度" prop="geoLat">
              <tiny-input v-model="formData.geoLat"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="经度" prop="geoLong">
              <tiny-input v-model="formData.geoLong"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="机场磁差" prop="geoLong">
              <tiny-input v-model="formData.geoLong"></tiny-input>
            </tiny-form-item>
          </tiny-col>
          <tiny-col :span="3">
            <tiny-form-item label="机场标高" prop="valElev">
              <tiny-input v-model="formData.geoLong"></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
        <tiny-row class="title">跑道信息</tiny-row>
        <tiny-grid
          ref="theGridRef"
          :data="formData.rwyList"
          seq-serial
          :stripe="true"
          :expand-config="expandConfigData"
          @toggle-expand-change="expandChange"
        >
          <tiny-grid-column type="index" title="序号"></tiny-grid-column>
          <tiny-grid-column field="txtDesig" title="跑道号"></tiny-grid-column>
          <tiny-grid-column field="valLen" title="跑道长度(M)"></tiny-grid-column>
          <tiny-grid-column field="valWid" title="跑道宽度(M)"></tiny-grid-column>
          <tiny-grid-column
            field="codeComposition"
            title="跑道材质"
          ></tiny-grid-column>
          <tiny-grid-column field="codeStrength" title="PCN"></tiny-grid-column>
          <tiny-grid-column
            field="txtDescrStrength"
            title="道面强度描述"
            width='30%'
          ></tiny-grid-column>
          <tiny-grid-column type="expand" title="操作" width='5%'>
            <template #default>
              <tiny-grid :data="expandTableData">
                <tiny-grid-column field="txtDesig" title="逻辑跑道名称"></tiny-grid-column>
                <tiny-grid-column field="valTrueBrg" title="真方向"></tiny-grid-column>
                <tiny-grid-column
                  field="valElev"
                  title="跑道入口标高"
                ></tiny-grid-column>
                <tiny-grid-column
                  field="txtSlope"
                  title="跑道坡度"
                  show-overflow
                ></tiny-grid-column>
               <tiny-grid-column
                  field="valSlipDistance"
                  title="TORA"
                  show-overflow
                ></tiny-grid-column>
                <tiny-grid-column
                  field="valTakeoffDistance"
                  title="TODA"
                  show-overflow
                ></tiny-grid-column>
                <tiny-grid-column
                  field="valLandingDistance"
                  title="LDA"
                  show-overflow
                ></tiny-grid-column>
                <tiny-grid-column
                  field="valAsda"
                  title="ASDA"
                  show-overflow
                ></tiny-grid-column>
                <!-- <tiny-grid-column
                  field="valThrDisplace"
                  title="入口内移距离"
                  show-overflow
                ></tiny-grid-column>
                <tiny-grid-column
                  field="valThrElev"
                  title="入口内移标高"
                  show-overflow
                ></tiny-grid-column> -->
              </tiny-grid>
            </template>
          </tiny-grid-column>
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
const expandTableData = ref({});
const { formData } = toRefs(props);
const expandConfigData = ref({
  expandAll: false, // 默认展开所有行
  trigger: 'row', // 触发方式 default（点击按钮触发）,cell（点击单元格触发）,row（点击行触发）
  accordion: true, // 对于同一级的节点，每次只能展开一个
});
const expandChange = async ({ row, rowIndex }) => {
  const { data } = await queryRwyDirectionDetail({ id: row.rwyId });
  expandTableData.value = data;
};
</script>

<style scoped>
.title {
  font-size: 20px;
  color: #000000;
  font-weight: bold;
  margin: 10px;
}
</style>