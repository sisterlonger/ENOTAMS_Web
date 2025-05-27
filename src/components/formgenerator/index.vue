<template>
    <div>
        <tiny-row v-if="preCondition">
            <tiny-form ref="ruleFormRef" :model="formData" :rules="formRules" :label-width="formStyle.width || '100px'">
                <div v-for="(item, index) in formFields" :key="'field' + index">
                    <tiny-form-item v-if="!item.hidden" :label="keyWordLabel[index]" :prop="item.prop">
                        <!--输入组件-->
                        <tiny-input v-if="item.type.includes('input')" v-model="formData[item.prop]"
                            :placeholder="item.placeholder" clearable
                            :style="`width:${item.width !== null ? item.width : '200px'}`"
                            :type="item.type === 'inputtextarea' ? 'textarea' : 'text'" autosize
                            :maxlength="item.maxLength" @change="getOption(formData[item.prop], item)"></tiny-input>
                        <!--选择组件-->
                        <tiny-select v-if="item.type === 'select'" v-model="formData[item.prop]"
                            :placeholder="item.placeholder" :options="item.options" clearable filterable
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
import { ref, reactive, onMounted, toRefs, watch, toRaw, defineExpose, defineEmits } from 'vue';
import { queryDicType, queryRwyConfig, queryRadioNavigationConfig, getKeyWordJSON, queryRestrictedConfig, queryControlledConfig } from '@/api/fetchInterface';
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
//const emit = defineEmits(['onChangeE']);
import children from './components/children.vue';

const props = defineProps({
    keyWord: String,
    keyWordLabel: Object,
    // 可以用于实时更新关联选项
    staticData: Object,
});
const { keyWord } = toRefs(props);
const { keyWordLabel } = toRefs(props);
const { staticData } = toRefs(props);
const formFields = ref();
const formRules = reactive({});
const formData = reactive({});
const submitFormData = reactive({});
const keyList = reactive({});
const formStyle = reactive({ width: '100px', span: 6 });
const preCondition = ref(false);
const eData = ref({

});

// 1vn,静态数据发生变化时触发的函数，函数将会动态调整对应的关键字里选择器中的选项值
const updateOptions = async (newValue, fieldList) => {
    if (fieldList) {
        // 遍历formFields
        for (let i = 0; i < fieldList.length; i += 1) {
            const dicTypeKey = fieldList[i].associationName?.replace("$", "");
            // 如果找到对应的字段，则更新该字段的选项配置
            if (fieldList[i].associationName?.includes("$")      // 确保 associationName 存在且包含 $
                && typeof newValue[dicTypeKey] === "object") {
                formData[fieldList[i].prop] = "";
                fieldList[i].options = newValue[dicTypeKey];
            }
            if (fieldList[i].type.includes('hildren') && fieldList[i].children?.length > 0) {
                updateOptions(newValue, fieldList[i].children);
            }
        }
    }
}
// 1v1,静态数据发生变化时触发的函数，函数将会动态调整对应的关键字里选择器中的值
const updateValue = async (newValue, fieldList) => {
    if (fieldList) {
        // 遍历formFields
        for (let i = 0; i < fieldList.length; i += 1) {
            let targetValue = "";
            // 如果包含 +，则表示需要组合多个字段的值
            if (fieldList[i].associationName && fieldList[i].associationName.includes("+")) {
                // 拆分变量名数组
                let associationNameList = [];
                // 标志位，用于判断是否有效
                let flag = false;
                associationNameList = fieldList[i].associationName.split("+");
                associationNameList.forEach((item) => {
                    let dicTypeKey = item?.replace("$", "");
                    // 如果存在无效的字段，则这个字段都不组装了
                    if (typeof newValue[dicTypeKey] !== "object") {
                        targetValue += newValue[dicTypeKey];
                    }
                    else {
                        flag = true;
                    }
                });
                if (flag) {
                    targetValue = "";
                }
            }
            // 单个
            else {
                let dicTypeKey = fieldList[i].associationName?.replace("$", "");
                targetValue = newValue[dicTypeKey];
            }
            // 如果找到对应的字段，则更新该字段的值
            if (fieldList[i].associationName?.includes("$")        // 确保 associationName 存在且包含 $
                && targetValue                             // 确保 targetValue 存在
                && typeof targetValue === "string"         // 确保是字符串类型
            ) {
                formData[fieldList[i].prop] = targetValue;
            }
            if (fieldList[i].type.includes('hildren') && fieldList[i].children?.length > 0) {
                updateValue(newValue, fieldList[i].children);
            }
        }
    }
}
watch(
    staticData,
    (newValue) => {
        updateOptions(newValue, formFields.value);
        updateValue(newValue, formFields.value);

    },
    { immediate: true, deep: true, }
);
// 通用的校验函数
const validate = (rule, value, callback, data, options) => {
    // 报错原因，未能获取到rule（因为子没有暴露出来）
    const regex = new RegExp(rule.validators);
    if (!regex.test(value)) {
        callback(new Error(rule.validatortext));
    } else {
        callback();
    }
};
// 处理config函数
function createConfigItem(data, key) {
    return uniqueByProperty(data, key).map((item) => ({
        value: String(item[key]),
        label: String(item[key]),
    }));
}
// 去重
function uniqueByProperty(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
};
// E-E，某选项变化时，触发naip或者上下游选择器获取option,data是该选项的值，field是该选项的配置
const getOption = async (data, field) => {
    // 非初始化
    console.log("field", field);
    if (data) {
        // TODO,目前只有跑道，以后要多点其他。要灵活。是NAIP相关的,预留位置，关联其他选项来触发其他选项的可选项
        // 下周一优先处理这里，还有要新增动态+的功能
        // 跑道、机场、情报区等等
        if (field.label === "跑道") {
            let response = await queryRwyConfig({ name: formData[field.prop] });
            // 注意String化，可以分两批，第一批是机场参数(staticData)，第二批是跑道参数，跑道参数在这里初始化
            // 将count=1的全部放出来，=n的就保持如下并去重。
            // 1v多的就不回填，更新选项即可(去重)
            const rwyConfigKey = Object.keys(response.data);
            rwyConfigKey.forEach(key => {
                eData.value[`rwys${key}`] = String(response.data[key]);
            });
            const rwyDirectionConfig = {};
            const configKeys = [...new Set(response.data.rwyDirections.flatMap(Object.keys))];
            configKeys.forEach((key) => {
                rwyDirectionConfig[`rwyDirections${key}`] = createConfigItem(response.data.rwyDirections, key);
            });
            const keys = Object.keys(rwyDirectionConfig);
            keys.forEach(key => {
                // 1v1直接赋值
                if (rwyDirectionConfig[key].length === 1) {
                    eData.value[key] = rwyDirectionConfig[key][0].value;
                }
                else {
                    eData.value[key] = rwyDirectionConfig[key];
                }

            });
        }
        if (field.label === "NDB设备名称") {
            let response = await queryRadioNavigationConfig({ name: formData[field.prop] });
            const ndbConfigKey = Object.keys(response.data);
            ndbConfigKey.forEach(key => {
                eData.value[`ndbs${key}`] = String(response.data[key]);
            });
        }
        if (field.label === "VOR/DME设备名称") {
            let response = await queryRadioNavigationConfig({ name: formData[field.prop] });
            const vorConfigKey = Object.keys(response.data);
            vorConfigKey.forEach(key => {
                eData.value[`vors${key}`] = String(response.data[key]);
            });
        }
        if (field.label === "限制区名称") {
            let response = await queryRestrictedConfig({ name: formData[field.prop] });
            const restrictedConfigKey = Object.keys(response.data);
            restrictedConfigKey.forEach(key => {
                eData.value[`restricteds${key}`] = String(response.data[key]);
            });
            // 频率
            const restrictedRadioConfig = {};
            const restrictedRadioconfigKeys = [...new Set(response.data.restrictedRadios.flatMap(Object.keys))];
            restrictedRadioconfigKeys.forEach((key) => {
                restrictedRadioConfig[`restrictedRadios${key}`] = createConfigItem(response.data.restrictedRadios, key);
            });
            const restrictedRadioKeys = Object.keys(restrictedRadioConfig);
            restrictedRadioKeys.forEach(key => {
                // 1v1直接赋值
                if (restrictedRadioConfig[key].length === 1) {
                    eData.value[key] = restrictedRadioConfig[key][0].value;
                }
                else {
                    eData.value[key] = restrictedRadioConfig[key];
                }
            });
            // 垂直范围
            const restrictedClassConfig = {};
            const restrictedClassconfigKeys = [...new Set(response.data.restrictedClass.flatMap(Object.keys))];
            restrictedClassconfigKeys.forEach((key) => {
                restrictedClassConfig[`restrictedClass${key}`] = createConfigItem(response.data.restrictedClass, key);
            });
            const restrictedClassKeys = Object.keys(restrictedClassConfig);
            restrictedClassKeys.forEach(key => {
                // 1v1直接赋值
                if (restrictedClassConfig[key].length === 1) {
                    eData.value[key] = restrictedClassConfig[key][0].value;
                }
                else {
                    eData.value[key] = restrictedClassConfig[key];
                }
            });
        }
        if (field.label === "管制区名称") {
            let response = await queryControlledConfig({ name: formData[field.prop] });
            const controlledConfigKey = Object.keys(response.data);
            controlledConfigKey.forEach(key => {
                eData.value[`controlleds${key}`] = String(response.data[key]);
            });
            // 频率
            const controlledRadioConfig = {};
            const controlledRadioconfigKeys = [...new Set(response.data.controlledRadios.flatMap(Object.keys))];
            controlledRadioconfigKeys.forEach((key) => {
                controlledRadioConfig[`controlledRadios${key}`] = createConfigItem(response.data.controlledRadios, key);
            });
            const controlledRadioKeys = Object.keys(controlledRadioConfig);
            controlledRadioKeys.forEach(key => {
                // 1v1直接赋值
                if (controlledRadioConfig[key].length === 1) {
                    eData.value[key] = controlledRadioConfig[key][0].value;
                }
                else {
                    eData.value[key] = controlledRadioConfig[key];
                }
            });
            // 垂直范围
            const controlledClassConfig = {};
            const controlledClassconfigKeys = [...new Set(response.data.controlledClass.flatMap(Object.keys))];
            controlledClassconfigKeys.forEach((key) => {
                controlledClassConfig[`controlledClass${key}`] = createConfigItem(response.data.controlledClass, key);
            });
            const controlledClassKeys = Object.keys(controlledClassConfig);
            controlledClassKeys.forEach(key => {
                // 1v1直接赋值
                if (controlledClassConfig[key].length === 1) {
                    eData.value[key] = controlledClassConfig[key][0].value;
                }
                else {
                    eData.value[key] = controlledClassConfig[key];
                }
            });
        }
        updateOptions(eData.value, formFields.value);
        updateValue(eData.value, formFields.value);
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
// 用户输入字符串-替代-template中占位符$符号
function replaceDollarSequentially(str, replacements) {
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
    // 如果是children就不行,得根据template
    if (!formFieldList || formFieldList === null || formFieldList.length === 0) {
        return result;
    }
    formFieldList.forEach((field) => {
        // 如果是子组件则递归，递归返回多个
        if (field.type === "children") {
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
    return result;
}
// 组装关键字中的字符串
const assembleStr = () => {
    // 组装函数
    handleFormData(formFields.value);
    return toRaw(submitFormData);
}
defineExpose({ assembleStr });
// 递归式初始化rules,模版文字,选项
const initOption = (fieldList) => {
    fieldList.forEach((field) => {
        if (field.rules && field.rules.length > 0) {
            field.rules.forEach((rule) => {
                // 空的话就创建数组
                if (!formRules[field.prop]) {
                    formRules[field.prop] = [];
                }
                formRules[field.prop].push({ validator: validate, trigger: rule.trigger, required: rule.required, validatortext: rule.validatortext, validators: rule.validators });
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
    // 获取关键字配置
    let result = await getKeyWordJSON({ model: keyWord.value });
    formFields.value = result.data;
    // 初始化所有组件
    await initOption(formFields.value);
    preCondition.value = true;
});
</script>

<style scoped>
.tiny-form-item {
    margin-bottom: 10px;
}
</style>