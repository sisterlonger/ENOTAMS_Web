<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="关键字" prop="keyWord" :validate-icon="validateIcon">
                <tiny-input v-model="createData.keyWord"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="输入类型" prop="inputType">
                <tiny-select v-model="createData.inputType" searchable :options="inputTypeOption">
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="placeholder">
                <tiny-input v-model="createData.placeholder"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="字典" prop="dicType">
                <tiny-input v-model="createData.dicType"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="宽度" prop="width">
                <tiny-input v-model="createData.width"></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="false" label="关联关键字" prop="relationIDList">
                <tiny-select v-model="createData.relationIDList" multiple searchable :options="keyWordOption">
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="子关键字" prop="childrenIDList">
                <tiny-select v-model="createData.childrenIDList" multiple searchable :options="keyWordOption">
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="校验组" prop="validationIDList">
                <tiny-select v-model="createData.validationIDList" multiple searchable :options="validationOption">
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="文字配置" prop="template">
                <tiny-input v-model="createData.template"></tiny-input>
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
    Select as TinySelect,
    Button as TinyButton,
    Loading,
    Modal,
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryKeyWordDetail, postKeyWord, queryKeyWordList, queryValidationList } from '@/api/fetchInterface';


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
    width: "",
    relationIDList: [],
    childrenIDList: [],
    validationIDList: [],
    relationID: "",
    childrenID: "",
    validationID: "",
    template: "",
    state: '生效',
    createTime: null,
})
const keyWordOption = ref([]);
const validationOption = ref([]);
const inputTypeOption = ref([
    { key: "input", value: "input", label: "输入框" },
    { key: "select", value: "select", label: "选择框" },
    { key: "children", value: "children", label: "父组件" },
    { key: "selectChildren", value: "selectChildren", label: "选择型父组件" },
]);
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
// 获取关键字数据
async function getKeyWordOption() {
    let response = await queryKeyWordList({ pageIndex: 1, pageSize: 10000 });
    let result = [];
    response.data.forEach((keyword) => { result.push({ value: keyword.keyWordID, label: keyword.keyWord, key: keyword.keyWordID }) });
    return result;
}
// 获取校验组数据
async function getValidationOption() {
    let response = await queryValidationList({ pageIndex: 1, pageSize: 10000 });
    let result = [];
    response.data.forEach((validation) => { result.push({ value: validation.validationID, label: validation.validationName, key: validation.validationID }) });
    return result;
}

// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryKeyWordDetail({ id: keyWordID.value });
        Object.assign(createData, data);
        createData.relationIDList = data.relationID ? data.relationID.split(",").map(function (num: string) { return Number(num); }) : [];
        createData.childrenIDList = data.childrenID ? data.childrenID.split(",").map(function (num: string) { return Number(num); }) : [];
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
    if (keyWordID.value) {
        fetchData();
    }
    keyWordOption.value = await getKeyWordOption();
    validationOption.value = await getValidationOption();
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            createData.relationID = createData.relationIDList.join(",");
            createData.childrenID = createData.childrenIDList.join(",");
            createData.validationID = createData.validationIDList.join(",");
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
</style>