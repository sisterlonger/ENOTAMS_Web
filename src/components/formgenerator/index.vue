<template>
    <div>
        <tiny-row>
        <tiny-form ref="ruleFormRef" :model="formData" :rules="formRules" :label-width="formStyle.width || '100px'">
            <div v-for="(item, index) in formFields" :key="'field' + index">
                <tiny-col :span="item.span || formStyle.span || 12">
                    <tiny-form-item v-if="!item.hidden" :label="item.label" :prop="item.prop">
                        <!--输入组件-->
                        <tiny-input v-model="formData[item.prop]" v-if="item.type === 'input'"
                            :placeholder="item.placeholder" clearable
                            @change="getOption(formData[item.prop], item)"></tiny-input>
                        <!--选择组件-->
                        <tiny-select v-model="formData[item.prop]" v-if="item.type === 'select'"
                            :placeholder="item.placeholder" :options="item.options" clearable
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
                </tiny-col>
            </div>
        </tiny-form>
        </tiny-row>
        <tiny-row>
            <tiny-button type="primary" @click="handleSubmit()">
                提交
            </tiny-button>
        </tiny-row>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { queryDicType } from '@/api/dictionary';
import { queryValidationDetail } from '@/api/validation';
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

const formData = reactive({ username: 'test' });
const submitFormData = reactive({});
const formStyle = reactive({ width: '100px', span: 4 });

// 通用的校验函数
const validate = (rule, value, callback, data, options) => {
    console.log(rule);
    // 报错原因，未能获取到rule（因为子没有暴露出来）
    let filed = formRules[rule.field];
    const regex = new RegExp(filed.validators);
    if (!regex.test(value)) {
        callback(new Error(filed.validatortext));
    } else {
        callback();
    }
};
// 某选项变化时，触发naip或者上下游选择器获取option
const getOption = async (data, field) => {
    console.log(data, field);
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

// 按formFields中，children组件的所有变量顺序组装合成变成children组件变量值
const handleFormData = (formFields) => {
    let result = "";
    formFields.forEach((field) => {
        // 如果是子组件则递归
        if (field.type.includes("hildren")) {
            submitFormData[field.prop] = `${field.prefix || ''}${handleFormData(field.children, field.prop)}${field.suffix || ''}`;
        }
        else {
            result = `${result}${field.prefix || ''}${formData[field.prop]}${field.suffix || ''}`;
        }
    })
    console.log(result);
    return result;
}
const handleSubmit = () => {
    console.log(formData, formFields);
    submitFormData.value = {};
    handleFormData(formFields);
    console.log(formData);
    console.log("submitFormData", submitFormData);
}
/*
const formRules = reactive({});
const formFields = reactive([]);*/

// 递归式初始化options
const initOption = async (formFields) => {
    /*
    let test = await queryValidationDetail({id:34});
    console.log(test);
    console.log(test.data.editMask);
    formRules.value = JSON.parse(test.data.editMask);
    formFields.value = JSON.parse(test.data.remark);
    console.log(formData,formFields);*/
    await formFields.forEach(async (field) => {
        if (field.type === "select" && field.dicType) {
            let response = await queryDicType({ dicType: field.dicType });
            field.options = response.data;
        }
        // selectChildren 和 children
        if (field.type.includes("hildren") && field.children) {
            field.children = await initOption(field.children);
        }
    })
    return formFields;
}

const formRules = reactive(
    {
        username: {
            validator: validate, trigger: 'blur', validators: '^[0-9]$',
            validatortext: "请输入正确的汉字",
        },
        email: {
            validator: validate, trigger: 'blur', validators: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$',
            validatortext: "请输入有效的电子邮件",
        },
        hight: { validator: validate, required: true, trigger: 'change' },
        flghthight: { required: true, trigger: 'change' },
        east: {
            validator: validate, trigger: 'blur', validators: '^[0-9]$',
            validatortext: "请输入正确的汉字",
        },
        south: {
            validator: validate, trigger: 'blur', validators: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$',
            validatortext: "请输入有效的电子邮件",
        },
        area: { required: true, trigger: 'change' },
    })
const formFields = reactive([
    {
        prop: 'username',
        label: '用户名',
        type: 'input',
        placeholder: '请输入用户名',
    },
    {
        prop: 'email',
        label: '电子邮件',
        type: 'input',
        placeholder: '请输入电子邮件',
    },
    // 上下游选择器
    {
        prop: 'hight',
        label: '高度',
        type: 'select',
        placeholder: '请选择高度',
        dicType: "高度",
        nextProp: "flghthight",
        options: [
        ],
    },
    {
        prop: 'flghthight',
        label: '飞行高度层',
        type: 'select',
        placeholder: '请选择飞行高度层',
        options: [
        ],
    },
    // 前后缀
    {
        prop: 'location',
        label: '位置',
        type: 'children',
        span: 12,
        children: [
            {
                prop: 'east',
                label: '东',
                type: 'input',
                prefix: "RWY",
                suffix: "-",
                placeholder: '请输入用户名',
                span: [1, 8, 1],
            },
            {
                prop: 'south',
                label: '年龄',
                type: 'select',
                prefix: "RWY",
                placeholder: '请输入年龄',
                options: [
                    {
                        value: '0',
                        label: 'offline',
                    },
                    {
                        value: '1',
                        label: 'online',
                    },
                ],
                span: [1, 8, 0],
            }
        ]
    },
    // 变化的子组件
    {
        prop: 'area',
        label: '范围',
        type: 'selectChildren',
        placeholder: '请输入范围',
        span: 12,
        options: [
            {
                value: '地理坐标系',
                label: '地理坐标系',
            },
            {
                value: '极坐标',
                label: '极坐标',
            },
            {
                value: '跑道坐标系',
                label: '跑道坐标系',
            },
            {
                value: '自由文本',
                label: '自由文本',
            },
        ],
        children: [
            {
                prop: '地理坐标系',
                label: '地理坐标系',
                type: 'children',
                placeholder: '请输入经纬度',
                children: [
                    {
                        prop: 'latitude',
                        label: '纬度',
                        type: 'input',
                        span: [0, 10, 0],
                        placeholder: '请输入纬度',
                    },
                    {
                        prop: 'longitude',
                        label: '经度',
                        type: 'input',
                        span: [0, 10, 0],
                        placeholder: '请输入经度',
                    },
                ]
            },
            {
                prop: '极坐标',
                label: '极坐标',
                type: 'children',
                placeholder: '请输入极坐标',
                children: [
                    {
                        prop: 'center',
                        label: '极坐标中心',
                        type: 'input',
                        prefix: "以",
                        suffix: "为中心，",
                        placeholder: '请输入极坐标中心',
                        span: [2, 6, 4],
                    },
                    {
                        prop: '磁/真',
                        label: '磁/真',
                        type: 'select',
                        prefix: "",
                        suffix: "方位",
                        placeholder: '请选择磁/真',
                        dicType: "磁?真",
                        span: [0, 9, 3],
                    },
                    {
                        prop: '角度',
                        label: '角度',
                        type: 'input',
                        prefix: "",
                        suffix: "°,",
                        placeholder: '请输入角度',
                        span: [0, 10, 2],
                        width: "150px"
                    },
                    {
                        prop: '距离组件',
                        label: '距离组件',
                        type: 'children',
                        prefix: "距离",
                        placeholder: '请输入距离组件',
                        width: "600px",
                        span: [1, 11, 0],
                        children: [
                            {
                                prop: '距离',
                                label: '距离',
                                type: 'input',
                                placeholder: '请输入距离',
                            },
                            {
                                prop: '距离单位',
                                label: '距离单位',
                                type: 'select',
                                placeholder: '请选择距离单位',
                                dicType: "长度",
                            }
                        ],
                    },
                ]
            },
            {
                prop: 'runway',
                label: '跑道坐标系',
                type: 'children',
                placeholder: '请输入跑道坐标系',
                children: [
                    {
                        prop: 'runway1',
                        label: '跑道1',
                        type: 'children',
                        prefix: "距RWY",
                        suffix: "/",
                        children: [
                            {
                                prop: 'runway2',
                                label: '跑道2',
                                type: 'select',
                                placeholder: '请输入跑道2',
                            },
                        ],
                        placeholder: '请输入跑道',
                        span: [3, 8, 1],
                        width: "300px",
                    },
                    {
                        prop: 'runway2',
                        label: '跑道2',
                        type: 'select',
                        placeholder: '请输入跑道2',
                    },
                    {
                        prop: '内/外',
                        label: '内/外',
                        type: 'select',
                        prefix: "跑道入口以",
                        dicType: "延长线",
                        placeholder: '请选择内/外',
                        span: [4, 8, 0],
                        width: "300px",
                    },
                    {
                        prop: '距离组件',
                        label: '距离组件',
                        type: 'children',
                        prefix: "距离",
                        placeholder: '请输入距离组件',
                        width: "600px",
                        span: [1, 11, 0],
                        children: [
                            {
                                prop: '距离',
                                label: '距离',
                                type: 'input',
                                placeholder: '请输入距离',
                            },
                            {
                                prop: '距离单位',
                                label: '距离单位',
                                type: 'select',
                                placeholder: '请选择距离单位',
                                dicType: "长度",
                            }
                        ],
                    },
                    {
                        prop: '中心线',
                        label: '中心线',
                        type: 'select',
                        prefix: "距跑道",
                        placeholder: '请选择',
                        span: [4, 8, 0],
                        dicType: "中心线",
                    },
                    {
                        prop: '方位',
                        label: '方位',
                        type: 'select',
                        placeholder: '请输入方位',
                        dicType: "方位",
                    },
                    {
                        prop: '垂直距离组件',
                        label: '垂直距离组件',
                        type: 'children',
                        prefix: "垂直距离",
                        placeholder: '请输入距离组件',
                        width: "600px",
                        span: [2, 10, 0],
                        children: [
                            {
                                prop: '距离',
                                label: '距离',
                                type: 'input',
                                placeholder: '请输入距离',
                            },
                            {
                                prop: '距离单位',
                                label: '距离单位',
                                type: 'select',
                                placeholder: '请选择距离单位',
                                dicType: "长度",
                            }
                        ],
                    },
                ]
            },
            {
                prop: '自由文本',
                label: '自由文本',
                type: 'input',
                placeholder: '请输入文本',
            },
        ]
    },
]);

onMounted(() => {
    formFields.value = initOption(formFields);
});
</script>

<style scoped></style>