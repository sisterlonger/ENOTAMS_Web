<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="Q码" prop="qCode">
                <tiny-input v-model="createData.qCode" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="情报区" prop="airSpaceCodeId">
                <tiny-input v-model="createData.airSpaceCodeId" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="报文类型" prop="type">
                <tiny-input v-model="createData.type" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="生效类型" prop="validType" :validate-icon="validateIcon">
                <tiny-input v-model="createData.validType" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="纬度" prop="lat" :validate-icon="validateIcon">
                <tiny-input v-model="createData.lat" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="经度" prop="long">
                <tiny-input v-model="createData.long" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="半径" prop="radius">
                <tiny-input v-model="createData.radius" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="电报正文" prop="telegramText">
                <tiny-input v-model="createData.telegramText" type="textarea" autosize disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="创建时间" prop="createTime">
                <tiny-input v-model="createData.createTime" type="textarea" autosize disabled></tiny-input>
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
import { queryMessageDetail } from '@/api/fetchInterface';

const props = defineProps({
    id: Number,
});
const { id } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    id: null,
    qCode: "",
    airSpaceCodeId: "",
    validType: "",
    type: '',
    lat: '',
    long: '',
    telegramText: '',
    createTime: "",
    radius: '',
})
const rules = ref({
    qCode: [{ required: true, message: '必填', trigger: 'change' }],
    airSpaceCodeId: [{ required: true, message: '必填', trigger: 'change' }],
    type: [{ required: true, message: '必填', trigger: 'change' }],
    validType: [{ required: true, message: '必填', trigger: 'change' }],
    lat: [{ required: true, message: '必填', trigger: 'change' }],
    long: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    telegramText: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    radius: [{ required: true, message: '非必填', trigger: 'change' }],
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
        const { data } = await queryMessageDetail({ id: id.value });
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