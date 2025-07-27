<template>
    <tiny-dialog-box  :modal="false" v-model:visible="show" title="消息" width="30%">
        <div class="demo-image__keep-style">
            <tiny-image :src="url" :preview-src-list="srcList" keep-style></tiny-image>
        </div>
        <template #footer>
            <tiny-button type="primary" @click="show = false"> 确 定 </tiny-button>
        </template>
    </tiny-dialog-box>

</template>

<script setup>
import { ref } from 'vue'
import { Image as TinyImage } from '@opentiny/vue'

const url = ref(`https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/mountain.png`)
const srcList = ref([
    `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/mountain.png`,
    `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/house.jpg`,
    `https://res.hc-cdn.com/tiny-vue-saas/2.2.19.20240417162130/static/images/bridge.jpg`
])
</script>

<style scoped>
.demo-image__keep-style {
    width: 200px;
    height: 200px;
}
</style>