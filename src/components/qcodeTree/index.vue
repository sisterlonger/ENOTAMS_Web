<template>
  <div>
    <!-- <tiny-tree-menu class="demo-tree-menu" node-key="id" show-checkbox :data="treeData"></tiny-tree-menu>  -->
    <tiny-row>
      <tiny-col :span="9">
        <tiny-tree ref="treeRef" class="qcodetree" :data="treeData" node-key="nodeID" :props="mapField"
          highlight-current current-node-key="1" show-checkbox :show-contextmenu="true" :indent="16" show-line
          size="medium" :expand-on-click-node="false" @check-change="onChange">
        </tiny-tree>
      </tiny-col>
    </tiny-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,defineProps ,defineEmits,toRefs,watch} from 'vue'
import { Row as TinyRow, Col as TinyCol, TinyTree } from '@opentiny/vue'
import { queryNodeTree } from '@/api/fetchInterface';

const emit = defineEmits(['onChange']);
const props = defineProps({
  qCodePermissions: {
    type: Array,
    default() {
      return [];
    },
  },
});

// 组件ref
const treeRef = ref(null);

const { qCodePermissions } = toRefs(props);
// 组件数据
const treeData = ref({})

watch(qCodePermissions, (newPermissions) => {
    handleCheckKey(newPermissions)
})


// 获取数据
const getNodeDataSync = async () => {
  const { data } = await queryNodeTree();
  treeData.value = data.children;
  handleCheckKey(qCodePermissions)
}
//映射
const mapField = reactive({
  id: 'nodeID',
  label: 'nodeName',
})
// 变化事件
const onChange = (data) => {
  let checkedData = treeRef.value.getCheckedNodes(true);
  console.log(checkedData);
  emit('onChange', checkedData);
}
// 处理初始化的勾选
const handleCheckKey = (checkedData) => {
  treeRef.value.setCheckedKeys(checkedData);
}
// 初始化请求数据
onMounted(async () => {
  await getNodeDataSync()
});
</script>

<style lang="less" scoped>
.qcodetree {
  max-height: 500px;
  overflow: auto;
}
</style>
