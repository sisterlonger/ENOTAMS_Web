<template>
  <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="small">
    <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
      <assembleForm :messageId="localMessageID" :templateID="localTemplateID" :templateData="templateData" 
      :isNoAuth="isNoAuth" :act="act" @close="dialogClose" @createMessage="createMessage" />
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name" :disabled="isEmpty(localMessageID)">
      <materials :messageId="localMessageID" :templateID="localTemplateID" :templateData="templateData" :isNoAuth="isNoAuth" :act="act"></materials>
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name" :disabled="isEmpty(localMessageID)">
      test2
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[3].name" :title="tabsList[3].title" :name="tabsList[3].name" :disabled="isEmpty(localMessageID)">
      test3
    </tiny-tab-item>
  </tiny-tabs>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyTabs, TinyTabItem, Modal, Loading } from '@opentiny/vue'
import { queryTemplateDetail } from '@/api/fetchInterface';
import { useRouter } from 'vue-router';
import { isEmpty } from '@/utils/string-utils';
import assembleForm from './assembleForm.vue';
import materials from './materials.vue';

const router = useRouter();
const route = router.currentRoute.value;

const emit = defineEmits(['close']);
const state = reactive<{
  loading: any,
}>({
  loading: null,
});
const activeName = ref('enotam')
const tabsList = ref([
  {
    name: 'enotam',
    title: '报文',
  },
  {
    name: '佐证材料',
    title: '佐证材料',

  },
  {
    name: '关键事件集',
    title: '关键事件集',
  },
  {
    name: '会商审批',
    title: '会商审批',
  },
])
const props = defineProps({
  templateID: Number,
  messageId: Number,
  act: String,
});
const { templateID } = toRefs(props);
const { messageId } = toRefs(props);
const { act } = toRefs(props);
// 本地响应式变量存储路由参数,会优先接受路由的query，再接收props
const localTemplateID = ref<number | undefined>(undefined);
const localMessageID = ref<number | undefined>(undefined);

const templateData = ref({});
const isNoAuth = ref(false);
const preCondition = ref(false);
// 请求数据接口方法
const fetchData = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryTemplateDetail({ id: localTemplateID.value });
    templateData.value = data;
  }
  catch (err) {
    console.log(err);
    Modal.alert('获取数据错误');
    emit('close');
  }
  finally {
    state.loading.close();
  }
};
// 关闭弹窗
function dialogClose() {
  emit('close');
}

function createMessage(id: number) {
  localMessageID.value = id;
  console.log(localMessageID.value);
}
// 初始化请求数据
onMounted(async () => {
  let queryParams = route.query;
  if(Number(queryParams.templateID as string)>0){
    isNoAuth.value = true;
  }
  localTemplateID.value = Number(queryParams.templateID as string) || templateID.value;
  localMessageID.value = Number(queryParams.messageId as string) || messageId.value;
  if (localTemplateID.value) {
    await fetchData();
    preCondition.value = true;
  }
});
</script>