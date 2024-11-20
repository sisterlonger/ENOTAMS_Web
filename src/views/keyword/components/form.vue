<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="关键字" prop="keyWord" :validate-icon="validateIcon">
                <tiny-input v-model="createData.keyWord"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="输入类型" prop="inputType">
                <tiny-input v-model="createData.inputType"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="placeholder">
                <tiny-input v-model="createData.placeholder"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="字典" prop="dicType">
                <tiny-input v-model="createData.dicType"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="前缀" prop="prefix">
                <tiny-input v-model="createData.prefix"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="后缀" prop="prefix">
                <tiny-input v-model="createData.prefix"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="比例" prop="span">
                <tiny-input v-model="createData.span"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="状态" prop="state">
                <tiny-input v-model="createData.state"></tiny-input>
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
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryKeyWordDetail, postKeyWord } from '@/api/keyword';


const props = defineProps({
    keyWordID: Number,
});
const { keyWordID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    keyWordID: null,
    keyWord: '',
    inputType: '',
    placeholder: "",
    dicType: "",
    prefix: "",
    suffix: "",
    span: "",
    state: '生效',
})
const rules = ref({
    keyWord: [{ required: true, message: '请输入关键字', trigger: 'change' }],
    inputType: [
        { required: true, message: '请选择输入类型', trigger: 'blur' },
    ],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});


// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryKeyWordDetail({ id: keyWordID.value });
        createData.keyWordID = data.keyWordID;
        createData.keyWord = data.keyWord;
        createData.inputType = data.inputType;
        createData.state = data.state;
        createData.placeholder = data.placeholder;
        createData.dicType = data.dicType;
        createData.prefix = data.prefix;
        createData.suffix = data.suffix;
        createData.span = data.span;
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
    if (keyWordID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postKeyWord(createData);
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