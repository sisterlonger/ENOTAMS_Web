<template>
    <div class="demo-form">
        <tiny-form v-if="preCondition" ref="ruleFormRef" overflow-title :model="createData" :rules="rules"
            label-width="200px">
            <tiny-form-item v-if="createData.fullName" label="全称" prop="fullName">
                <tiny-input v-model="createData.fullName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门名" prop="depName">
                <tiny-input v-model="createData.depName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="createData.fullName" label="专业" prop="field">
                <tiny-input v-model="createData.field"></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="createData.fullName" label="所属情报区" prop="field">
                <tiny-select v-model="createData.airSpaceCodeId" placeholder="请选择所属情报区" filterable>
                    <tiny-option v-for="item in airspaceOptions" :key="item.codeId" :label="item.codeId"
                        :value="item.codeId"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item v-if="createData.fullName" label="所属机场" prop="field">
                <tiny-select v-model="createData.airPortCodeId" placeholder="请选择所属机场" filterable>
                    <tiny-option v-for="item in airportOptions" :key="item.codeId" :label="item.codeId"
                        :value="item.codeId"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item v-if="createData.fullName && createData.field === 'FF'" label="负责提供情报服务的机场" prop="field">
                <tiny-select v-model="createData.manageAirPortCodeIds" placeholder="请选择负责提供情报服务的机场" multiple filterable>
                    <tiny-option v-for="item in airportOptions" :key="item.codeId" :label="item.codeId"
                        :value="item.codeId"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item v-if='createData.fullName' label="Q码权限" prop="field">
                <qcodeTree :qCodePermissions="createData.nodes" @onChange="getQCodePermission"></qcodeTree>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
                <tiny-button type="success" @click="addChild()">
                    新增子节点
                </tiny-button>
                <tiny-button type="danger" @click="onDelete()">
                    删除节点
                </tiny-button>
            </tiny-form-item>
        </tiny-form>
        <tiny-dialog-box :modal="false" v-if="boxVisibility" v-model:visible="boxVisibility" title="编辑" width="30%">
            <Child :parentDep="createData" @close="dialogClose" />
        </tiny-dialog-box>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, defineEmits } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric,
    DialogBox as TinyDialogBox, Notify, Select as TinySelect, Option as TinyOption,
} from '@opentiny/vue';
import { iconWarning } from '@opentiny/vue-icon';
import { queryDepartmentDetail, postDepartment, deleteDepartment, queryAirPortList, queryAirSpaceList } from '@/api/fetchInterface';
import { useWorkFlowStore } from '@/store';
import { isEmpty } from '@/utils/string-utils';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import qcodeTree from '@/components/qcodeTree/index.vue';
import Child from './child.vue';


const props = defineProps({
    depID: Number,
});
const { depID } = toRefs(props);
const ruleFormRef = ref();
const boxVisibility = ref(false)
const preCondition = ref(false);
const userWorkFlowStore = useWorkFlowStore();
const airportOptions = ref([]);
const airspaceOptions = ref([]);
const createData = reactive({
    depID: null,
    depName: '',
    field: '',
    parentDepID: "",
    depCode: "",
    parentDepCode: "",
    grade: 0,
    fullName: "",
    airSpaceCodeId: '',
    airPortCodeId: '',
    // 所负责的机场
    manageAirPortCodeIds: [],
    // get
    nodes: [],
    // set
    nodeIds: [],
})
const rules = ref({
    depName: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    field: [
        { required: false, message: '必填', trigger: 'blur' },
    ],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});

const fetchConfig = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        let airportList = await queryAirPortList();
        airportOptions.value = airportList.data;
        let airspaceList = await queryAirSpaceList();
        airspaceOptions.value = airspaceList.data;

    }
    catch (err) {
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
}

// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryDepartmentDetail({ id: depID.value });
        Object.assign(createData, data);
        createData.nodes = [];
        createData.fullName = data.fullName;
        createData.nodes = data.nodes.map((item: any) => { return item.nodeID });
        createData.manageAirPortCodeIds = isEmpty(createData.manageAirPortCodeIds) ?
            [] :
            createData.manageAirPortCodeIds.split(',').filter(Boolean);
    }
    catch (err) {
        console.log(err)
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
};

watch(
    depID,
    (newValue) => {
        if (depID != null && depID.value !== 0) {
            fetchData();
            preCondition.value = true;
        }
        else {
            preCondition.value = false;
        }

    },
    { immediate: true, }
);


// 关闭弹窗
function dialogClose() {
    boxVisibility.value = false;
    emit('query');
}
// 初始化请求数据
onMounted(async () => {
    fetchConfig();
    if (depID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close', 'query']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid: any) => {
        if (valid) {
            // 配置Q码
            createData.nodeIds = createData.nodes;
            createData.manageAirPortCodeIds = createData.manageAirPortCodeIds.join(",");
            /*
            // 组装全称--不需要，这个应该是后端处理
            if (createData.fullName.split("-").pop() !== createData.depName) {
                let strArr = createData.fullName.split("-");
                let font = strArr.slice(0, strArr.length - 1).join("-");
                createData.fullName = `${font}-${createData.depName}`;
            }*/
            await postDepartment(createData).then(res => {
                workflowaxios.defaults.headers.common = {
                    'Flyflow-Tenant-Id': '1',
                    'AuthUserId': userWorkFlowStore.user.loginId,
                    "Authorization": userWorkFlowStore.user.tokenValue,
                }
                let deptData = {
                    id: String(res.data),
                    // 部门id路径，从根到当前叶
                    //rootIdList: res.data.rootIdList,
                    parentId: String(createData.parentDepID),
                    name: createData.depName,
                    // todo直属领导
                    leaderUser: [],
                    status: "1",
                    sort: 1,
                    weight: 1,
                }
                workflowaxios.put('/dept/update', deptData).then((res1) => {
                    if (res1.data.ok === false) {
                        Modal.alert('提交失败!');
                    }
                    else {
                        Modal.alert('提交成功!');
                    }
                });
            });
            fetchData();
        } else {
            Modal.alert('提交失败!');
        }
    })
}

function addChild() {
    boxVisibility.value = true;
}
async function onDelete() {
    Modal.confirm('您确定要删除吗？').then(async () => {
        let ids = [depID.value];
        await deleteDepartment(ids).then(res => {
            workflowaxios.defaults.headers.common = {
                'Flyflow-Tenant-Id': '1',
                'AuthUserId': userWorkFlowStore.user.loginId,
                "Authorization": userWorkFlowStore.user.tokenValue,
            }
            let flag = true;
            ids.forEach((id) => {
                workflowaxios.delete('/dept/delete', { data: { id: String(id) } }).then((res1) => {
                    if (res1.data.ok === false) {
                        Modal.alert('提交失败!');
                        flag = false;
                    }
                })
            });
            if (flag) {
                Modal.message({
                    message: '删除成功!',
                    status: 'success',
                });
            }
        });
        emit('query');
    });
}
// qcodeTree的值处理事件
const getQCodePermission = (checkedData: any) => {
    let qCodePermissions = checkedData.map((item: any) => {
        // 只记录带权限的叶子结点，其他叶子结点会利用filter过滤
        return item.nodeID;
    })
    createData.nodes = qCodePermissions.filter((item: any) => { return item !== null });
}


</script>

<style scoped></style>