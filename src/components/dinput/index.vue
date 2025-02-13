<template>
    <div>
        <div class="demo-date-picker-wrap">
            <tiny-select v-model="value" placeholder="请选择周期" :options="options" clearable filterable
                @change="changeOption(value)"></tiny-select>
            <tiny-date-picker v-model="value"></tiny-date-picker>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { TinyDatePicker ,Select as TinySelect,} from '@opentiny/vue'

const value = ref('')
const options = ref([{ label: '每天', value: '每天' }, { label: '每周', value: '每周' }, { label: '每月', value: '每月' }, { label: '自定义', value: '自定义' }, { label: '文本输入', value: '文本输入' }])
function changeOption() {
    console.log(value);
}
</script>

<style>
.title {
    font-size: 20px;
    font-weight: bold;
    margin: 15px 0px
}
</style>