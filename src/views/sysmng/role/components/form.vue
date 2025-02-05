<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="角色名" prop="roleName">
                <tiny-input v-model="createData.roleName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="角色类型" prop="roleType" :validate-icon="validateIcon">
                <tiny-select v-model="createData.roleType" :placeholder="'请选择角色类型'" filterable>
                    <tiny-option key="普通" label="普通" value="普通"></tiny-option>
                    <tiny-option key="管理" label="管理" value="管理"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="角色等级" prop="roleLevel">
                <tiny-select v-model="createData.roleLevel" :placeholder="'请选择角色等级'" filterable>
                    <tiny-option key="科室级" label="科室级" value="科室级"></tiny-option>
                    <tiny-option key="处室级" label="处室级" value="处室级"></tiny-option>
                    <tiny-option key="局级" label="局级" value="局级"></tiny-option>
                    <tiny-option key="平台级" label="平台级" value="平台级"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="备注" prop="remark">
                <tiny-input v-model="createData.remark"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="权限" prop="menuPermissions">
                <permissionTree :menuPermissions="createData.menuPermissions" @onChange="getMenuPermission"></permissionTree>
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
    Select as TinySelect,
    Option as TinyOption,
    Modal,
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import { useRoute } from 'vue-router';
import { iconWarning } from '@opentiny/vue-icon';
import { queryRoleDetail, postRole } from '@/api/fetchInterface';
import permissionTree from '@/components/permissionTree/index.vue';

const route = useRoute();
const props = defineProps({
    roleID: Number,
});
const { roleID } = toRefs(props);

const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive({
    roleID: null,
    roleType: '',
    roleName: '',
    roleLevel: '',
    remark: '',
    moduleName: '',
    menuPermissions: [],
})
const rules = ref({
    roleType: [{ required: true, message: '必填', trigger: 'change' }],
    roleName: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    roleLevel: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    remark: [{ required: false, message: '非必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});
const getMenuPermission = (checkedData:any)=>{
    let menuPermissions = checkedData.map((item:any)=>{
        // 只记录带权限的叶子结点，其他叶子结点会利用filter过滤
        if(item.permissionID !== null){
            return {menuID:item.menuID,permissionID:item.permissionID}
        }
        return null;
    })
    createData.menuPermissions = menuPermissions.filter((item:any)=>{return item !== null});
}

// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryRoleDetail({ id: roleID.value });
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
    if (roleID.value) {
        fetchData();
    }
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await postRole(createData);
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