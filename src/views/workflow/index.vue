<template>
    <div class="tiny-demo">
        <BWrapper v-if="true"></BWrapper>
        <tiny-nav-menu :before-skip="handleSkip" prevent :data="menuData"></tiny-nav-menu>
        <iframe :src="bridgeUrl" width="100%" height="800px" id="workflow"
            sandbox="allow-scripts allow-same-origin allow-forms" frameborder="0">
            <p>您的浏览器不支持iframe标签。</p>
        </iframe>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Button as TinyButton, TinyNavMenu } from '@opentiny/vue';
import BWrapper from '@/views/BWrapper.vue';
import { useWorkFlowStore } from '@/store';
import router from '@/router';
import checkPermission from "@/utils/permission";

import workflowaxios from './components/workflow-axios';

const flyflowToken = ref(''); // 从后端获取的Flyflow临时Token
const userWorkFlowStore = useWorkFlowStore();

const bridgeUrl = ref(`${import.meta.env.VITE_API_WORKFLOW_URL}?token=${userWorkFlowStore.user.tokenValue}`); // Flyflow桥接页面地址

const menuData = ref([
    {
        title: '首页',
        url: '/dashboard',
        id: '1',
        hidden: true
    },
    {
        title: '流程管理',
        url: '/flow',
        id: '2',
        children: [
            {
                title: '流程组',
                url: '/flow/group',
                id: '2-1'
            },
            {
                title: '创建流程',
                url: '/flow/create',
                id: '2-2'
            },
            {
                title: '流程列表',
                url: '/flow/list',
                id: '2-3'
            }
        ]
    },
    {
        title: '任务管理',
        url: '',
        id: '3',
        children: [
            {
                title: '消息列表',
                url: '/system/message',
                id: '3-1'
            },
            {
                title: '待办任务',
                url: '/task/pending',
                id: '3-2'
            },
            {
                title: '我的发起',
                url: '/task/task/started',
                id: '3-3'
            },
            {
                title: '抄送给我',
                url: '/task/cc',
                id: '3-3'
            },
            {
                title: '我的已办',
                url: '/task/completed',
                id: '3-3'
            }
        ]
    },
])
function handleSkip({ url }) {
    const iframe = document.getElementById('workflow');
    iframe.contentWindow.postMessage({ type: 'ROUTE_CHANGE', path: url }, '*');
    console.log('url',url);
    //console.log(iframe.contentWindow);
    return false
}

const getFlyflow = async () => {
    bridgeUrl.value = `${import.meta.env.VITE_API_WORKFLOW_URL}?token=${userWorkFlowStore.user.tokenValue}`;
};


onMounted(() => {
    //getFlyflow();
    //console.log(router.currentRoute.value.meta.locale);
    // TODO 加入到权限控制中
    //console.log(checkPermission([router.currentRoute.value.meta.locale,'审批']));
});

</script>

<style scoped></style>