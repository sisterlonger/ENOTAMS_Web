<template>
    <div class="demo-form">
        <tiny-form ref="ruleFormRef" :model="createData" :rules="rules" label-width="100px">
            <tiny-form-item label="版本号" prop="title" :validate-icon="validateIcon">
                <tiny-input v-model="createData.title" placeholder="请输入版本号"></tiny-input>
            </tiny-form-item>
            <tiny-form-item label="更新内容" prop="content">
                <tiny-input v-model="createData.content" placeholder="请输入更新内容" type="textarea"></tiny-input>
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
import { ref, reactive, defineEmits } from 'vue'
import {
    Form as TinyForm,
    FormItem as TinyFormItem,
    Input as TinyInput,
    Button as TinyButton,
    Modal,
    Numeric as TinyNumeric,
} from '@opentiny/vue'
import { iconWarning } from '@opentiny/vue-icon';
import { pushVersion } from '@/api/fetchInterface';



const ruleFormRef = ref()
const validateIcon = ref(iconWarning())
const createData = reactive<any>({
    versionID: null,
    title: '',
    content: '',
})
const rules = ref({
    title: [{ required: true, message: '必填', trigger: 'change' }],
    content: [
        { required: true, message: '必填', trigger: 'blur' },
    ],
})

// 加载效果
const state = reactive<{
    loading: any,
}>({
    loading: null,
});



// 定义派发事件
const emit = defineEmits(['close']);

function handleSubmit() {
    ruleFormRef.value.validate(async (valid: any) => {
        if (valid) {
            await pushVersion(createData);
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

<style scoped></style>