<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <!-- <tiny-form-item label="模块" prop="module">
                <tiny-input v-model="createData.module" disabled></tiny-input>
            </tiny-form-item> -->
            <tiny-form-item label="时间" prop="logDate" :validate-icon="validateIcon">
                <tiny-input v-model="createData.logDate" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="日志级别" prop="level" :validate-icon="validateIcon">
                <tiny-input v-model="createData.level" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="操作人" prop="logger">
                <tiny-input v-model="createData.logger" disabled></tiny-input>
            </tiny-form-item>
            <!-- <tiny-form-item label="对象" prop="object">
                <tiny-input v-model="createData.object" disabled></tiny-input>
            </tiny-form-item> -->
            <tiny-form-item label="日志内容" prop="message">
                <tiny-input v-model="createData.message" type="textarea" autosize disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="异常" prop="exception">
                <tiny-input v-model="createData.exception" type="textarea" autosize disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item>
                <tiny-button type="primary" @click="handleSubmit()">
                    关闭
                </tiny-button>
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
import { queryLogsDetail, postLogs } from '@/api/fetchInterface';


const props = defineProps({
    id: Number,
});
const { id } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    id: null,
    logDate: "",
    level: '',
    logger: '',
    message: '',
    exception: 0,
    object: '',
    module: '',
})
const rules = ref({
    level: [{ required: true, message: '必填', trigger: 'change' }],
    logger: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    message: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    object: [{ required: false, message: '非必填', trigger: 'change' }],
    module: [{ required: false, message: '非必填', trigger: 'change' }],
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
        const { data } = await queryLogsDetail({ id: id.value });
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
onMounted(async () => {
    console.log('id', id.value);
    if (id.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    emit('close');
}

</script>

<style scoped></style>