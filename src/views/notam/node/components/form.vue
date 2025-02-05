<template>
    <div>
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="模版" prop="template" :validate-icon="validateIcon">
                <tiny-input v-model="createData.template"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="例子" prop="example" :validate-icon="validateIcon">
                <tiny-input v-model="createData.example"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="remark" :validate-icon="validateIcon">
                <tiny-input v-model="createData.remark"></tiny-input>
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
    Row as TinyRow,
    Col as TinyCol,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryTemplateDetail, postTemplate } from '@/api/fetchInterface';


const props = defineProps({
    templateID: Number,
});
const { templateID } = toRefs(props);


const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    templateID: null,
    template: '',
    remark: '',
    example: '',
})
const rules = ref({
    template: [{ required: true, message: '必填', trigger: 'change' }],
    example: [
        { required: false, message: '请输入例子', trigger: 'blur' },
    ],
    remark: [
        { required: false, message: '必填', trigger: 'blur' },
    ],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});

let dicType = ref([]);
// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryTemplateDetail({ id: templateID.value });
        Object.assign(createData, data);
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
    console.log(templateID.value);
    if (templateID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postTemplate(createData);
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

<style scoped></style>