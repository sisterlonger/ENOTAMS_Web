<template>
  <div>
    <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="small">
      <!--报文记录-->
      <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
        <div v-if="!isEmpty(parentId) && (messageType === 'cnl' || messageType === 'replace')">本单{{messageType === 'cnl'?'取消':'代替'}}了【{{
          parentMessageFormData.notamSn }}】的原始资料通知单，及发布的【{{ parentMessageFormData.aftnSn }}】</div>
        <assembleForm :messageId="localMessageID" :parentId="parentId" :messageType="messageType"
          :templateID="localTemplateID" :templateData="templateData" :isNoAuth="isNoAuth" :act="act"
          :processInstanceId="processInstanceId || '0'" :flowId="flowId || '0'" @close="dialogClose"
          @createMessage="createMessage" />
      </tiny-tab-item>
      <!--附件记录-->
      <tiny-tab-item v-if="false" :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name">
        <materials :messageId="localMessageID" :templateID="localTemplateID" :isNoAuth="isNoAuth" :act="act">
        </materials>
      </tiny-tab-item>
      <!--流程记录-->
      <tiny-tab-item v-if="act === 'edit'" :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name">
        <workflow :processInstanceId="processInstanceId || '0'" :flowId="flowId || '0'" :messageId="localMessageID">
        </workflow>
      </tiny-tab-item>
    </tiny-tabs>
    <tiny-dialog-box :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="请选择需要发送的关联通告"
      width="90%">
      <tiny-grid ref="basicGridRef" :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }" resizable :fit="true"
        @toolbar-button-click="toolbarButtonClickEvent">
        <template #toolbar>
          <tiny-grid-toolbar :buttons="toolbarButtons"></tiny-grid-toolbar>
        </template>
        <tiny-grid-column type="index" width="60"></tiny-grid-column>
        <tiny-grid-column type="selection" width="60"></tiny-grid-column>
        <tiny-grid-column field="qCode" title="需发布关联通告的主题" width="100"></tiny-grid-column>
        <tiny-grid-column field="circumstances" title="需发布关联通告的事件场景"></tiny-grid-column>
        <!--选择框-->
        <tiny-grid-column ref="cascaderDepRef" field="sendDepId" width="50%" title="需通知关联通告的所属单位" :editor="{
          component: TinyCascader,
          attrs: {
            filterable: true, clearable: true,
            options: departmentTreeData,
            props: {
              children: 'children',
              value: 'depID',
              label: 'depName',
              emitPath: false,
              multiple: true,
            },
            placeholder: '请选择所属单位',
            style: { width: '100%' }
          },
        }" :format-text="formatMulti"></tiny-grid-column>
      </tiny-grid>
    </tiny-dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyTabs, TinyTabItem, Modal, Loading, DialogBox as TinyDialogBox, TinyGrid, TinyGridColumn, Button as TinyButton, TinyGridToolbar, TinyCascader } from '@opentiny/vue'
import { queryTemplateDetail, queryByTemplateIdTemplateDetail, postBatchMessage, queryDepartmentTreeList, queryMessageDetail } from '@/api/fetchInterface';
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
])
const toolbarButtons = ref([
  {
    code: 'relate',
    name: '通知关联单位',
    type: "primary"
  },
  {
    code: 'cancel',
    name: '无需通知',
    type: "danger"
  },
])
let tableData = reactive<any[]>
const boxVisibility = ref(false)

// 新增时act为add，有templateID，查看通告审核发布时，act为edit，且messageId和templateID都有。其他情况没有任何内容，只能从路由读取
const props = defineProps({
  templateID: Number,
  messageId: Number,
  parentId: Number,
  processInstanceId: String,
  flowId: String,
  act: String,
  messageType: String,
});
const { templateID } = toRefs(props);
const { messageId } = toRefs(props);
const { parentId } = toRefs(props);
const { processInstanceId } = toRefs(props);
const { flowId } = toRefs(props);
const { act } = toRefs(props);
const { messageType } = toRefs(props);
// 本地响应式变量存储路由参数,会优先接受路由的query，再接收props
const localTemplateID = ref<number | undefined>(undefined);
const localMessageID = ref<number | undefined>(undefined);
const assbleFormMessageData = reactive({});

const templateData = ref({});
const isNoAuth = ref(false);
const basicGridRef = ref(null)
const preCondition = ref(false);
const departmentTreeData = ref([]);
const userStore = useUserStore();
const cascaderDepRef = ref()
const parentMessageFormData = ref({})
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
    console.log(parentId, parentId.value);
    if (!isEmpty(parentId.value)) {
      await getParentMessage()
    }
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
  console.log(status, templateData.value.templateID);
  if (status && !isEmpty(templateData.value.templateID)) {
    preCondition.value = false;
    // 有关联通告才需要填写
    await queryByTemplateIdTemplateDetail({ templateId: templateData.value.templateID }).then((res: any) => {
      if (res.code === 200) {
        console.log("tableData", tableData);
        tableData = res.data;
        if (tableData.length > 0) {
          tableData.forEach((item: any) => {
            item.sendDepId = null;
          });
          boxVisibility.value = true;
        }
        else {
          emit('close');
        }
      }
    })
    //preCondition.value = true;
  } else {
    emit('close');
  }
}

function createMessage(id: number, data: any) {
  localMessageID.value = id;
  Object.assign(assbleFormMessageData, data);

}
// 列表按钮函数
// 列表按钮函数
async function toolbarButtonClickEvent({ code }) {
  // 用于多选行，获取已选中的数据，该方法默认返回拷贝的数据，如果需要返回原始响应式数据，则需加上入参 true，如 getSelectRecords(true)
  // 勾选的才会去关联发送
  let data = basicGridRef.value.getSelectRecords(true)
  //let data1 = basicGridRef.value.getData();
  // ----------------------处理成列表
  console.log(data);
  //console.log(data1);
  if (code === "relate") {
    // 1. 检查是否勾选了数据
    if (!data || data.length === 0) {
      Modal.message({ message: '请先勾选要发送的数据', status: 'warning' });
      return;
    }

    // 2. 检查每个元素中的sendDepId是否为空
    const hasEmptySendDepId = data.some((item: any) => {
      // 根据实际情况调整判断条件
      return !item.sendDepId || item.sendDepId.length === 0;
    });

    if (hasEmptySendDepId) {
      Modal.message({ message: '勾选的数据中存在未选择部门的情况，请检查', status: 'warning' });
      return;
    }

    // 提取qCode列表，不截取，全部展示
    const qCodeList = data.map((item: any) => item.qCode).join('、');

    // 批量发送逻辑
    Modal.confirm(`确认并开始上报关联通告（${qCodeList}），共 ${data.length} 条？确定后将无法编辑！`).then(async (res: string) => {
      if (res === 'confirm') {
        // 构建批量消息数据数组
        let messageList = data.map((item: any) => {
          let messageData: any = {};
          messageData.qCode = item.qCode;
          messageData.airSpaceCodeId = userStore.airSpaceCodeId || "";
          messageData.type = "新发报文";
          messageData.radius = item.qRadius;
          messageData.templateId = item.templateID;
          messageData.parentId = localMessageID.value;
          // ###############差时间
          messageData.validType = assbleFormMessageData.validType;
          messageData.startTime = assbleFormMessageData.startTime;
          messageData.endTime = assbleFormMessageData.endTime;
          // 注意：这里使用了consultDepId，但上面检查的是sendDepId
          // 如果sendDepId和consultDepId是同一个字段，请保持一致
          messageData.consultDepId = item.sendDepId.join(",");
          return messageData;
        });
        //console.log("messageList--------------------", messageList)
        // 调用批量接口
        await postBatchMessage(messageList).then((res1: any) => {
          if (res1.code === 200) {
            Modal.message({ message: '发送成功', status: 'success' })
            emit('close')
          }
        }).catch((err: any) => {
          console.log(err);
          Modal.message({ message: `发送失败，原因${err}`, status: 'error' })
        });
      }
    })
  }
  else {
    preCondition.value = false;
    emit('close')
  }
}

// 处理选择的部门
function formatMulti(value) {
  //console.log(value);
  //console.log("cellValue", value.cellValue);
  //console.log("options",value.column.editor.attrs.options);

  // 使用对象解构
  const { cellValue: depIds } = value;
  const { options } = value.column.editor.attrs;

  // 如果cellValue不是数组或为空，直接返回空字符串
  if (!Array.isArray(depIds) || depIds.length === 0) {
    return '';
  }

  // 递归查找所有节点，建立depID到fullName的映射
  const depIdToFullNameMap = {};

  // 递归遍历树的函数 - 使用 forEach 替代 for...of
  function traverseTree(nodes) {
    if (!Array.isArray(nodes)) {
      return;
    }

    nodes.forEach((node) => {
      // 将当前节点的depID和fullName存入映射表
      if (node.depID !== undefined && node.fullName !== undefined) {
        depIdToFullNameMap[node.depID] = node.fullName;
      }

      // 递归遍历子节点
      if (node.children && Array.isArray(node.children)) {
        traverseTree(node.children);
      }
    });
  }

  // 开始遍历选项树
  traverseTree(options);

  // 根据depIds获取对应的fullName
  const fullNames = depIds
    .map(depId => depIdToFullNameMap[depId]) // 转换为fullName
    .filter(fullName => fullName !== undefined && fullName !== null && fullName !== ''); // 过滤掉无效值

  console.log("映射表:", depIdToFullNameMap);
  console.log("找到的fullNames:", fullNames);

  // 用逗号分隔并返回
  return fullNames.join(',');
}
// 获取父通告的信息
async function getParentMessage() {
  const { data: detailData } = await queryMessageDetail({ id: parentId.value });
  Object.assign(parentMessageFormData.value, detailData);
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
  const { data } = await queryDepartmentTreeList();
  departmentTreeData.value = data.children;
  //dialogClose(true);
  // // 测试用，后面删除
  // await queryByTemplateIdTemplateDetail({ templateId: templateData.value.templateID }).then((res: any) => {
  //   if (res.code === 200) {
  //     tableData = res.data;
  //     if (tableData.length > 0) {
  //       boxVisibility.value = true;
  //     }
  //     else {
  //       emit('close');
  //     }
  //   }
  // })

});
</script>