<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="校验名" prop="validationName" :validate-icon="validateIcon">
                <tiny-input v-model="createData.validationName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="remark">
                <tiny-input v-model="createData.remark"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="表达式" prop="editMask">
                <tiny-input v-model="createData.editMask"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="字典组" prop="dicType">
                <tiny-select v-model="createData.dicType" placeholder="请选择字典组" filterable>
                    <tiny-option v-for="item in dicType" :key="item" :label="item" :value="item"></tiny-option>
                </tiny-select>
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
import { ref, reactive, onMounted, toRefs, watch, defineEmits } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric, Select as TinySelect,
    Option as TinyOption,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryValidationDetail, postValidation } from '@/api/validation';
import { queryDicType } from '@/api/dictionary';


const props = defineProps({
    validationID: Number,
});
const { validationID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    validationID: null,
    validationName: '',
    remark: '',
    editMask: '',
    dicType: "",
    required: null,
})
const rules = ref({
    validationName: [{ required: true, message: '必填', trigger: 'change' }],
    remark: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    editMask: [
        { required: false, message: '请输入表达式', trigger: 'blur' },
    ],
    dicType: { required: false, message: '请输入字典组', trigger: ['change', 'blur'] },
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});

let dicType = ref([]);
const fetchDicType = async () => {
    const { data } = await queryDicType();
    dicType.value = data;
}
// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryValidationDetail({ id: validationID.value });
        createData.validationID = data.validationID;
        createData.validationName = data.validationName;
        createData.remark = data.remark;
        createData.editMask = data.editMask;
        createData.dicType = data.dicType;
        createData.required = data.required;
    }
    catch (err) {
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
};

// 初始化请求数据
onMounted(() => {
    fetchDicType();
    if (validationID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postValidation(createData);
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
.demo-form {
    width: 450px;
}
</style>