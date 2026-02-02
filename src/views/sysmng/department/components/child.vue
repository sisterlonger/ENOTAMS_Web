<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="全称" prop="fullName">
                <tiny-input v-model="fullName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门名" prop="depName">
                <tiny-input v-model="createData.depName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="专业" prop="field">
                <tiny-input v-model="createData.field"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="所属情报区" prop="airSpaceCodeId">
                <tiny-select v-model="createData.airSpaceCodeId" placeholder="请选择所属情报区" filterable>
                    <tiny-option v-for="item in airspaceOptions" :key="item.codeId" :label="item.codeId"
                        :value="item.codeId"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="所属机场" prop="airPortCodeId">
                <tiny-input v-model="createData.airPortCodeId"></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
                <tiny-button @click="resetForm"> 重置 </tiny-button>
            </tiny-form-item>
        </tiny-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, watch, defineEmits, computed } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric,
    Select as TinySelect, Option as TinyOption,
} from '@opentiny/vue'
import { postDepartment, queryAirSpaceList } from '@/api/fetchInterface';
import { useWorkFlowStore } from '@/store';


const props = defineProps({
    parentDep: Object,
});
const { parentDep } = toRefs(props);

const ruleFormRef = ref()
const userWorkFlowStore = useWorkFlowStore();
const airspaceOptions = ref([]);
const createData = reactive({
    depID: null,
    depName: '',
    field: '',
    parentDepID: parentDep.value.depID,
    depCode: "",
    parentDepCode: "",
    airSpaceCodeId: "",
    airPortCodeId: "",
    grade: parentDep.value.grade + 1,
    fullName: "",
    flyflowTenantId: "",
    authUserId: "",
    authorization: "",
})
const fullName = computed(() => {
    // 确保 createData.depName 存在
    const depName = createData.depName || '';
    
    // 如果父部门有全名
    if (parentDep.value?.fullName) {
        return `${parentDep.value.fullName}-${depName}`;
    }
    
    // 如果父部门只有部门名
    if (parentDep.value?.depName) {
        return `${parentDep.value.depName}-${depName}`;
    }
    
    // 如果都没有，只返回当前部门名
    return depName;
})
const rules = ref({
    dicType: [{ required: true, message: '必填', trigger: 'change' }],
    dicKey: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    dicValue: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    orderID: { type: 'number', min: 0, message: '排序号必须大于0', trigger: ['change', 'blur'] },
    dicDescription: [{ required: false, message: '非必填', trigger: 'change' }],
    moduleName: [{ required: false, message: '非必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});



// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            createData.fullName = fullName;
            createData.flyflowTenantId = '1';
            createData.authUserId = userWorkFlowStore.user.loginId;
            createData.authorization = userWorkFlowStore.user.tokenValue;
            await postDepartment(createData).then(res => {
                Modal.alert('提交成功!');
            });
            emit('close');
        } else {
            Modal.alert('提交失败!');
        }
    })
}

function resetForm() {
    ruleFormRef.value.resetFields()
}

const fetchConfig = async () => {
    let airspaceList = await queryAirSpaceList();
    airspaceOptions.value = airspaceList.data;
}
// 初始化请求数据
onMounted(async () => {
    fetchConfig();
});
</script>

<style scoped></style>