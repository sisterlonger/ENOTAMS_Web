<template>
    <div class="container">
        <Breadcrumb :items="['menu.systemManager', 'menu.version']" />
        <div class="content">
            <div class="content-main">
                <tiny-button v-if="userStore.userInfo.userName == 'admin'" type='primary' @click="onPublish">发布版本公告</tiny-button>
                <tiny-time-line :data="data2" vertical shape="dot"></tiny-time-line>
                <tiny-dialog-box v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
                    <div :feedbackID="feedbackID" @close="dialogClose" />
                </tiny-dialog-box>
            </div>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { ref ,reactive} from 'vue'
import {
    TinyTimeLine , DialogBox as TinyDialogBox, TinyButton
} from '@opentiny/vue';
import { queryFeedbackList } from '@/api/fetchInterface';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const data2 = reactive([
  { name: '基本 / primary', time: '2019-11-10 00:00:00', type: 'primary' },
  { name: '成功 / success', time: '2019-11-11 00:01:30', type: 'success' },
  { name: '警告 / warning', time: '2019-11-12 14:20:15', type: 'warning' },
  { name: '危险 / danger', time: '2019-11-13 20:45:50', type: 'danger' },
  { name: '信息 / info', time: '2019-11-14 20:45:50', type: 'info' }
])

const boxVisibility = ref(false)

// 关闭弹窗
function dialogClose() {
    boxVisibility.value = false;
    // 刷新函数
    //queryClick();
}
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
</style>