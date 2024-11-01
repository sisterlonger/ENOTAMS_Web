<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="关键字" prop="keyword" :validate-icon="validateIcon">
                <tiny-input v-model="createData.keyword"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="输入类型" prop="inputType">
                <tiny-input v-model="createData.inputType"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="状态" prop="state">
                <tiny-input v-model="createData.state"></tiny-input>
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
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryDictionaryDetail, postDictionary } from '@/api/dictionary';


const props = defineProps({
    keywordID: Number,
});
const { keywordID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    keywordID: null,
    keyword: '',
    inputType: '',
    state: '生效',
})
const rules = ref({
    keyword: [{ required: true, message: '请输入关键字', trigger: 'change' }],
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
        const { data } = await queryDictionaryDetail({ id: keywordID.value });
        createData.keywordID = data.keywordID;
        createData.keywordID = data.keywordID;
        createData.keyword = data.keyword;
        createData.inputType = data.inputType;
        createData.state = data.state;
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
    if (keywordID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postDictionary(createData);
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