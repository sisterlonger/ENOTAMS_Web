<template>
  <div>
    <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="small">
      <!--报文记录-->
      <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
        <assembleForm :messageId="localMessageID" :templateID="localTemplateID" :templateData="templateData"
          :isNoAuth="isNoAuth" :act="act" :processInstanceId="processInstanceId || '0'" :flowId="flowId || '0'"
          @close="dialogClose" @createMessage="createMessage" />
      </tiny-tab-item>
      <!--附件记录-->
      <tiny-tab-item :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name"
        :disabled="isEmpty(localMessageID)">
        <materials :messageId="localMessageID" :templateID="localTemplateID" :templateData="templateData"
          :isNoAuth="isNoAuth" :act="act"></materials>
      </tiny-tab-item>
      <!--流程记录-->
      <tiny-tab-item v-if="act === 'edit'" :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name">
        <workflow :processInstanceId="processInstanceId || '0'" :flowId="flowId || '0'" :messageId="localMessageID"></workflow>
      </tiny-tab-item>
      <!-- <tiny-tab-item :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name" :disabled="isEmpty(localMessageID)">
      test2
    </tiny-tab-item> -->
      <!-- <tiny-tab-item :key="tabsList[3].name" :title="tabsList[3].title" :name="tabsList[3].name" :disabled="isEmpty(localMessageID)">
      test3
    </tiny-tab-item> -->
    </tiny-tabs>
    <tiny-dialog-box :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="请选择需要发送的关联通告"
      width="70%">
      <tiny-grid ref="basicGridRef" :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
        @toolbar-button-click="toolbarButtonClickEvent">
        <template #toolbar>
          <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
        </template>
        <tiny-grid-column type="index" width="60"></tiny-grid-column>
        <tiny-grid-column type="selection" width="60"></tiny-grid-column>
        <tiny-grid-column field="circumstances" title="事件场景"></tiny-grid-column>
        <tiny-grid-column field="template" title="模板"></tiny-grid-column>
        <tiny-grid-column field="example" title="例子"></tiny-grid-column>
      </tiny-grid>
    </tiny-dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyTabs, TinyTabItem, Modal, Loading, DialogBox as TinyDialogBox, TinyGrid, TinyGridColumn, Button as TinyButton, TinyGridToolbar } from '@opentiny/vue'
import { queryTemplateDetail, queryByTemplateIdTemplateDetail, postMessage } from '@/api/fetchInterface';
import { useRouter } from 'vue-router';
import { isEmpty } from '@/utils/string-utils';
import { useUserStore } from '@/store';
import assembleForm from './assembleForm.vue';
import materials from './materials.vue';
import workflow from './workflow.vue';

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
    title: '原始资料通知单',
  },
  {
    name: '佐证材料',
    title: '佐证材料',
  },
  {
    name: '工作进展',
    title: '工作进展',
  },
  // {
  //   name: '会商审批',
  //   title: '会商审批',
  // },
])
const toolbarButtons = ref([
  {
    code: 'relate',
    name: '确定关联已选通告',
    type: "primary"
  },
  {
    code: 'cancel',
    name: '无需关联',
    type: "danger"
  },
])
let tableData = reactive<any[]>
const boxVisibility = ref(false)

// 新增时act为add，有templateID，查看通告审核发布时，act为edit，且messageId和templateID都有。其他情况没有任何内容，只能从路由读取
const props = defineProps({
  templateID: Number,
  messageId: Number,
  processInstanceId: String,
  flowId: String,
  act: String,
});
const { templateID } = toRefs(props);
const { messageId } = toRefs(props);
const { processInstanceId } = toRefs(props);
const { flowId } = toRefs(props);
const { act } = toRefs(props);
// 本地响应式变量存储路由参数,会优先接受路由的query，再接收props
const localTemplateID = ref<number | undefined>(undefined);
const localMessageID = ref<number | undefined>(undefined);

const templateData = ref({});
const isNoAuth = ref(false);
const basicGridRef = ref(null)
const preCondition = ref(false);
const userStore = useUserStore();
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
async function dialogClose(status: boolean) {
  // status代表成功发送通告
  // 如果status为true且配置了关联通告，需要关联通告
  if (status && !isEmpty(templateData.value.templateID)) {
    preCondition.value = false;
    await queryByTemplateIdTemplateDetail({ templateId: templateData.value.templateID }).then((res: any) => {
      if (res.code === 200) {
        tableData = res.data;
        boxVisibility.value = true;
        //emit('close');
      }
    })
    //preCondition.value = true;
  } else {
    emit('close');
  }
}

function createMessage(id: number) {
  localMessageID.value = id;
}
// 列表按钮函数
async function toolbarButtonClickEvent({ code }) {
  // 用于多选行，获取已选中的数据，该方法默认返回拷贝的数据，如果需要返回原始响应式数据，则需加上入参 true，如 getSelectRecords(true)
  let data = basicGridRef.value.getSelectRecords(true)
  if (code === "relate") {
    await data.forEach(async (item: any) => {
      await onSend(item)
    })
    // 不填了，直接发送给对应的人员去填写
  }
  else {
    preCondition.value = false;
    emit('close')
  }
}
// 发送关联通告函数
async function onSend(createData: any) {
  Modal.confirm(`确认并开始上报关联通告${createData.qCode}？确定后将无法编辑！`).then(async (res: string) => {
    if (res === 'confirm') {
      let messageData: any = {}
      messageData.qCode = createData.qCode;
      messageData.airSpaceCodeId = userStore.airSpaceCodeId || "";;
      //messageData.type = createData.messageType;
      //messageData.validType = createData.messageValidType;
      //messageData.lat = createData.qLat;
      //messageData.long = createData.qLong;
      messageData.radius = createData.qRadius;
      //messageData.telegramText = createData.telegramText;
      messageData.templateId = createData.templateID;
      messageData.parentId = localMessageID.value;
      await postMessage(messageData).then((res1: any) => {
        if (res1.code === 200) {
          Modal.message({ message: '发送成功', status: 'success' })
        }
      }).catch((err: any) => {
        console.log(err);
        Modal.message({ message: `发送失败，原因${err}`, status: 'error' })
      });
    }
  })
}
// 初始化请求数据
onMounted(async () => {
  let queryParams = route.query;
  if (Number(queryParams.templateID as string) > 0) {
    isNoAuth.value = true;
  }
  localTemplateID.value = Number(queryParams.templateID as string) || templateID.value;
  localMessageID.value = Number(queryParams.messageId as string) || messageId.value;
  if (localTemplateID.value) {
    await fetchData();
    preCondition.value = true;
  }
  console.log("----------------------",localMessageID);

});
</script>