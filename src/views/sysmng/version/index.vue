<template>
    <div class="container">
        <Breadcrumb v-show="false" :items="['menu.systemManager', 'menu.version']" />
        <div class="content">
            <div class="content-main">
                <tiny-button v-if="userStore.userInfo.userName == 'admin'" type='primary'
                    @click="onPublish">发布版本公告</tiny-button>
                <tiny-time-line vertical shape="dot" name-field="title">
                    <tiny-timeline-item v-for="(item, i) in lineData" :key="i" :node="item" :nodeIndex="i">
                        <template #description>
                            <!--时间-->
                            <div class="timeline-time">
                                {{ item.createTime.substring(0,10) }}
                            </div>
                            <!--内容-->
                            <div class="timeline-content">
                                {{ item.content }}
                            </div>
                        </template>
                    </tiny-timeline-item>
                </tiny-time-line>
                <tiny-dialog-box  :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <versionForm @close="dialogClose" />
                </tiny-dialog-box>
            </div>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref, reactive, onMounted } from 'vue'
import {
    TinyTimeLine, DialogBox as TinyDialogBox, TinyButton, TinyTimelineItem
} from '@opentiny/vue';
import { queryVersionList } from '@/api/fetchInterface';
import { useUserStore } from '@/store';
import versionForm from './components/form.vue';

const userStore = useUserStore();

const lineData = reactive([
])

const boxVisibility = ref(false)

function onPublish() {
    boxVisibility.value = true;
}
// 关闭弹窗
async function dialogClose() {
    boxVisibility.value = false;
    // 刷新函数
    await getData();
}
// 获取列表数据
async function getData() {
    let response = await queryVersionList();
    lineData.length = 0;
    response.data.reverse().forEach(item => {
        item.type = 'success';
        lineData.push(item);
    });
}
// 初始化请求数据
onMounted(async () => {
    await getData();
});
</script>

<style lang="less" scoped>
.tiny-grid {
    overflow-y: auto;
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
    padding: 15px 15px 50px;
}

.search-btn {
    height: 30px;
    width: 100px;
    border-radius: 4px;
}

.timeline-time {
    font-size: var(--tv-Steps-timeline-item-secondary-text-font-size);
    color: var(--tv-Steps-timeline-item-secondary-text-color);
}
</style>