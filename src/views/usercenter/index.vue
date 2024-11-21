<template>
    <Breadcrumb :items="['menu.usercenter']" />
    <div class="general-top">
        <headtop></headtop>
    </div>
    <tiny-form ref="ruleFormRef" :model="formData" :label-width="'0px'">
        <div :style="`display: flex;align-items: center;`"><span>tesdasdasdsadas</span><tiny-form-item v-if="true" v-model="preCondition"
                :prop="preCondition"><tiny-input
                    v-model="preCondition"></tiny-input></tiny-form-item><span>5555555555555555555</span>
        </div>
    </tiny-form>

    <div>
        <formgenerator v-if="preCondition" :formFields="formFields" />
    </div>
</template>

<script lang="ts" setup>
import { getKeyWordJSON } from '@/api/keyword';
import { ref, reactive, onMounted } from 'vue';
import {
    TinyForm,
    TinyFormItem,
    TinyInput,
    TinyDatePicker,
    TinyButton,
    TinyRow,
    TinyCol,
    Select as TinySelect,
} from '@opentiny/vue';
import formgenerator from '@/components/formgenerator/index.vue';
import headtop from './components/head.vue';

const getKeyWord = async () => {
    let test = await getKeyWordJSON({ model: "位置" });
    formFields.value = test.data;
    console.log(1, formFields);
    preCondition.value = true;

}
const formData = ref({});
const formFields = ref([]);
const preCondition = ref(false);

// 初始化请求数据
onMounted(async () => {
    await getKeyWord();
});

</script>
<style scoped lang="less">
.general-top {
    display: flex;
    justify-content: space-around;
    margin: 10px -10px;
    background-image: url('@/assets/images/step-head.png');
    background-size: cover;
}

@media (max-width: @screen-xs) {
    .general-top {
        height: 250px !important;
    }
}
.tiny-form-item {
    margin:0px
}
</style>