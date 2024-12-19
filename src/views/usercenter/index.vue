<template>
    <div>
        <Breadcrumb :items="['menu.usercenter']" />
        <div class="general-top">
            <headtop></headtop>
        </div>

        <div>
            <formgenerator v-if="preCondition" :formFields="formFields" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getKeyWordJSON } from '@/api/fetchInterface';
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
    let result = await getKeyWordJSON({ model: "距离,位置,范围,高度,时间,颜色,波道,频率,进近灯光类型,进近类型,频次或强度" });
    //let result = await getKeyWordJSON({ model: "重量,道面类型,角度范围,PCN值,四字代码,三字代码" });
    formFields.value = result.data;
    preCondition.value = true;
}
const formData = ref({});
const formFields = ref([
]);
const preCondition = ref(false);
const handleSubmit = () => {
    console.log("xx");
}
// 初始化请求数据
onMounted(async () => {
    //await getKeyWord();
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
    margin: 0px
}
</style>