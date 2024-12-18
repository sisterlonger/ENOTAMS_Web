<template>
  <div class="container">
    <Breadcrumb :items="['menu.department']" />
    <div class="content">
      <div class="content-main">
        <tiny-layout>
          <tiny-button type="primary" style="margin: 10px" @click="stepStart">开始引导</tiny-button>
          <tiny-guide :show-step="showStep" :dom-data="domData"></tiny-guide>
          <tiny-row>
            <tiny-col :span="3">
              <tiny-tree-menu v-if="preCondition" class="hight1" ref="treeMenu" :get-menu-data-sync="getNodeDataSync"
                :props="mapField" wrap @node-click="handleNodeClick"></tiny-tree-menu>
            </tiny-col>
            <tiny-col :span="9">
              <department class="hight2" :tableData="tableData" @query="refresh" />
            </tiny-col>
          </tiny-row>
        </tiny-layout>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { TreeMenu as TinyTreeMenu, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Guide as TinyGuide, Button as TinyButton, } from '@opentiny/vue';
import { useUserStore } from '@/store';
import { queryDepartmentTreeList, queryDepartmentDetail } from '@/api/department';
import department from './components/department.vue';


const userStore = useUserStore();
const preCondition = ref(true);
const tableData = reactive({});
const mapField = reactive({
  id: 'depID',
  label: 'depName',
})

const showStep = ref(false);
const treeMenu = ref(null);
const currentNode = ref([])
const expandedKeys = ref([])

const getNodeDataSync = async () => {
  const { data } = await queryDepartmentTreeList();
  return data.children;
}
const handleNodeClick = async (data) => {
  let response = await queryDepartmentDetail({ id: data.depID });
  tableData.value = response.data;
}
const domData = ref([
  {
    title: '部门管理新手引导',
    text: '这边是部门管理的节点数，可以用搜索栏来筛选对应的部门',
    domElement: '.hight1',
    button: [
      {
        text: '下一步',
        action: 'next'
      }
    ]
  },
  {
    title: '这边是操作界面，可以编辑、新增、删除部门节点',
    text: '123',
    domElement: '.hight2',
    button: [
      {
        text: '上一步',
        action: 'back',
        secondary: true
      },
      {
        text: '完成',
        action: 'complete'
      }
    ]
  }
])
function stepStart() {
  showStep.value = !showStep.value
}
// 刷新函数
const refresh = async () => {
  preCondition.value = false;
  await getNodeDataSync();
  preCondition.value = true;

}


// 获得当前节点
const getCurrentNode = () => {
  currentNode.value = treeMenu.value.getCurrentNode();
  expandedKeys.value = [currentNode.value];
  console.log(expandedKeys.value);
}

</script>

<style lang="less" scoped>
.tiny-tree-menu {
  width: 100%;
  overflow-y: auto;
}

:deep(.tiny-tree-menu .tiny-input) {
  margin: var(--tv-TreeMenu-padding-top) var(--tv-TreeMenu-padding-left);
  position: relative;
  max-width: 1880px;
  width: 90%;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 98%;
  height: inherit;
  margin: 0 auto;
  overflow: hidden;

  :deep(.tiny-steps) {
    margin-top: 10px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
}

.content-main {
  padding: 30px 15px;
}
/*
@import '@/assets/style/exception.less';
/* 引入公共样式 */
</style>