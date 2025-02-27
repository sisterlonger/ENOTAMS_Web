<template>
    <div class="demo-form">
        <tiny-row style="margin-bottom:15px">
            <tiny-col :span="8">
                <tiny-select v-model="limit" value-field="fl" text-field="fl" render-type="grid" :grid-op="limitOption"
                    @change="onChange" placeholder="请输入下限"></tiny-select>
            </tiny-col>
            <tiny-col :span="4">
                <tiny-button type="primary" @click="handleSubmit()">
                    提交
                </tiny-button>
            </tiny-col></tiny-row>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, toRefs, defineEmits, watch } from 'vue'
import {
    Select as TinySelect,
    Button as TinyButton,
    Row as TinyRow,
    Col as TinyCol,
} from '@opentiny/vue'
import { limitOption } from '@/constants/limitOptions';


const props = defineProps({
    // 基准面类型
    baseType: String,
    // 判定f/g
    fgType: String,
});
const { baseType } = toRefs(props);
const { fgType } = toRefs(props);
const limit = ref('');

// 定义派发事件
const emit = defineEmits(['close', 'fgChange']);
/*
// 切换数据
watch(
    limit,
    (newValue, oldValue) => {
        // TODO 初始化的情况未考虑
        if (baseType != null && newValue !== "") {
            let result = '';
            if (baseType.value === "XXX M AMSL") {
                result = `${newValue} M AMSL`;

            }
            else if (baseType.value === "XXX M AGL") {
                result = `${newValue} M AGL`;

            }
            else if (baseType.value === "FL XXX") {
                result = `FL ${newValue}`;
            }
            //emit('close', result);
            emit('fgChange', fgType.value, result);
        }
    },
    { immediate: true, deep: true }
);*/
function handleSubmit() {
    console.log(baseType.value, limit);
    emit('close');
}
function onChange(data: any) {
    console.log(data);
    if (baseType != null && data.value !== "") {
        let result = '';
        if (baseType.value === "XXX M AMSL") {
            result = `${data.meter} M AMSL`;

        }
        else if (baseType.value === "XXX M AGL") {
            result = `${data.meter} M AGL`;

        }
        else if (baseType.value === "FL XXX") {
            result = `FL ${data.fl}`;
        }
        //emit('close', result);
        emit('fgChange', fgType.value, result, data.fl);
    }

}

// 初始化请求数据
onMounted(() => {
});
</script>

<style scoped></style>