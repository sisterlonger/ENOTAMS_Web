<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="字典组" prop="dicType" :validate-icon="validateIcon">
                <tiny-input v-model="createData.dicType"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="键" prop="dicKey">
                <tiny-input v-model="createData.dicKey"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="值" prop="dicValue">
                <tiny-input v-model="createData.dicValue"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="排序号" prop="orderID">
                <tiny-input v-model="createData.orderID"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="描述" prop="dicDescription">
                <tiny-input v-model="createData.dicDescription"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="模块" prop="moduleName">
                <tiny-input v-model="createData.moduleName"></tiny-input>
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
import { queryDictionaryDetail, postDictionary } from '@/api/fetchInterface';


const props = defineProps({
    dicID: Number,
});
const { dicID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    dicID: null,
    dicType: '',
    dicKey: '',
    dicValue: '',
    orderID: 0,
    dicDescription: '',
    moduleName: '',
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


// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryDictionaryDetail({ id: dicID.value });
        createData.dicID = data.dicID;
        createData.dicType = data.dicType;
        createData.dicKey = data.dicKey;
        createData.dicValue = data.dicValue;
        createData.orderID = data.orderID;
        createData.dicDescription = data.dicDescription;
        createData.moduleName = data.moduleName;
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
onMounted(async () => {
    if (dicID.value) {
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