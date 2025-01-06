<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="菜单名" prop="menuName">
                <tiny-input v-model="createData.menuName"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="菜单类型" prop="menuType" :validate-icon="validateIcon">
                <tiny-select v-model="createData.menuType" :placeholder="'请选择菜单类型'" filterable>
                    <tiny-option key="系统菜单" label="系统菜单" value="系统菜单"></tiny-option>
                    <tiny-option key="业务菜单" label="业务菜单" value="业务菜单"></tiny-option>
                    <tiny-option key="模块" label="模块" value="模块"></tiny-option>
                </tiny-select>
            </tiny-form-item>
            <tiny-form-item label="组件" prop="component">
                <tiny-input v-model="createData.component"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="图标" prop="icon">
                <tiny-input v-model="createData.icon"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="排序号" prop="order">
                <tiny-input v-model="createData.order"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="路径" prop="path">
                <tiny-input v-model="createData.path"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="国际化" prop="locale">
                <tiny-input v-model="createData.locale"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="权限配置" prop="checked">
                <tiny-checkbox-group v-model="checked" type="button" :options="options"
                    @change="valueChange"></tiny-checkbox-group>
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
    TinyCheckboxGroup, TinyModal,
    Select as TinySelect,
    Option as TinyOption,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { queryMenuDetail, postMenu, queryPermissionList } from '@/api/fetchInterface';
import components from '@/components';
import permission from '@/directive/permission';

const props = defineProps({
    menuID: Number,
    parentID: Number,
});
const { menuID, parentID } = toRefs(props);
const checkList = ref(['A'])
const options = ref([
])
const ruleFormRef = ref()
const validateIcon = ref(iconWarning());
const checked = ref([]);
const createData = reactive({
    menuID: null,
    parentID: null,
    menuType: '',
    component: '',
    icon: '',
    order: 0,
    path: '',
    menuName: '',
    locale: '',
    permissionIDs: [],
})
const rules = ref({
    menuName: [{ required: true, message: '必填', trigger: 'change' }],
    menuType: [{ required: true, message: '必填', trigger: 'change' }],
    component: [
        { required: false, message: '非必填', trigger: 'blur' },
    ],
    icon: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
    order: { type: 'number', min: 0, message: '排序号必须大于0', trigger: ['change', 'blur'] },
    path: [{ required: false, message: '非必填', trigger: 'change' }],
    locale: [{ required: false, message: '非必填', trigger: 'change' }],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});
const valueChange = async (value: any) => {
    console.log("value", value);
}
// 请求权限列表
const fetPermissions = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryPermissionList({ pageIndex: 1, pageSize: 10000 });
        data.forEach((item:any) => {
            options.value.push({ label: item.permissionID, text: item.permissionName });
        });
    }
    catch (err) {
        Modal.alert('获取数据错误');
        emit('close');
    }
    finally {
        state.loading.close();
    }
}
// 请求数据接口方法
const fetchData = async () => {
    state.loading = Loading.service({
        text: 'loading...',
        target: document.getElementById('container'),
        background: 'rgba(0, 0, 0, 0.7)',
    });
    try {
        const { data } = await queryMenuDetail({ id: menuID.value });
        Object.assign(createData, data);
        checked.value = data.permissionIDs.map((item) => (item.permissionID));
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
    if (menuID.value) {
        await fetchData();
    }
    else {
        createData.parentID = parentID.value;
    }
    await fetPermissions();
});


// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            createData.permissionIDs = checked.value.map((item) => { return { 'menuID': menuID.value, 'permissionID': item } });
            await postMenu(createData);
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