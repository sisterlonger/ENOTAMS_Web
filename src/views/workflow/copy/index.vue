<template>
    <div v-show="preCondition" class="tiny-demo">
        <iframe :src="bridgeUrl" width="100%" height="900px" id="workflow"  style="opacity:0; transition: opacity 0.3s"
            sandbox="allow-scripts allow-same-origin allow-forms" frameborder="0">
            <p>您的浏览器不支持iframe标签。</p>
        </iframe>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useWorkFlowStore } from '@/store';

const bridgeUrl = ref(''); // Flyflow桥接页面地址
const userWorkFlowStore = useWorkFlowStore();
const preCondition = ref(false);
function handleSkip(url) {
    const iframe = document.getElementById('workflow');
    iframe.contentWindow.postMessage({ type: 'ROUTE_CHANGE', path: url }, '*');
    return false
}

const getFlyflow = async () => {
    // 动态监听 iframe 加载完成
    const iframe = document.getElementById('workflow');
    iframe.onload = () => {
        // 双向确认：等待子页面准备就绪
        const handler = (event) => {
            if (event.data === 'IFRAME_READY') {
                handleSkip('/task/cc');
                window.removeEventListener('message', handler);
            }
        };
        window.addEventListener('message', handler);
        window.addEventListener('message', routeReadyHandler);
        // 超时回退
        setTimeout(() => {
            window.removeEventListener('message', handler);
            handleSkip('/task/cc');
        }, 3000);
    };
    
};
const routeReadyHandler = (event) => {
    const iframe = document.getElementById('workflow');
    if (event.data === 'ROUTE_READY') {
      iframe.style.opacity = '1'; // 渐变显示
      preCondition.value = true;
      window.removeEventListener('message', routeReadyHandler);
    }
  };


onMounted(() => {
    window.addEventListener('message', routeReadyHandler);
    bridgeUrl.value = `http://localhost:3000?token=${userWorkFlowStore.updateUserInfo.tokenValue}`;
    getFlyflow();
});

</script>

<style scoped></style>