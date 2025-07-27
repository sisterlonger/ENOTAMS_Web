<template>
    <div class="container">
        <Breadcrumb v-show="false" :items="['menu.source', 'menu.airwaypoint']" />
        <div class="content">
            <div class="content-main">
                <tiny-layout style="width: 100%">
                    <tiny-row>
                        <tiny-col :span="3.5">
                            <tiny-tree-menu :get-menu-data-sync="getNodeDataSync" wrap
                                @node-click="handleNodeClick"></tiny-tree-menu>
                        </tiny-col>
                        <tiny-col :span="8.5">
                            <airwaypointForm :formData="formData" />
                        </tiny-col>
                    </tiny-row>
                </tiny-layout>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import { TreeMenu as TinyTreeMenu, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Modal, Loading } from '@opentiny/vue';
import { queryAirWayPointTree, queryAirWayPointDetail } from '@/api/fetchInterface';
import airwaypointForm from './components/airwaypointForm.vue';

const formData = reactive({});
// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});
const getNodeDataSync = async () => {
    const { data } = await queryAirWayPointTree();
    return data;
}
const handleNodeClick = async (data: any) => {
    if (data.children == null) {
        fetchData(data.id);
    }
}
// 请求数据接口方法
const fetchData = async (ID: string) => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        if (ID && ID !== '0') {
            const { data } = await queryAirWayPointDetail({ id: ID || '0' });
            Object.assign(formData, data);
        }
    }
    catch (err) {
        Modal.alert('获取数据错误');
    }
    finally {
        state.loading.close();
    }
};

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