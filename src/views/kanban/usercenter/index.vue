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
import { ref, onMounted } from 'vue';
import formgenerator from '@/components/formgenerator/index.vue';
import headtop from './components/head.vue';

const formFields = ref([
]);
const preCondition = ref(false);
// 初始化请求数据
onMounted(async () => {
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