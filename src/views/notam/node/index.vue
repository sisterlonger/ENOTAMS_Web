<template>
    <div class="container">
        <Breadcrumb v-show="false" :items="['menu.notam', 'menu.node']" />
        <div class="content">
            <div class="content-main">
                <tiny-layout style="width: 100%">
                    <tiny-row>
                        <tiny-col :span="3">
                            <tiny-tree-menu :get-menu-data-sync="getNodeDataSync" :props="mapField" wrap
                                @node-click="handleNodeClick"></tiny-tree-menu>
                        </tiny-col>
                        <tiny-col :span="9">
                            <tiny-sticky :z-index="1000" target=".content-main" :offset="160">
                                <templateConfig :tableData="tableData" />
                            </tiny-sticky>
                        </tiny-col>
                    </tiny-row>
                </tiny-layout>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { TreeMenu as TinyTreeMenu, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, TinySticky } from '@opentiny/vue';
import { useUserStore } from '@/store';
import { queryNodeTree, queryNodeTemplate } from '@/api/fetchInterface';
import templateConfig from './components/templateConfig.vue';


const userStore = useUserStore();
const tableData = reactive({});
const mapField = reactive({
    id: 'nodeID',
    label: 'nodeName',
})
const getNodeDataSync = async () => {
    const { data } = await queryNodeTree();
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
    width: 100%;
}

</style>