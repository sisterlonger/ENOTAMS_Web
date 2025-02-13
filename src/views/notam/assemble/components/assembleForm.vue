<template>
  <div>
    <tiny-divider v-if='false' content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
      content-color="#ffffff">基本信息</tiny-divider>
    <tiny-divider content-position="left" offset="5%" font-size="20px" content-background-color="#1476ff"
      content-color="#ffffff">报文内容</tiny-divider>
    <tiny-form v-if="preCondition" overflow-title label-width="120px" :rules="rules">
      <tiny-row>
        <tiny-form-item label="报文类型">
          <!--单选框-->
          <tiny-radio-group v-model="createData.messageType">
            <tiny-radio-button v-for="(item, index) in messageTypeOption" :label="item" :value="item"
              :key="index"></tiny-radio-button>
          </tiny-radio-group>
        </tiny-form-item>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="12">
          <tiny-form-item label="Q项">
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="情报区">
                <tiny-input v-model="createData.qAirSpace" disabled> </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="通告代码">
                <tiny-input v-model="createData.qCode" disabled> </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="飞行类型">
                <tiny-input v-model="createData.qFlightType" disabled> </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="签发目的">
                <tiny-input v-model="createData.qTarget" disabled> </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="范围">
                <tiny-input v-model="createData.qReach" disabled> </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="下限">
                <tiny-select v-model="createData.qLowerLimit" value-field="fl" text-field="fl" render-type="grid"
                  :grid-op="limitOption" @change="onChangeFG('F')"></tiny-select>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="上限">
                <tiny-select v-model="createData.qUpperLimit" value-field="fl" text-field="fl" render-type="grid"
                  :grid-op="limitOption" @change="onChangeFG('G')"></tiny-select>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="纬度">
                <tiny-input placeholder="请输入纬度" v-model="createData.qLat">
                </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="经度">
                <tiny-input placeholder="请输入经度" v-model="createData.qLong">
                </tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="半径">
                <tiny-input placeholder="请输入半径" v-model="createData.qRadius"> </tiny-input>
              </tiny-form-item>
            </tiny-col>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="12">
          <!--情报区或者机场两大类选择器-->
          <tiny-form-item label="A项">
            <tiny-select v-model="createData.a_airSpace" filterable placeholder="请选择情报区/机场" :options="airSpaceOption"
              value-field="codeId" text-field="txtName" clearable @change="onChangeA">
              <tiny-option-group v-for="group in aOptions" :key="group.label" :label="group.label">
                <tiny-option v-for="item in group.options" :key="item.value" :label="item.label"
                  :value="item.value"></tiny-option>
              </tiny-option-group>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-row>
        <tiny-col :span="2.5">
          <!--时间-->
          <tiny-form-item label="B项(开始时间)">
            <tiny-date-picker v-model="createData.b_time" type="datetime" placeholder="请选择时间" format="yyMMddHHmm"
              value-format="yyMMddHHmm"></tiny-date-picker>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="2.5">
          <!--时间-->
          <tiny-form-item label="C项(结束时间)">
            <tiny-date-picker v-model="createData.c_time" type="datetime" placeholder="请选择时间" format="yyMMddHHmm"
              value-format="yyMMddHHmm"></tiny-date-picker>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="3">
          <!--时间段-->
          <tiny-form-item label="D项(时间段)">
            <tiny-input v-model="createData.d_time" placeholder="请输入D项" @focus="onFocus"> </tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--生效时间-->
          <tiny-form-item label="有效期">
            <tiny-radio-group v-model="createData.messageValidType" size="mini">
              <tiny-radio-button v-for="(item, index) in messageValidTypeOption" :label="item" :value="item"
                :key="index"></tiny-radio-button>
            </tiny-radio-group>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="12">
          <!--E项-->
          <tiny-form-item label="E项">
            <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
              <tiny-collapse-item title="示例" name="0">
                <tiny-form-item label="标准规范">
                  <tiny-input v-model="createData.template" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
                <tiny-form-item label="示例文本">
                  <tiny-input v-model="createData.example" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
                <tiny-form-item v-if="false" label="示例图片" class="demo-image__keep-style">
                  <tiny-image :src="url" :preview-src-list="srcList" keep-style></tiny-image>
                </tiny-form-item>
                <tiny-form-item label="备注">
                  <tiny-input v-model="createData.remark" type="textarea" autosize disabled> </tiny-input>
                </tiny-form-item>
              </tiny-collapse-item>
              <tiny-collapse-item title="必填项" name="1">
                <tiny-col>
                  <formgenerator v-if="preCondition" ref="childRef" :keyWord="keyWord" :keyWordLabel="keyWordLabel"
                    :staticData="staticData" />
                </tiny-col>
              </tiny-collapse-item>
              <tiny-collapse-item title="选填项" name="2">
                <tiny-col v-for=" (item, index) in matches.matchesOptionalLabel" :key="'optional' + index" :span="6">
                  <tiny-form-item :label="item">
                    <tiny-input v-model="formData.optionalList[index]" placeholder="请输入" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
              </tiny-collapse-item>
              <tiny-collapse-item title="组装文本" name="3">
                <tiny-form-item label="组装文本">
                  <tiny-input v-model="formData.result" type="textarea" autosize> </tiny-input>
                </tiny-form-item>
                <tiny-form-item style="margin: 15px;">
                  <tiny-button type="primary" @click="onAssemble()"> 组装 </tiny-button>
                  <tiny-button type="primary" @click="copyToClipboard()"> 复制规范到剪切板 </tiny-button>
                </tiny-form-item>
              </tiny-collapse-item>
            </tiny-collapse>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--下限-->
          <tiny-form-item label="F项(下限)">
            <tiny-input v-model="createData.f_lowerLimit" placeholder="请输入下限">
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--上限-->
          <tiny-form-item label="G项(上限)">
            <tiny-input v-model="createData.g_upperLimit" placeholder="请输入上限">
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="12" v-if="false">
          <!--报文-->
          <tiny-form-item label="报文">
            <tiny-input v-model="createData.g_upperLimit" type="textarea" autosize placeholder="请组装报文">
            </tiny-input>
          </tiny-form-item>
        </tiny-col>
      </tiny-row>
      <tiny-form-item>
        <tiny-button type="primary" @click="onAssemble()"> 生成报文 </tiny-button>
        <tiny-button type="primary" @click="onAssemble()"> 生成通知单 </tiny-button>
        <tiny-button type="primary" @click="onAssemble()"> 发送报文 </tiny-button>
      </tiny-form-item>
    </tiny-form>
    <tiny-dialog-box v-if="boxDVisibility" v-model:visible="boxDVisibility"  append-to-body title="编辑" width="30%">
      <dinput  @close="dialogCloseD" />
    </tiny-dialog-box>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, toRefs, onMounted, toRaw } from 'vue'
import {
  Collapse as TinyCollapse,
  CollapseItem as TinyCollapseItem,
  Layout as TinyLayout,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Row as TinyRow,
  Col as TinyCol,
  Input as TinyInput,
  Numeric as TinyNumeric,
  IpAddress as TinyIpAddress,
  Select as TinySelect,
  Option as TinyOption,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Button as TinyButton,
  Modal,
  Image as TinyImage,
  Loading,
  Notify,
  TinyRadioGroup, TinyRadioButton,
  TinyDatePicker,
  TinyOptionGroup,
  TinyDivider,
  DialogBox as TinyDialogBox,
} from '@opentiny/vue'
import { queryAirPortAndAirSpace, queryAirSpaceList, queryAirPortConfig } from '@/api/fetchInterface';
import formgenerator from '@/components/formgenerator/index.vue';
import dinput from '@/components/dinput/index.vue';
import { useUserStore } from '@/store';
import airport from '@/router/routes/modules/airport';


const userStore = useUserStore();
const childRef = ref<any>();
const preCondition = ref(false);
const url = ref(`https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/mountain.png`)
const srcList = ref([
  `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/mountain.png`,
  `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/house.jpg`,
  `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/bridge.jpg`
])
const props = defineProps({
  templateID: Number,
  templateData: Object,
});
const { templateID } = toRefs(props);
const { templateData } = toRefs(props);
const staticData = ref({
  // 跑道号码
  rwyTxtDesig: [],
});
const createData = reactive({
  templateID: null,
  template: '',
  example: '',
  picturePath: '',
  state: '',
  remark: '',
  // 报文类型
  messageType: '',
  // 报文生效类型
  messageValidType: '',
  // Q项
  qAirSpace: "",
  qCode: '',
  qFlightType: '',
  qTarget: '',
  qReach: '',
  qLowerLimit: '',
  qUpperLimit: '',
  qLat: '',
  qLong: '',
  qRadius: '',
  // A项
  a_airSpace: '',
  // B项
  b_time: '',
  // C项
  c_time: '',
  // D项
  d_time: '',
  // E项
  e_data: '',
  // F项
  f_lowerLimit: '',
  // G项
  g_upperLimit: '',
  // H项
  h_coordinate: '',

})
const activeNames = ref(['0', '1', '2', '3'])
const formData = reactive({
  requiredList: [],
  optionalList: [],
  rules: {},
  result: "",
})
const rules = ref({
  radio: [{ required: true, message: '必填', trigger: 'change' }],
})
const airSpaceOption = ref([]);
const aOptions = ref([{
  label: '飞行情报区',
  options: [{ label: "", value: "", }]
},
{
  label: '机场',
  options: [{ label: "", value: "", }]
}]);
const boxDVisibility = ref(false)
const limitOption = reactive({
  height: 400,
  data: [
    { fl: '023', meter: 700, feet: 2300 },
    { fl: '026', meter: 800, feet: 2600 },
    { fl: '030', meter: 900, feet: 3000 },
    { fl: '033', meter: 1000, feet: 3300 },
    { fl: '036', meter: 1100, feet: 3600 },
    { fl: '039', meter: 1200, feet: 3900 },
    { fl: '043', meter: 1300, feet: 4300 },
    { fl: '046', meter: 1400, feet: 4600 },
    { fl: '020', meter: 600, feet: 2000 },
    { fl: '049', meter: 1500, feet: 4900 },
    { fl: '052', meter: 1600, feet: 5200 },
    { fl: '056', meter: 1700, feet: 5600 },
    { fl: '059', meter: 1800, feet: 5900 },
    { fl: '062', meter: 1900, feet: 6200 },
    { fl: '066', meter: 2000, feet: 6600 },
    { fl: '069', meter: 2100, feet: 6900 },
    { fl: '072', meter: 2200, feet: 7200 },
    { fl: '075', meter: 2300, feet: 7500 },
    { fl: '079', meter: 2400, feet: 7900 },
    { fl: '082', meter: 2500, feet: 8200 },
    { fl: '085', meter: 2600, feet: 8500 },
    { fl: '089', meter: 2700, feet: 8900 },
    { fl: '092', meter: 2800, feet: 9200 },
    { fl: '095', meter: 2900, feet: 9500 },
    { fl: '098', meter: 3000, feet: 9800 },
    { fl: '102', meter: 3100, feet: 10200 },
    { fl: '105', meter: 3200, feet: 10500 },
    { fl: '108', meter: 3300, feet: 10800 },
    { fl: '112', meter: 3400, feet: 11200 },
    { fl: '115', meter: 3500, feet: 11500 },
    { fl: '118', meter: 3600, feet: 11800 },
    { fl: '121', meter: 3700, feet: 12100 },
    { fl: '125', meter: 3800, feet: 12500 },
    { fl: '128', meter: 3900, feet: 12800 },
    { fl: '131', meter: 4000, feet: 13100 },
    { fl: '135', meter: 4100, feet: 13500 },
    { fl: '138', meter: 4200, feet: 13800 },
    { fl: '141', meter: 4300, feet: 14100 },
    { fl: '144', meter: 4400, feet: 14400 },
    { fl: '148', meter: 4500, feet: 14800 },
    { fl: '151', meter: 4600, feet: 15100 },
    { fl: '154', meter: 4700, feet: 15400 },
    { fl: '157', meter: 4800, feet: 15700 },
    { fl: '161', meter: 4900, feet: 16100 },
    { fl: '164', meter: 5000, feet: 16400 },
    { fl: '167', meter: 5100, feet: 16700 },
    { fl: '171', meter: 5200, feet: 17100 },
    { fl: '174', meter: 5300, feet: 17400 },
    { fl: '177', meter: 5400, feet: 17700 },
    { fl: '180', meter: 5500, feet: 18000 },
    { fl: '184', meter: 5600, feet: 18400 },
    { fl: '187', meter: 5700, feet: 18700 },
    { fl: '190', meter: 5800, feet: 19000 },
    { fl: '194', meter: 5900, feet: 19400 },
    { fl: '197', meter: 6000, feet: 19700 },
    { fl: '200', meter: 6100, feet: 20000 },
    { fl: '203', meter: 6200, feet: 20300 },
    { fl: '207', meter: 6300, feet: 20700 },
    { fl: '210', meter: 6400, feet: 21000 },
    { fl: '213', meter: 6500, feet: 21300 },
    { fl: '216', meter: 6600, feet: 21600 },
    { fl: '220', meter: 6700, feet: 22000 },
    { fl: '223', meter: 6800, feet: 22300 },
    { fl: '226', meter: 6900, feet: 22600 },
    { fl: '230', meter: 7000, feet: 23000 },
    { fl: '233', meter: 7100, feet: 23300 },
    { fl: '236', meter: 7200, feet: 23600 },
    { fl: '239', meter: 7300, feet: 23900 },
    { fl: '243', meter: 7400, feet: 24300 },
    { fl: '246', meter: 7500, feet: 24600 },
    { fl: '249', meter: 7600, feet: 24900 },
    { fl: '253', meter: 7700, feet: 25300 },
    { fl: '256', meter: 7800, feet: 25600 },
    { fl: '259', meter: 7900, feet: 25900 },
    { fl: '262', meter: 8000, feet: 26200 },
    { fl: '266', meter: 8100, feet: 26600 },
    { fl: '269', meter: 8200, feet: 26900 },
    { fl: '272', meter: 8300, feet: 27200 },
    { fl: '276', meter: 8400, feet: 27600 },
    { fl: '279', meter: 8500, feet: 27900 },
    { fl: '282', meter: 8600, feet: 28200 },
    { fl: '285', meter: 8700, feet: 28500 },
    { fl: '289', meter: 8800, feet: 28900 },
    { fl: '292', meter: 8900, feet: 29200 },
    { fl: '295', meter: 9000, feet: 29500 },
    { fl: '299', meter: 9100, feet: 29900 },
    { fl: '302', meter: 9200, feet: 30200 },
    { fl: '305', meter: 9300, feet: 30500 },
    { fl: '308', meter: 9400, feet: 30800 },
    { fl: '312', meter: 9500, feet: 31200 },
    { fl: '315', meter: 9600, feet: 31500 },
    { fl: '318', meter: 9700, feet: 31800 },
    { fl: '322', meter: 9800, feet: 32200 },
    { fl: '325', meter: 9900, feet: 32500 },
    { fl: '328', meter: 10000, feet: 32800 },
    { fl: '331', meter: 10100, feet: 33100 },
    { fl: '335', meter: 10200, feet: 33500 },
    { fl: '338', meter: 10300, feet: 33800 },
    { fl: '341', meter: 10400, feet: 34100 },
    { fl: '344', meter: 10500, feet: 34400 },
    { fl: '348', meter: 10600, feet: 34800 },
    { fl: '351', meter: 10700, feet: 35100 },
    { fl: '354', meter: 10800, feet: 35400 },
    { fl: '358', meter: 10900, feet: 35800 },
    { fl: '361', meter: 11000, feet: 36100 },
    { fl: '364', meter: 11100, feet: 36400 },
    { fl: '368', meter: 11200, feet: 36800 },
    { fl: '371', meter: 11300, feet: 37100 },
    { fl: '374', meter: 11400, feet: 37400 },
    { fl: '377', meter: 11500, feet: 37700 },
    { fl: '381', meter: 11600, feet: 38100 },
    { fl: '384', meter: 11700, feet: 38400 },
    { fl: '387', meter: 11800, feet: 38700 },
    { fl: '390', meter: 11900, feet: 39000 },
    { fl: '394', meter: 12000, feet: 39400 },
    { fl: '426', meter: 13000, feet: 42600 },
    { fl: '459', meter: 14000, feet: 45900 },
    { fl: '492', meter: 15000, feet: 49200 },
    { fl: '525', meter: 16000, feet: 52500 }
  ],
  columns: [
    { type: 'radio', title: '', width: 30 },
    { field: 'fl', title: 'FL', width: 60 },
    { field: 'meter', title: '米', width: 90 },
    { field: 'feet', title: '英尺', width: 90 },
  ]
});
const messageTypeOption = ref(['新报', '代替报', '取消报']);
const messageValidTypeOption = ref(['EST', 'PERM', 'NEITHER']);
// 初始化请求数据
onMounted(async () => {
  if (templateID.value) {
    fetchData();
  }
  console.log(userStore.airSpace);
  createData.qAirSpace = userStore.airSpace || "";
});

const keyWord = ref();
const keyWordLabel = ref();
function successClick() {
  Notify({
    type: 'success',
    message: '复制到剪贴板成功',
    position: 'top-right'
  })
}
function errorClick(err) {
  Notify({
    type: 'error',
    message: err,
    position: 'top-right'
  })
}

// 定义派发事件
const emit = defineEmits(['close']);
// 加载效果
const state = reactive<{
  loading: any,
}>({
  loading: null,
});
// 非E项的数据变化时，静态数据获取
const fetchConfig = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryAirSpaceList({ pageIndex: 1, pageSize: 100 });
    airSpaceOption.value = data;
  }
  catch (err) {
    console.log(err);
    Modal.alert('获取数据错误');
    emit('close');
  }
  finally {
    state.loading.close();
  }
}
// 静态数据获取
const fetchAirPortAndAirSpace = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryAirPortAndAirSpace();
    aOptions.value = data;
  }
  catch (err) {
    console.log(err);
    Modal.alert('获取数据错误');
    emit('close');
  }
  finally {
    state.loading.close();
  }
}
// 请求数据接口方法
const fetchData = async () => {
  Object.assign(createData, templateData.value);
  handleKeyWord();
  preCondition.value = true;
  await fetchConfig();
  await fetchAirPortAndAirSpace();
};
// 核心算法，提取关键字
function extractContent(input: string): object {
  // 正则表达式匹配$之间的内容
  // 获取必填和选填的表单名
  const regexOptionalLabel = /\$([^$]+)\$\{/g;
  const regexRequiredLabel = /\$([^$]+)\$\【/g;
  // 获取关键字
  const regexOptionalKeyWord = /\$\{([^}]+)\}/g;
  const regexRequiredKeyWord = /\$\【([^】]+)\】/g;
  // 用于存储匹配结果的数组
  const matchesOptionalLabel = [];
  const matchesRequiredLabel = [];
  const matchesOptionalKeyWord = [];
  const matchesRequiredKeyWord = [];
  // 执行匹配并获取所有结果
  let match;
  while ((match = regexOptionalLabel.exec(input))) {
    matchesOptionalLabel.push(match[1]); // 添加每次匹配的结果到数组中，不包括$
  }
  while ((match = regexRequiredLabel.exec(input))) {
    matchesRequiredLabel.push(match[1]); // 添加每次匹配的结果到数组中，不包括$
  }
  while ((match = regexOptionalKeyWord.exec(input))) {
    matchesOptionalKeyWord.push(match[1]); // 添加每次匹配的结果到数组中，不包括$
  }
  while ((match = regexRequiredKeyWord.exec(input))) {
    matchesRequiredKeyWord.push(match[1]); // 添加每次匹配的结果到数组中，不包括$
  }
  // 不能用校验
  formData.requiredList = Array.from({ length: matchesRequiredLabel.length }).map((item, index) => "");
  formData.optionalList = Array.from({ length: matchesOptionalLabel.length }).map((item, index) => matchesOptionalKeyWord[index]);
  keyWord.value = matchesRequiredKeyWord.join(",");
  keyWordLabel.value = matchesRequiredLabel;
  return { matchesOptionalLabel, matchesRequiredLabel, matchesOptionalKeyWord, matchesRequiredKeyWord };
}
let matches = reactive({});
// 提取关键字事件
const handleKeyWord = () => {
  matches = extractContent(createData.template);
}
// 复制到粘贴板
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(formData.result);
    successClick();
  } catch (err) {
    errorClick(err)
  }
}
// 组装事件
function onAssemble() {
  let test = childRef.value.assembleStr();
  formData.requiredList = Object.values(test);
  let assembleText = createData.template;
  matches.matchesRequiredLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$【${matches.matchesRequiredKeyWord[index]}】`, formData.requiredList[index]);
  });
  matches.matchesOptionalLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$\{${matches.matchesOptionalKeyWord[index]}\}`, `${formData.optionalList[index]}`);
  });
  formData.result = assembleText;
}
// A项改变事件，触发了静态数据变化。只有A项和Q项可以触发静态数据变化
async function onChangeA() {
  // TODO 加个if语句判断是否为机场，不然报错，前后端都可以实现
  // 如果选择了机场，那么自动填写坐标和半径
  const { data } = await queryAirPortConfig({ id: createData.a_airSpace });
  if (data) {
    createData.qLat = data.geoLat;
    createData.qLong = data.geoLong;
    staticData.value.rwyTxtDesig = data.rwyList.map((item: any) => { return { value: item.txtDesig, label: item.txtDesig } });
  }
  else {
    createData.qLat = "";
    createData.qLong = "";
    staticData.value.rwyTxtDesig = [];
  }
}
// D项点击事件
function onFocus() {
  boxDVisibility.value = true;
}
function dialogCloseD() {
    boxDVisibility.value = false;
}
// 上下限改变时，触发FG项改变事件
async function onChangeFG(data: string) {
  if (data === 'F') {
    createData.f_lowerLimit = createData.qLowerLimit;
  }
  else {
    createData.g_upperLimit = createData.qUpperLimit;
  }
}

</script>

<style scoped lang="less">
.demo-collapse-wrap {
  .tiny-form-item {
    margin-bottom: 10px;
  }
}

.demo-image__keep-style {
  width: 200px;
}
</style>