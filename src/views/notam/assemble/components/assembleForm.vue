<template>
  <div>
    <tiny-form v-if="preCondition" overflow-title label-width="100px" :rules="rules">
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
            <formgenerator v-if="preCondition" ref="childRef" :keyWord="keyWord" :keyWordLabel="keyWordLabel" />
          </tiny-col>
        </tiny-collapse-item>
        <tiny-collapse-item title="选填项" name="2">
          <tiny-col v-for=" (item, index) in matches.matchesOptionalLabel" :key="'optional' + index" :span="6">
            <tiny-form-item :label="item">
              <tiny-input v-model="formData.optionalList[index]" placeholder="请输入" clearable></tiny-input>
            </tiny-form-item>
          </tiny-col>
        </tiny-collapse-item>
      </tiny-collapse>
      <tiny-form-item label="组装文本">
        <tiny-input v-model="formData.result" type="textarea" autosize> </tiny-input>
      </tiny-form-item>
      <tiny-form-item>
        <tiny-button type="primary" @click="onAssemble()"> 组装 </tiny-button>
        <tiny-button type="primary" @click="copyToClipboard()"> 复制规范到剪切板 </tiny-button>
      </tiny-form-item>
    </tiny-form>
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
} from '@opentiny/vue'
import { queryTemplateDetail } from '@/api/fetchInterface';
import formgenerator from '@/components/formgenerator/index.vue';

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
});
const { templateID } = toRefs(props);

const createData = reactive({
  templateID: null,
  template: '',
  example: '',
  picturePath: '',
  state: '',
  remark: '',
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
// 初始化请求数据11
onMounted(async () => {
  if (templateID.value) {
    fetchData();
  }
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


// 请求数据接口方法
const fetchData = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryTemplateDetail({ id: templateID.value });
    Object.assign(createData, data);
    handleKeyWord();
    //preCondition.value = true;
    preCondition.value = true;
  }
  catch (err) {
    Modal.alert('获取数据错误');
    emit('close');
  }
  finally {
    state.loading.close();
  }
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

</script>

<style scoped lang="less">
.demo-collapse-wrap {
  .tiny-collapse-item__content>* {
    line-height: 1.8;
  }

  margin-bottom: 20px;
}

.demo-image__keep-style {
  width: 200px;
}
</style>