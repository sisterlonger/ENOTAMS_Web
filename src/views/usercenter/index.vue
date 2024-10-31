<template>
    <Breadcrumb :items="['menu.usercenter']" />
    <div class="general-top">
        <headtop></headtop>
    </div>
</template>

<script lang="ts" setup>
import headtop from './components/head.vue';
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
</style>