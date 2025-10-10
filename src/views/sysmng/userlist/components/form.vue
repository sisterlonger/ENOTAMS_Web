<template>
    <div class="demo-form">
        <tiny-form v-if="preCondition" ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="用户名" prop="userCode" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userCode" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item v-if="!createData.userID" label="密码" prop="userPwd" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userPwd" type="password" show-password clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="姓名" prop="userName" :validate-icon="validateIcon">
                <tiny-input v-model="createData.userName" clearable></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="角色" prop="role" :validate-icon="validateIcon">
                <tiny-select v-model="createData.role" clearable searchable>
                    <tiny-option v-for="item in roleList" :key="item.roleName" :label="item.roleName"
                        :value="item.roleName"></tiny-option>

                </tiny-select>
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
    Cascader as TinyCascader,
    Select as TinySelect,
    Option as TinyOption,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { useWorkFlowStore } from '@/store';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import { queryUserDetail, postUser, queryDepartmentTreeList, queryRoleList } from '@/api/fetchInterface';
import { Avatar } from '@opentiny/vue';

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
});
const roleList = reactive([])
const userWorkFlowStore = useWorkFlowStore();

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
    mobile: [{ required: true, validator: validateMobile, trigger: 'blur' },],
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
    await queryRoleList().then((res) => {
        Object.assign(roleList, res.data);
    });
    if (userID.value) {
        fetchData();
    }
    departmentOptions.value = await getNodeDataSync();
    preCondition.value = true;
    console.log(userWorkFlowStore.user.loginId);
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postUser(createData).then((res) => {
                workflowaxios.defaults.headers.common = {
                    'Flyflow-Tenant-Id': '1',
                    'AuthUserId': userWorkFlowStore.user.loginId,
                    "Authorization": userWorkFlowStore.user.tokenValue,
                }
                let userData = {
                    avatarUrl: "http://127.0.0.1:26859/file/show/2025-04-15/f400e509de9f42f9a3d6b23ab48887db.jpeg",
                    // todo 需要获取depid的list
                    deptIdList: [String(createData.depID)],
                    name: createData.userName,
                    phone: createData.mobile,
                    roleIds: ["ROOT"],
                    status: "1",
                    id: res.data,
                }
                // 修改
                if (userID.value) {
                    workflowaxios.put('/user/edit',
                        userData).then((res1: any) => {
                            if (res1.data.ok) {
                                emit('close');
                            }
                            else {
                                Modal.alert('提交失败!');
                            }
                        })
                }
                // 新增
                else {
                    workflowaxios.post('/user/create',
                        userData).then((res1: any) => {
                            if (res1.data.ok) {
                                emit('close');
                            }
                            else {
                                Modal.alert('提交失败!');
                            }
                        })
                }
            });
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