<template>
    <div>
        <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="small">
            <!--PDF预览的内容-->
            <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
                <exportMessage :formData="formData" :act="'detail'" />
                <audit v-if="act === 'edit'" :processInstanceId="processInstanceId" :flowId="flowId" :taskId="taskId"
                    @close="dialogClose" />
            </tiny-tab-item>
            <!--附件记录-->
            <tiny-tab-item :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name">
                <materials :messageId="messageId" :templateID="templateID" :isNoAuth="isNoAuth" :act="act"></materials>
            </tiny-tab-item>
            <!--流程记录-->
            <tiny-tab-item :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name">
                <workflow :processInstanceId="processInstanceId" :flowId="flowId" :messageId="messageId">
                </workflow>
            </tiny-tab-item>
        </tiny-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyTabs, TinyTabItem, Modal, Loading, DialogBox as TinyDialogBox, TinyGrid, TinyGridColumn, Button as TinyButton, TinyGridToolbar, TinyCascader } from '@opentiny/vue'
import { queryDepartmentTreeList, queryMessageDetail } from '@/api/fetchInterface';
import { useRouter } from 'vue-router';
import { isEmpty } from '@/utils/string-utils';
import { useUserStore } from '@/store';
import exportMessage from '@/views/notam/assemble/components/export.vue';
import materials from '@/views/notam/assemble/components/materials.vue';
import workflow from '@/views/notam/assemble/components/workflow.vue';
import audit from './audit.vue';

const router = useRouter();
const route = router.currentRoute.value;

const emit = defineEmits(['close']);
const state = reactive<{
    loading: any,
}>({
    loading: null,
});
const activeName = ref('enotam')
const tabsList = ref([
    {
        name: 'enotam',
        title: '原始资料通知单',
    },
    {
        name: '佐证材料',
        title: '佐证材料',
    },
    {
        name: '工作进展',
        title: '工作进展',
    },
])
let tableData = reactive<any[]>

const props = defineProps({
    templateID: Number,
    messageId: Number,
    act: String,
    processInstanceId: {
        type: String,
        required: false,
        default: "0"
    },
    flowId: {
        type: String,
        required: false,
        default: "0"
    },
    taskId: {
        type: String,
        required: false,
        default: "0"
    }
});

const { templateID } = toRefs(props);
const { messageId } = toRefs(props);
const { processInstanceId } = toRefs(props);
const { flowId } = toRefs(props);
const { taskId } = toRefs(props);
const { act } = toRefs(props);

const formData = reactive({});
const isNoAuth = ref(false);
const preCondition = ref(false);
const departmentTreeData = ref([]);
const userStore = useUserStore();
// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryMessageDetail({ id: messageId.value });
        Object.assign(formData, data);
        console.log("formData--------",formData)
    }
    catch (err) {
        console.log(err);
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
};
// 关闭弹窗
function dialogClose() {
    emit('close');
}


// 初始化请求数据
onMounted(async () => {
    let queryParams = route.query;
    if (Number(queryParams.templateID as string) > 0) {
        isNoAuth.value = true;
    }
    await fetchData();
    preCondition.value = true;
    const { data } = await queryDepartmentTreeList();
    departmentTreeData.value = data.children;
});
</script>