<template>
    <div class="demo-form">
        <!--chilren组件-->
        <div>
            <!--组件-->
            <!--选择子组件-->
            <tiny-select v-model="formData[item.prop]" v-if="item.type === 'selectChildren'"
                :placeholder="item.placeholder" :options="item.options" clearable
                @change="changeOption(formData[item.prop], item)">
            </tiny-select>
            <!--子组件内容-->
            <div v-for="(childrenItem, childrenIndex) in item.children" :key="`${item.prop}${childrenIndex}`"
                :style="item.type === 'children' ? childrenItem.hasOwnProperty('width') ? `width:${childrenItem.width};display:inline-block` : `width:${90 / item.children.length}%;display:inline-block` : 'margin-top:10px'">
                <tiny-form-item v-if="item.type === 'children' ? true : formData[item.prop] == childrenItem.label"
                    v-model="formData[item.prop]" :prop="item.prop">
                    <!--输入组件-->
                    <tiny-form-item v-if="childrenItem.type === 'input'" v-model="formData[childrenItem.prop]"
                        :prop="childrenItem.prop">
                        <tiny-row>
                            <tiny-col v-if="childrenItem.prefix"
                                :span="childrenItem.span && childrenItem.span[0]"><span>{{
                                    childrenItem.prefix
                                }}</span></tiny-col>
                            <tiny-col :span="childrenItem.span && childrenItem.span[1]" class="col-100">
                                <tiny-input v-model="formData[childrenItem.prop]"
                                    :placeholder="childrenItem.placeholder" clearable
                                    @change="changeOption(formData[childrenItem.prop], childrenItem)"></tiny-input></tiny-col>
                            <tiny-col v-if="childrenItem.suffix"
                                :span="childrenItem.span && childrenItem.span[2]"><span>{{
                                    childrenItem.suffix
                                }}</span></tiny-col>
                        </tiny-row>
                    </tiny-form-item>
                    <!--选择组件-->
                    <tiny-form-item v-if="childrenItem.type === 'select'" v-model="formData[childrenItem.prop]"
                        :prop="childrenItem.prop">
                        <tiny-row>
                            <tiny-col v-if="childrenItem.prefix"
                                :span="childrenItem.span && childrenItem.span[0]"><span>{{
                                    childrenItem.prefix
                                }}</span></tiny-col>
                            <tiny-col :span="childrenItem.span && childrenItem.span[1]" class="col-100">
                                <tiny-select v-model="formData[childrenItem.prop]"
                                    :placeholder="childrenItem.placeholder" :options="childrenItem.options" clearable
                                    @change="changeOption(formData[childrenItem.prop], childrenItem)"></tiny-select>
                            </tiny-col>
                            <tiny-col v-if="childrenItem.suffix"
                                :span="childrenItem.span && childrenItem.span[2]"><span>{{
                                    childrenItem.suffix
                                }}</span></tiny-col>
                        </tiny-row>
                    </tiny-form-item>
                    <!--递归子组件-->
                    <tiny-form-item v-if="childrenItem.type === 'children'" v-model="formData[childrenItem.prop]"
                        :prop="childrenItem.prop">
                        <tiny-row>
                            <tiny-col v-if="childrenItem.prefix"
                                :span="childrenItem.span && childrenItem.span[0]"><span>{{
                                    childrenItem.prefix
                                }}</span></tiny-col>
                            <!--TODO此处必须加height：32px，不然高度会变-->
                            <tiny-col :span="childrenItem.span && childrenItem.span[1]" class="col-100" :style="`height:32px`">
                                <children :item="childrenItem" :formData="formData" :formFields="formFields"
                                    @update:formData="val => parentFormData = val"
                                    @update:formFields="val => parentFormData = val"
                                    @getOption="getOption(formData[item.prop], item)"></children>
                            </tiny-col>
                            <tiny-col v-if="childrenItem.suffix"
                                :span="childrenItem.span && childrenItem.span[2]"><span>{{
                                    childrenItem.suffix
                                }}</span></tiny-col>
                        </tiny-row>
                    </tiny-form-item>
                </tiny-form-item>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, toRefs, watch } from 'vue';
import { queryDicType } from '@/api/dictionary';
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

const props = defineProps({
    item: {
        type: Object,
        default() {
            return {};
        },
    },
    formData: {
        type: Object,
        default() {
            return {};
        },
    },
    formFields: {
        type: Array,
        default() {
            return [];
        },
    },
});
const { formData } = toRefs(props);
const { formFields } = toRefs(props);
const emit = defineEmits(["update:formData", "update:formFields", "getOption"]);
// 子调用父
watch(
    formData,
    (newValue) => {
        emit('update:formData', newValue);
    },
    { immediate: true, deep: true },
    formFields,
    (newValue) => {

        emit('update:formFields', newValue);
    },
    { immediate: true, deep: true }
);
const changeOption = async (data, field) => {
    emit('getOption', data, field);
};
// 某选项变化时，触发naip或者上下游选择器获取option
const getOption = async (data, field) => {
    // 非初始化
    if (data) {
        // 是NAIP相关的,预留位置
        if (field.isNaip) {
            let response = await queryDicType({ dicType: field.dicType, naipValue: data });
            field.options = response.data;
        }
        // 与NAIP不相关，只是上游选择器的数据决定下游选择器数据的选项
        // 有下游的prop才可以触发
        if (field.nextProp) {
            let response = await queryDicType({ dicType: data });
            // 在第一层
            let nextField = formFields.find((item) => item.prop === field.nextProp);
            // 如果不是在第一层
            if (!nextField) {
                let childrenList = formFields.filter((item) => item.children);
                for (let i = 0; i < childrenList.length; i += 1) {
                    nextField = childrenList[i].children.filter((item) => item.prop === field.nextProp);
                    if (nextField.length > 0) {
                        break;
                    }
                }
                nextField[0].options = response.data;
            }
            else {
                nextField.options = response.data;
            }
        }
    }
};
onMounted(() => {
});
</script>

<style scoped>
.col-100 {
    padding-left: 0px;
    padding-right: 0px;
}
</style>