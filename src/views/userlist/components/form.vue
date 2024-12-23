<template>
    <div class="demo-form">
        <tiny-form v-if="preCondition" ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="用户名" prop="userCode" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userCode" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="!createData.userID" label="密码" prop="userPwd" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userPwd"  type="password" show-password clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="姓名" prop="userName" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userName" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="角色" prop="role" :validate-icon="validateIcon">
                <tiny-input v-model="createData.role" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="部门" prop="depID" :validate-icon="validateIcon">
                <tiny-cascader v-model="createData.depID" :options="departmentOptions" style="width:100%"
                    :props="{ emitPath: false, value: 'depID', label: 'depName', expandTrigger: 'hover' }" autosize
                    filterable clearable>
                </tiny-cascader>
            </tiny-form-item>
            <tiny-form-item label="手机号" prop="mobile" :validate-icon="validateIcon">
                <tiny-input v-model="createData.mobile" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="邮箱" prop="email" :validate-icon="validateIcon">
                <tiny-input v-model="createData.email" clearable></tiny-input>
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
    Cascader as TinyCascader,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryUserDetail, postUser,queryDepartmentTreeList } from '@/api/fetchInterface';

const props = defineProps({
    userID: Number,
});
const { userID } = toRefs(props);

const departmentOptions = ref([
])

const preCondition = ref(false)

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    userID: null,
    userCode: '',
    userName: '',
    userPwd: "",
    companySMSCode: "",
    role: '',
    depID: '',
    mobile: "",
    email: '',
})

const validateMobile = (
    rule: any,
    value: string,
    callback: (arg?: Error) => void
) => {
    if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号"));
    } else {
        callback();
    }
};

const rules = ref({
    userCode: [{ required: true, message: '必填', trigger: 'change' }],
    userName: [{ required: true, message: '必填', trigger: 'change' }],
    role: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    depID: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    mobile: [{ validator: validateMobile, trigger: 'blur' },],
    email: [{ type: 'email' }],
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
        const { data } = await queryUserDetail({ id: userID.value });
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

const getNodeDataSync = async () => {
    const { data } = await queryDepartmentTreeList();
    return data.children;
}
// 初始化请求数据
onMounted(async () => {
    if (userID.value) {
        fetchData();
    }
    departmentOptions.value = await getNodeDataSync();
    preCondition.value = true;
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postUser(createData);
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