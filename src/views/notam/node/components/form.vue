<template>
    <div>
        <tiny-form v-if="preCondition" ref="ruleFormRef" :model="createData" :rules="rules" label-width="125px">
            <tiny-form-item label="模版" prop="template" :validate-icon="validateIcon">
                <tiny-input v-model="createData.template" type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="例子" prop="example" :validate-icon="validateIcon">
                <tiny-input v-model="createData.example" type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="remark" :validate-icon="validateIcon">
                <tiny-input v-model="createData.remark" type="textarea" autosize></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="航行通告代码" prop="qCode" :validate-icon="validateIcon">
                <tiny-input v-model="createData.qCode"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="飞行类型" prop="qFlightType" :validate-icon="validateIcon">
                <tiny-select v-model="createData.qFlightType" clearable searchable>
                    <tiny-option value="I">I</tiny-option>
                    <tiny-option value="IV">IV</tiny-option>
                    <tiny-option value="V">V</tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="签发目的" prop="qTarget" :validate-icon="validateIcon">
                <tiny-select v-model="createData.qTarget" clearable searchable>
                    <tiny-option value="B">B</tiny-option>
                    <tiny-option value="BO">BO</tiny-option>
                    <tiny-option value="NBO">NBO</tiny-option>
                    <tiny-option value="M">M</tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="影响范围" prop="qReach" :validate-icon="validateIcon">
                <tiny-select v-model="createData.qReach" clearable searchable>
                    <tiny-option value="A">A</tiny-option>
                    <tiny-option value="AE">AE</tiny-option>
                    <tiny-option value="E">E</tiny-option>
                    <tiny-option value="W">W</tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="下限" prop="qLowerLimit" :validate-icon="validateIcon">
                <tiny-select v-model="createData.qLowerLimit" clearable searchable>
                    <tiny-option value="000">000</tiny-option>
                    <tiny-option value="与F项一致">与F项一致</tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="上限" prop="qUpperLimit" :validate-icon="validateIcon">
                <tiny-select v-model="createData.qUpperLimit" clearable searchable>
                    <tiny-option value="999">999</tiny-option>
                    <tiny-option value="与G项一致">与G项一致</tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="半径" prop="qRadius" :validate-icon="validateIcon">
                <tiny-input v-model="createData.qRadius"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="佐证性材料要求" prop="materials" :validate-icon="validateIcon">
                <tiny-input v-model="createData.materials" placeholder="用、作分隔符" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="关联通告Q码" prop="relatedQCodes" :validate-icon="validateIcon">
                <tiny-input v-model="createData.relatedQCodes" placeholder="用、作分隔符" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="关联通告Q码" prop="field">
                <qcodeTree :qCodePermissions="createData.relateNodes" @onChange="getQCodePermission"></qcodeTree>
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
    Row as TinyRow,
    Col as TinyCol,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import qcodeTree from '@/components/qcodeTree/index.vue';
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
    qCode: '',
    qFlightType: '',
    qTarget: '',
    qReach: '',
    qLowerLimit: '',
    qUpperLimit: '',
    qRadius: '',
    materials: "",
    relatedQCodes: "",
    // get
    relateNodes: [],
    // set
    relateNodeIds: [],
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
const preCondition = ref(false)
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
        createData.relateNodes = [];
        createData.relateNodes = data.relateNodes.map((item: any) => { return item.nodeID });
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
        preCondition.value = true;
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            createData.relateNodeIds = createData.nodes;
            await postTemplate(createData);
            emit('close');
        } else {
            Modal.alert('提交失败!');
        }
    })
}
// qcodeTree的值处理事件
const getQCodePermission = (checkedData: any) => {
    let qCodePermissions = checkedData.map((item: any) => {
        // 只记录带权限的叶子结点，其他叶子结点会利用filter过滤
        return item.nodeID;
    })
    createData.nodes = qCodePermissions.filter((item: any) => { return item !== null });
}


function resetForm() {
    ruleFormRef.value.resetFields()
}
</script>

<style scoped></style>