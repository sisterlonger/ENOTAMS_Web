<template>
    <div>
        <tiny-row v-if="preCondition">
            <tiny-form ref="ruleFormRef" :model="formData" :rules="formRules" :label-width="formStyle.width || '100px'">
                <div v-for="(item, index) in formFields" :key="'field' + index">
                    <tiny-form-item v-if="!item.hidden" :label="keyWordLabel[index]" :prop="item.prop">
                        <!--输入组件-->
                        <tiny-input v-model="formData[item.prop]" v-if="item.type.includes('input')"
                            :placeholder="item.placeholder" clearable
                            :style="`width:${item.width !== null ? item.width : '200px'}`"
                            :type="item.type === 'inputtextarea' ? 'textarea' : 'text'" autosize
                            :maxlength="item.maxLength" @change="getOption(formData[item.prop], item)"></tiny-input>
                        <!--选择组件-->
                        <tiny-select v-model="formData[item.prop]" v-if="item.type === 'select'"
                            :placeholder="item.placeholder" :options="item.options" clearable
                            :style="`width:${item.width !== null ? item.width : '200px'}`"
                            @change="getOption(formData[item.prop], item)"></tiny-select>
                        <!--chilren组件-->
                        <div v-if="item.type === 'children'">
                            <children :item="item" :formData="formData" :formFields="formFields"
                                @update:formData="val => parentFormData = val"
                                @update:formFields="val => parentFormData = val" @getOption="getOption"></children>
                        </div>
                        <div v-if="item.type === 'selectChildren'">
                            <children :item="item" :formData="formData" :formFields="formFields"
                                @update:formData="val => parentFormData = val"
                                @update:formFields="val => parentFormData = val" @getOption="getOption"></children>
                        </div>
                    </tiny-form-item>
                </div>
            </tiny-form>
        </tiny-row>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, watch, toRaw, defineExpose } from 'vue';
import { queryDicType,getKeyWordJSON } from '@/api/fetchInterface';
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

/*
defineProps({
  formFields: {
    type: Array,
    default() {
      return [];
    },
  },
});*/

import children from './components/children.vue';

const props = defineProps({
    keyWord: String,
    keyWordLabel: Object,
});
const { keyWord } = toRefs(props);
const { keyWordLabel } = toRefs(props);
const formFields = ref();
const formRules = reactive({});
const formData = reactive({});
const submitFormData = reactive({});
const keyList = reactive({});
const formStyle = reactive({ width: '100px', span: 6 });
const preCondition = ref(false);

// 通用的校验函数
const validate = (rule, value, callback, data, options) => {
    //console.log(rule);
    // 报错原因，未能获取到rule（因为子没有暴露出来）
    const regex = new RegExp(rule.validators);
    //console.log(regex);
    if (!regex.test(value)) {
        callback(new Error(rule.validatortext));
    } else {
        callback();
    }
};
// 某选项变化时，触发naip或者上下游选择器获取option
const getOption = async (data, field) => {
    //console.log(data, field);
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
            let nextField = formFields.value.find((item) => item.prop === field.nextProp);
            // 如果不是在第一层
            if (!nextField) {
                let childrenList = formFields.value.filter((item) => item.children);
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
function replaceDollarSequentially(str, replacements) {
    //console.log("str, replacements", str, replacements);
    let regex = /\$/g; // 匹配所有的$
    let matchCount = 0; // 记录已经替换的$的数量
    return str.replace(regex, () => {
        if (matchCount < replacements.length) {
            matchCount += 1;
            return replacements[matchCount - 1]; // 返回对应的替换字符，并递增
        }
        return '$'; // 如果替换数组耗尽，保留原始$
    });
}
// 按formFields中，children组件的所有变量顺序组装合成变成children组件变量值
const handleFormData = (formFieldList) => {
    let result = [];
    //console.log(formFieldList);
    // 如果是children就不行,得根据template
    formFieldList.forEach((field) => {
        // 如果是子组件则递归，递归返回多个
        if (field.type === "children") {
            //console.log("field.template", field.template);
            // template算法
            let template = "";
            if (field.template) {
                template = replaceDollarSequentially(field.template, handleFormData(field.children));
            }
            else {
                template = handleFormData(field.children).join("");
            }
            result.push(`${template}`);
            // 必须是一级变量才可以加入到提交数据中
            if (field.prop.split("-").length === 2) {
                submitFormData[field.prop] = template;
            }
            //console.log("children", result, field.prop);
        }
        // 单个
        else if (field.type === "selectChildren") {
            let childrenIndex = 0;
            field.children.forEach((child, index) => {
                if (child.prop.includes(formData[field.prop])) {
                    childrenIndex = index;
                }
            })
            // 必须是一级变量才可以加入到提交数据中
            if (field.prop.split("-").length === 2) {
                submitFormData[field.prop] = `${field.prefix || ''}${handleFormData([field.children[childrenIndex]], field.prop)}${field.suffix || ''}`;
            }
        }
        // 返回多个
        else {
            result.push(`${formData[field.prop]}`);
            // 必须是一级变量才可以加入到提交数据中
            if (field.prop.split("-").length === 2) {
                submitFormData[field.prop] = formData[field.prop];
            }
        }
    })
    //console.log(result);
    return result;
}
const assembleStr = () => {
    // 组装函数
    ///console.log(formFields.value);
    handleFormData(formFields.value);
    //console.log(submitFormData);
    return toRaw(submitFormData);
}
defineExpose({ assembleStr });
// 递归式初始化rules和模版文字
const initOption = (fieldList) => {
    fieldList.forEach((field) => {
        if (field.rules && field.rules.length > 0) {
            field.rules.forEach((rule) => {
                // 空的话就创建数组
                if (!formRules[field.prop]) {
                    formRules[field.prop] = [];
                }
                formRules[field.prop].push({ validator: validate, trigger: rule.trigger, required: rule.required, validatortext: rule.validatortext, validators: rule.validators });
                //console.log(rule);
                //console.log(rule.maxLength);
                field.maxLength = rule.maxLength;
            });

        }
        // 模板拼接字符
        if (field.template) {
            let templateList = field.template.split("$");
            if (templateList.length < 3) {
                field.prefix += templateList[0];
                field.suffix = templateList[1] + (field.suffix || "");
            }
            else {
                field.children.forEach((child, index) => { child.prefix = templateList[index] + (child.prefix || "") });
                field.suffix = templateList[templateList.length - 1];
            }
        }
        // selectChildren 和 children
        if (field.type.includes("hildren") && field.children) {
            initOption(field.children);
        }
    })

}
onMounted(async () => {
    let result = await getKeyWordJSON({ model: keyWord.value });
    formFields.value = result.data;
    await initOption(formFields.value);
    preCondition.value = true;
    //console.log(formRules);
});
</script>

<style scoped></style>