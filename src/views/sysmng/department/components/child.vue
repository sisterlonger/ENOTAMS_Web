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
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
                <tiny-button  @click="resetForm"> 重置 </tiny-button>
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
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import {  postDepartment } from '@/api/fetchInterface';


const props = defineProps({
    parentDep: Object,
});
const { parentDep } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    depID: null,
    depName: '',
    field: '',
    parentDepID: parentDep.value.depID,
    depCode: "",
    parentDepCode: "",
    grade: parentDep.value.grade + 1,
    fullName: "",
})
const fullName = computed(() => {
    return `${parentDep.value.fullName}-${createData.depName}`
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
            await postDepartment(createData);
            emit('close');
        } else {
            Modal.alert('提交失败!');
        }
    })
}

function resetForm() {
    ruleFormRef.value.resetFields()
}
</script>

<style scoped>
</style>