<template>
    <div>
        <tiny-tabs v-if="preCondition" v-model="activeName" tab-style="border-card" size="large">
            <!--流程记录-->
            <tiny-tab-item :key="tabsList[0].name" :title="tabsList[0].title" :name="tabsList[0].name">
                <workflow :processInstanceId="processInstanceId" :flowId="flowId" :taskId="taskId"
                    :messageId="messageId" @getCurrentNode="getCurrentNode">
                </workflow>
            </tiny-tab-item>
            <!--PDF预览的内容-->
            <tiny-tab-item :key="tabsList[2].name" :title="tabsList[2].title" :name="tabsList[2].name">
                <exportMessage :formData="formData" :act="'detail'" />
                <materials :messageId="messageId" :templateID="templateID" :isNoAuth="isNoAuth" :act="materialsAct">
                </materials>
                <audit v-if="act === 'edit' && afterCondition" :processInstanceId="processInstanceId" :flowId="flowId"
                    :taskId="taskId" :isInitiator="isInitiator" :isRecipient="isRecipient" :nodeName="nodeName"
                    :messageId="messageId" @close="dialogClose" />
            </tiny-tab-item>
            <!--附件记录-->
            <tiny-tab-item v-if="false" :key="tabsList[1].name" :title="tabsList[1].title" :name="tabsList[1].name">
                <materials :messageId="messageId" :templateID="templateID" :isNoAuth="isNoAuth" :act="materialsAct">
                </materials>
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
const activeName = ref('工作进展')
const tabsList = ref([
    {
        name: '工作进展',
        title: '工作进展',
    },
    {
        name: '佐证材料',
        title: '佐证材料',
    },
    {
        name: 'enotam',
        title: '原始资料通知单',
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
const afterCondition = ref(false);
const departmentTreeData = ref([]);
const materialsAct = ref('detail');
const userStore = useUserStore();
const isInitiator = ref(false);
const isRecipient = ref(false);
const nodeName = ref('');
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
        console.log("formData--------", formData)
        // 控制附件的操控权限
        materialsAct.value = act.value
        if (data.sendDepId === userStore.userInfo.depID) {
            materialsAct.value = "edit"
            isInitiator.value = true;
        }
        if (data.receiveDepId === userStore.userInfo.depID) {
            isRecipient.value = true;
        }
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

function getCurrentNode(node: any) {
    console.log(node)
    nodeName.value = node;
    afterCondition.value = true;
}

// 初始化请求数据
onMounted(async () => {
    let queryParams = route.query;
    if (Number(queryParams.templateID as string) > 0) {
        isNoAuth.value = true;
    }
    await fetchData();
    console.log(materialsAct.value, act.value);
    preCondition.value = true;
    const { data } = await queryDepartmentTreeList();
    departmentTreeData.value = data.children;
});

</script>