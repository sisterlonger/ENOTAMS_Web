<template>
  <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="small">
    <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
      <assembleForm :templateID="templateID" :templateData="templateData" @close="dialogClose" />
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name">
      <materials :templateID="templateID" :templateData="templateData"></materials>
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name">
      test2
    </tiny-tab-item>
    <tiny-tab-item :key="tabsList[3].name" :title="tabsList[3].title" :name="tabsList[3].name">
      test3
    </tiny-tab-item>
  </tiny-tabs>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyTabs, TinyTabItem, Modal, Loading } from '@opentiny/vue'
import { queryTemplateDetail } from '@/api/fetchInterface';
import assembleForm from './assembleForm.vue';
import materials from './materials.vue';

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
});
const { templateID } = toRefs(props);
const templateData = ref({});
const preCondition = ref(false);
// 请求数据接口方法
const fetchData = async () => {
  state.loading = Loading.service({
    text: 'loading...',
    target: document.getElementById('container'),
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const { data } = await queryTemplateDetail({ id: templateID.value });
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
// 初始化请求数据
onMounted(async () => {
  if (templateID.value) {
    await fetchData();
    preCondition.value = true;
  }
});
</script>