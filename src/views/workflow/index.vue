<template>
    <div class="tiny-demo">
        <BWrapper v-if="false"></BWrapper>
        <iframe v-if="true" :src="bridgeUrl" width="100%" height="900px" id="workflow"
            sandbox="allow-scripts allow-same-origin allow-postmessage">
            <p>您的浏览器不支持iframe标签。</p>
        </iframe>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BWrapper from '@/views/BWrapper.vue';
import workflowaxios from './components/workflow-axios';

const bridgeUrl = ref('http://localhost:3000?token'); // Flyflow桥接页面地址
const flyflowToken = ref(''); // 从后端获取的Flyflow临时Token

// 获取Flyflow Token（示例接口）
const getFlyflowToken = async () => {
    await workflowaxios.post('/login/login', {
        phone: '15584589856',
        password: '123456',
        tenantId: "1"
    }).then((res) => {
        console.log(res.data.data);
        flyflowToken.value = res.data.data.tokenValue;
        bridgeUrl.value = `http://localhost:3000?token=${flyflowToken.value}&key1=value1&key2=value2`;
        workflowaxios.defaults.headers.common = {
            'Flyflow-Tenant-Id': '1',
            'AuthUserId': res.data.data.loginId,
            "Authorization": res.data.data.tokenValue,
        }
        /*
        const iframe = document.getElementById('workflow');
        iframe.contentWindow.postMessage({ type: 'ROUTE_CHANGE', path: 'test' }, '*');*/
        workflowaxios.get('/user/getCurrentUserDetail', {
        }).then((res1) => {
            console.log("rest1", res1);
        })
    })
};


onMounted(() => {
    getFlyflowToken();
});

</script>

<style scoped></style>