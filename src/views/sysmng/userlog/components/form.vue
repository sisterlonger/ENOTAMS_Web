<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" label-width="150px">
            <tiny-form-item label="时间" prop="ts">
                <tiny-input v-model="createData.ts" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="请求方式" prop="method">
                <tiny-input v-model="createData.method" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="接口地址" prop="url">
                <tiny-input v-model="createData.url" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="请求参数" prop="body">
                <tiny-input v-model="createData.body" disabled type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="响应结果" prop="result">
                <tiny-input v-model="createData.result" disabled type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="报错日志" prop="error">
                <tiny-input v-model="createData.error" disabled type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门" prop="depName">
                <tiny-input v-model="createData.depName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="用户名" prop="userName">
                <tiny-input v-model="createData.userName" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="请求ip" prop="ip">
                <tiny-input v-model="createData.ip" disabled></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="响应时长(ms)" prop="duration">
                <tiny-input v-model="createData.duration" disabled></tiny-input>
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
import { ref, reactive, onMounted, toRefs, defineEmits } from 'vue'
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
import { queryUserLogsDetail } from '@/api/fetchInterface';
import user from '@/mock/user';


const props = defineProps({
    ts: Date,
});
const { ts } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    ts: '',
    method: '',
    url: '',
    body: '',
    result: '',
    error: '',
    depName: '',
    userName: '',
    ip: '',
    duration: '',
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
        const { data } = await queryUserLogsDetail({ ts: ts.value });
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
    if (ts.value) {
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