<template>
    <div class="container">
        <Breadcrumb :items="['menu.source', 'menu.airspace']" />
        <div class="content">
            <div class="content-main">
                <tiny-layout style="width: 100%">
                    <tiny-row>
                        <tiny-col :span="2">
                            <tiny-tree-menu ref="treeMenu" :get-menu-data-sync="getNodeDataSync" wrap
                                @node-click="handleNodeClick"></tiny-tree-menu>
                        </tiny-col>
                        <tiny-col :span="10">
                            <airspaceForm :formData="formData" />
                        </tiny-col>
                    </tiny-row>
                </tiny-layout>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { TreeMenu as TinyTreeMenu, Layout as TinyLayout, Row as TinyRow, Col as TinyCol, Loading, Modal } from '@opentiny/vue';
import { queryAirSpaceTree, queryRestrictedDetail, queryControlledDetail } from '@/api/fetchInterface';
import airspaceForm from './components/airspaceForm.vue';

const treeMenu = ref(null)
const formData = reactive({});
// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});
const getNodeDataSync = async () => {
    const { data } = await queryAirSpaceTree();
    return data;
}
const handleNodeClick = async (data: any) => {
    if (data.children == null) {
        fetchData(data.id, data.type);
    }
}
// 请求数据接口方法
const fetchData = async (ID: string, type: string) => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        if (ID && ID !== '0') {
            const { data } = type === "管制区" ? await queryControlledDetail({ id: ID }) : await queryRestrictedDetail({ id: ID });
            data.class = { codeDistVerUpper: '', valDistVerUpper: '', isContainVerUpper: '', codeDistVerLower: '', valDistVerLower: '', isContainVerLower: '' };
            // 二次处理垂直范围信息
            if (data.controlledClass) {
                data.class = data.controlledClass;
            }
            else if (data.restrictedClass) {
                data.class = data.restrictedClass;
            }
            // 二次处理水平范围信息
            if (data.controlledBorderVertexs && data.controlledBorderVertexs.length > 0) {
                data.borderVertexs = data.controlledBorderVertexs;
            }
            else if (data.restrictedBorderVertexs && data.restrictedBorderVertexs.length > 0) {
                data.borderVertexs = data.restrictedBorderVertexs;
            }
            // 二次处理频率信息(管制区才有频率，限制区没有),而且管制区频率也有可能为空
            if (data.controlledRadios && data.controlledRadios.length > 0) {
                data.radios = data.controlledRadios;
            }
            else {
                data.radios = null;
            }
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