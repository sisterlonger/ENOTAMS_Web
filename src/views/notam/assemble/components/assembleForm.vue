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
                <tiny-input v-model="createData.qLowerLimit" disabled></tiny-input>
              </tiny-form-item>
            </tiny-col>
            <tiny-col :span="2" style="margin:2px">
              <tiny-form-item label-width="80px" label="上限">
                <tiny-input v-model="createData.qUpperLimit" disabled></tiny-input>
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
        <tiny-col :span="3">
          <!--情报区或者机场两大类选择器-->
          <tiny-form-item label="A项">
            <tiny-select v-model="createData.a_airSpace" filterable placeholder="请选择情报区/机场" value-field="codeId"
              text-field="txtName" clearable @change="onChangeA">
              <tiny-option-group v-for="group in aOptions" :key="group.label" :label="group.label">
                <tiny-option v-for="item in group.options" :key="item.value" :label="item.label"
                  :value="item.value"></tiny-option>
              </tiny-option-group>
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
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
        <tiny-col :span="4">
          <!--生效时间-->
          <tiny-form-item label="有效期">
            <tiny-radio-group v-model="createData.messageValidType" size="mini">
              <tiny-radio-button v-for="(item, index) in messageValidTypeOption" :label="item" :value="item"
                :key="index"></tiny-radio-button>
            </tiny-radio-group>
          </tiny-form-item>
        </tiny-col>
        <tiny-row>
          <tiny-col :span="5.5">
            <!--时间段-->
            <tiny-form-item label="D项(时间段)">
              <tiny-input v-model="createData.d_time" placeholder="请输入D项" @focus="onFocus"> </tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-row>
        <tiny-col :span="12">
          <!--E项-->
          <tiny-form-item label="E项">
            <tiny-collapse v-model="activeNames" class="demo-collapse-wrap">
              <tiny-collapse-item title="示例" name="示例">
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
              <tiny-collapse-item title="必填项" name="必填项">
                <tiny-col>
                  <formgenerator v-if="preCondition" ref="childRef" :keyWord="keyWord" :keyWordLabel="keyWordLabel"
                    :staticData="staticData" />
                </tiny-col>
              </tiny-collapse-item>
              <tiny-collapse-item title="选填项" name="选填项">
                <tiny-col v-for="(item, index) in matches.matchesOptionalLabel" :key="'optional' + index" :span="6">
                  <tiny-form-item :label="item">
                    <tiny-input v-model="eFormData.optionalList[index]" placeholder="请输入" clearable></tiny-input>
                  </tiny-form-item>
                </tiny-col>
              </tiny-collapse-item>
              <tiny-collapse-item title="组装文本" name="组装文本">
                <tiny-form-item label="组装文本">
                  <tiny-input v-model="eFormData.result" type="textarea" autosize> </tiny-input>
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
          <!--基准面格式-->
          <tiny-form-item label="基准面格式">
            <tiny-select v-model="createData.baseType" value-field="fg" text-field="fg" :grid-op="baseTypeOption"
              render-type="grid" @change="onChangeBaseType()" placeholder="请选择基准面格式">
            </tiny-select>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--下限-->
          <tiny-form-item label="F项(下限)">
            <tiny-input v-model="createData.f_lowerLimit" placeholder="请输入下限"
              :disabled="createData.baseType.split('-')[0] == 'SFC' || createData.baseType.split('-')[0] == 'GND'"
              @click="onFocusFG('F')"></tiny-input>
          </tiny-form-item>
        </tiny-col>
        <tiny-col :span="4">
          <!--上限-->
          <tiny-form-item label="G项(上限)">
            <tiny-input v-model="createData.g_upperLimit" placeholder="请输入上限"
              :disabled="createData.baseType.split('-')[1] === 'UNL'" @click="onFocusFG('G')"></tiny-input>
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
    <tiny-dialog-box v-if="boxDVisibility" v-model:visible="boxDVisibility" append-to-body title="编辑时间段" width="35%"
      :close-on-click-modal="false">
      <schedulePicker @scheduleChange="handleScheduleChange" @close="dialogClose" />
    </tiny-dialog-box>
    <tiny-dialog-box v-show="boxFVisibility" v-model:visible="boxFVisibility" append-to-body title="编辑F项" width="35%"
      :close-on-click-modal="false">
      <fgInput :baseType='baseType' :fgType='fgType' @fgChange="changeFG" @close="dialogClose" />
    </tiny-dialog-box>
    <tiny-dialog-box v-show="boxGVisibility" v-model:visible="boxGVisibility" append-to-body title="编辑G项" width="35%"
      :close-on-click-modal="false">
      <fgInput :baseType='baseType' :fgType='fgType' @fgChange="changeFG" @close="dialogClose" />
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
import { queryAirPortAndAirSpace, queryAirPortConfig, queryAirSpaceConfig } from '@/api/fetchInterface';
import formgenerator from '@/components/formgenerator/index.vue';
import schedulePicker from '@/components/schedulePicker/index.vue';
import fgInput from '@/components/fginput/index.vue';
import { useUserStore } from '@/store';
import airport from '@/router/routes/modules/airport';
import { limitOption } from '@/constants/limitOptions';

const handleScheduleChange = (rule: any) => {
  console.log('生成的规则：', rule)
  // 示例输出：
  // {
  //   type: 'weekly',
  //   time: '1430',
  //   days: ['MON', 'WED', 'FRI']
  // }
}

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
// 机场、情报区数据
const staticData = ref({
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
  // F/G项的基准面
  baseType: "",
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
// 基准面
const baseType = ref<any>('');
// 弹窗的f/g的类型
const fgType = ref<any>('');
// 折叠变量
const activeNames = ref(['示例', '必填项', '选填项', '组装文本'])
// 情报区四字码
const airSpaceCodes = ref(["ZBPE", "ZGZU", "ZHWH", "ZJSA", "ZLHW", "ZPKM", "ZSHA", "ZWUQ", "ZYSH",]);
// e项的组装数据
const eFormData = reactive({
  requiredList: [],
  optionalList: [],
  result: "",
})
// 整个弹窗的规则
const rules = ref({
  radio: [{ required: true, message: '必填', trigger: 'change' }],
})
// A项选项
const aOptions = ref([{
  label: '飞行情报区',
  options: [{ label: "", value: "", }]
},
{
  label: '机场',
  options: [{ label: "", value: "", }]
}]);
// D项弹窗显示变量
const boxDVisibility = ref(false)
// FG项弹窗显示变量
const boxFVisibility = ref(false)
const boxGVisibility = ref(false)
// 报文类型
const messageTypeOption = ref(['新报', '代替报', '取消报']);
// 报文有效期类型
const messageValidTypeOption = ref(['EST', 'PERM', 'NEITHER']);
// 基准面类型
const baseTypeOption = ref({
  height: 400,
  data: [
    { fBase: 'SFC', gBase: "UNL", fg: "SFC-UNL" },
    { fBase: 'GND', gBase: "UNL", fg: "GND-UNL" },
    { fBase: 'SFC', gBase: 'XXX M AMSL', fg: "SFC-XXX M AMSL" },
    { fBase: 'GND', gBase: 'XXX M AGL', fg: "GND-XXX M AGL" },
    { fBase: 'XXX M AGL', gBase: 'XXX M AGL', fg: "XXX M AGL-XXX M AGL" },
    { fBase: 'XXX M AMSL', gBase: 'XXX M AMSL', fg: "XXX M AMSL-XXX M AMSL" },
    { fBase: 'FL XXX', gBase: "FL XXX", fg: "FL XXX-FL XXX" },
  ],
  columns: [
    { type: 'radio', title: '', width: "10%" },
    { field: 'fBase', title: 'F)项' },
    { field: 'gBase', title: 'G)项' },
    //{ field: 'fg', title: '', hidden: true },
  ]
});
// 初始化请求数据
onMounted(async () => {
  if (templateID.value) {
    fetchData();
  }
  // 用户只会发自己情报区的电报
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
// A项（情报区/机场）的静态数据获取
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
  eFormData.requiredList = Array.from({ length: matchesRequiredLabel.length }).map((item, index) => "");
  eFormData.optionalList = Array.from({ length: matchesOptionalLabel.length }).map((item, index) => matchesOptionalKeyWord[index]);
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
    await navigator.clipboard.writeText(eFormData.result);
    successClick();
  } catch (err) {
    errorClick(err)
  }
}
// 组装事件
function onAssemble() {
  let test = childRef.value.assembleStr();
  eFormData.requiredList = Object.values(test);
  let assembleText = createData.template;
  matches.matchesRequiredLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$【${matches.matchesRequiredKeyWord[index]}】`, eFormData.requiredList[index]);
  });
  matches.matchesOptionalLabel.forEach((item, index) => {
    assembleText = assembleText.replace(`$${item}$\{${matches.matchesOptionalKeyWord[index]}\}`, `${eFormData.optionalList[index]}`);
  });
  eFormData.result = assembleText;
}
// 获取配置项
const airspaceConfigTypes = [
  { key: 'ndbs', prefix: 'ndbs' },
  { key: 'restricteds', prefix: 'restricteds' },
  { key: 'vors', prefix: 'vors' },
  { key: 'controlleds', prefix: 'controlleds' }
];
const airportConfigTypes = [
  { key: 'rwys', prefix: 'rwys' },
];
// 处理config函数
function processConfig(dataArray, prefix) {
  const config = {};
  // 提取唯一键集合
  const configKeys = [...new Set(dataArray.flatMap(Object.keys))];
  configKeys.forEach(key => {
    const configKey = `${prefix}${key}`;
    const items = createConfigItem(dataArray, key);
    // 根据数组长度决定赋值方式
    config[configKey] = items?.length === 1 ? items[0]?.value : items || [];
  });

  return config;
}
// 处理config函数
function createConfigItem<T>(data: T[], key: keyof T): { value: string; label: string }[] {
  return uniqueByProperty(data, key).map((item: any) => ({
    value: String(item[key]),
    label: String(item[key]),
  }));
}
// 去重函数
function uniqueByProperty(array: any, key: any) {
  const seen = new Set();
  return array.filter((item: any) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};
// A-E、Q。A项改变事件，触发了静态数据变化。只有A项和Q项可以触发静态数据变化
async function onChangeA() {
  // 选择情报区-NDB、VOR/DME、限制区、管制区
  if (airSpaceCodes.value.includes(createData.a_airSpace)) {
    const { data } = await queryAirSpaceConfig({ id: createData.a_airSpace });
    createData.qLat = "";
    createData.qLong = "";
    if (data) {
      const mergedConfig = airspaceConfigTypes.reduce((acc, { key, prefix }) => {
        return Object.assign(acc, processConfig(data[key], prefix));
      }, {});
      Object.assign(staticData.value, mergedConfig);
      // 最外层的情报区数据
      const airspaceKeys = Object.keys(data);
      airspaceKeys.forEach(key => {
        if (typeof data[key] !== 'object') {
          staticData.value[key] = String(data[key]);
        }
      })
    }
    // 情报区信息为空
    else {
      staticData.value = {};
    }
  }
  // 选择了机场-逻辑跑道、物理跑道
  else {
    // 例如选择了机场，那么跑道号就可以筛选出来，同时也可以获取到对应的跑道信息作为参考
    // 如果选择了机场，那么自动填写坐标和半径
    const { data } = await queryAirPortConfig({ id: createData.a_airSpace });
    if (data) {
      createData.qLat = data.geoLat;
      createData.qLong = data.geoLong;
      const mergedConfig = airportConfigTypes.reduce((acc, { key, prefix }) => {
        return Object.assign(acc, processConfig(data[key], prefix));
      }, {});
      Object.assign(staticData.value, mergedConfig);
      // 最外层的机场参数
      const airportKeys = Object.keys(data);
      airportKeys.forEach(key => {
        if (typeof data[key] !== 'object') {
          staticData.value[key] = String(data[key]);
        }
      })
    }
    // 机场信息为空
    else {
      createData.qLat = "";
      createData.qLong = "";
      staticData.value = {};
    }

  }
}
// D项点击事件
function onFocus() {
  boxDVisibility.value = true;
}
// 弹窗关闭事件
function dialogClose() {
  boxDVisibility.value = false;
  boxFVisibility.value = false;
  boxGVisibility.value = false;
  fgType.value = "";
}
// FG项弹窗打开事件
function onFocusFG(data: string) {
  const [f, g] = createData.baseType.split("-")
  if (data === 'F') {
    baseType.value = f
    fgType.value = 'F';
    boxFVisibility.value = true;
  }
  else {
    baseType.value = g
    fgType.value = 'G';
    boxGVisibility.value = true;
  }
}
// FG改变事件,回传值并且更新Q项的上下限
const changeFG = (type: string, data: any, fl: any) => {
  if (type === 'F') {
    createData.f_lowerLimit = data;
    createData.qLowerLimit = fl;
  }
  else if (type === 'G') {
    createData.g_upperLimit = data;
    createData.qUpperLimit = fl;
  }
}
// 上下限改变时，触发FG项改变事件
function onChangeBaseType() {
  // 基准面选择事件-规范F、G的选项
  let fBase = createData.baseType.split("-")[0];
  let gBase = createData.baseType.split("-")[1];
  // 这些情况下，F、G项无需编辑，并且自动修改Q项的值
  if (fBase === "SFC" || fBase === "GND") {
    createData.f_lowerLimit = fBase;
    createData.qLowerLimit = "000";
  }
  else {
    createData.f_lowerLimit = "";
    createData.qLowerLimit = "";
  }
  if (gBase === "UNL") {
    createData.g_upperLimit = gBase;
    createData.qUpperLimit = "999";
  }
  else {
    createData.g_upperLimit = "";
    createData.qUpperLimit = "";
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