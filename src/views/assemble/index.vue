<template>
    <div>
        <Breadcrumb :items="['menu.assemble']" />
        <div class="content">
            <div class="content-main">
                <tiny-layout>
                    <tiny-row>
                        <tiny-col :span="3">
                            <tiny-tree-menu :get-menu-data-sync="getNodeDataSync" :props="mapField" wrap
                                @node-click="handleNodeClick"></tiny-tree-menu>
                        </tiny-col>
                        <tiny-col :span="9">
                            <templateTable :tableData="tableData" />
                        </tiny-col>
                    </tiny-row>
                </tiny-layout>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { TreeMenu as TinyTreeMenu, Layout as TinyLayout, Row as TinyRow, Col as TinyCol } from '@opentiny/vue';
import { useUserStore } from '@/store';
import { queryNodeTree, queryNodeTemplate } from '@/api/node';
import templateTable from './components/templateTable.vue';


const userStore = useUserStore();
const tableData = reactive({});
const mapField = reactive({
    id: 'nodeID',
    label: 'nodeName',
})
const getNodeDataSync = async () => {
    const { data } = await queryNodeTree();
    console.log("userStore.userInfo", userStore.userInfo.userCode, userStore.userInfo.userName, userStore.userInfo.role);
    return data.children;
}
const handleNodeClick = async (data) => {
    let response = await queryNodeTemplate({ id: data.nodeID });
    tableData.value = response.data;
}

</script>

<style lang="less" scoped>
.tiny-tree-menu {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
}

:deep(.tiny-tree-menu .tiny-input) {
    margin: var(--tv-TreeMenu-padding-top) var(--tv-TreeMenu-padding-left);
    position: relative;
    max-width: 1880px; 
    width: 90%;
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
    padding: 15px 15px;
}
</style>