<template>
    <div>
        <tiny-button type="primary" @click="exportPDF">导出通知单</tiny-button>
        <div v-if="preCondition" id="exportElementProcessOperate">
            <table class="u-table">
                <!---标题--->
                <caption>
                    航空情报原始资料通知单
                </caption>
                <tr class="u-blod">
                    <td colspan="6" class="u-blod center">1.航空情报原始资料提供人</td>
                </tr>
                <tr>
                    <td colspan="3">提供人：{{ pageData.sendUserName }}</td>
                    <td colspan="3">联系电话：{{ pageData.sendUserMobile }}</td>
                </tr>
                <tr>
                    <td colspan="3">提供单位：{{ pageData.sendDepName }}</td>
                    <td colspan="3">联系日期和时间：{{ formatCustomDate(formattedTime) }}</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">2.航空情报原始资料收集人</td>
                </tr>
                <tr>
                    <td colspan="3">收集人：{{ pageData.receiveUserName }}</td>
                    <td colspan="3">联系电话：{{ pageData.receiveUserMobile }}</td>
                </tr>
                <tr>
                    <td colspan="3">收集单位：{{ pageData.receiveDepName }}</td>
                    <td colspan="3">联系传真：</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">3.提供内容</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <span class="print-only">通告序列号：{{ formData.notamSn }}</span> <!-- 打印时显示 -->
                        <div class="no-print"> <!-- 非打印时显示输入框 -->
                            <label for="serialNumberInput">通告序列号：{{ formData.notamSn }}</label>
                            <tiny-input id="serialNumberInput" :style="{
                                width: '200px'
                            }" v-model="formData.notamSn" placeholder="请输入序列号" v-if="act !== 'detail'"></tiny-input>
                        </div>
                    </td>
                    <td colspan="3">生效日期和时间：{{ formatCustomDate(formData.b_time) }}</td>
                </tr>
                <tr>
                    <td colspan="3">共1页</td>
                    <td colspan="3">失效日期和时间：{{ formatCustomDate(formData.c_time) }}</td>
                </tr>
                <tr>
                    <td colspan="6">
                        <pre
                            style="display: inline; margin: 0; font-family: inherit;">公布方式  √ 航行通告    □ 航空资料汇编修订  □ 航空资料汇报补充资料  □ 航空资料通报</pre>
                    </td>
                </tr>
                <tr>
                    <td colspan="6">
                        <pre
                            style="white-space: pre-wrap; margin: 0; font-family: inherit;">内容：<br>{{ pageData.e_data || pageData.telegramText }} </pre>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">4.AIRAC事宜</td>
                </tr>
                <tr>
                    <td colspan="6">应采取AIRAC但未能实施的原因:{{ }}</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">5.声明</td>
                </tr>
                <tr>
                    <td colspan="6">提供的航空情报原始数据内容真实、数据准确、全面。</td>
                </tr>
                <tr>
                    <td colspan="6">负责人签名:{{ pageData.userSign }}</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">6.回执</td>
                </tr>
                <tr>
                    <td colspan="6">通告序列号：{{ formData.notamSn }}
                        <br>收集单位：{{ pageData.receiveDepName }}
                        <br>收集人：{{ pageData.receiveUserName }}
                        <br>收集时间：{{ formatCustomDate(formattedTime) }}
                        <br>备注：{{ pageData.remark }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyButton, TinyInput } from '@opentiny/vue'
import { queryDepartmentDetail, queryUserDetail } from '@/api/fetchInterface';
import { useUserStore } from '@/store';
import pagePrint from '@/utils/tools'
import { isEmpty, formatTimeToYYMMDDHHMM, formatCustomDate } from '@/utils/string-utils';


const userStore = useUserStore();
const props = defineProps({
    formData: Object,
    act: String,
});
const { formData } = toRefs(props);
const { act } = toRefs(props);
const preCondition = ref(false);
const pageData = reactive({});
const exportPDF = () => {
    let iframeBody = document.getElementById(
        "exportElementProcessOperate"
    ).innerHTML;
    let iframeHtml = `
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { color: #606266; }
        .u-table {
          border: 1px solid #ebeef5;
          table-layout: fixed;
          border-spacing: 0;
          border-collapse: collapse;
          margin-bottom: 10px;
          font-size: 16px;
          width: 100%; /* 修复单位 */
        }
        .u-blod { font-weight: bold; }
        .u-table td, .u-table th {
          height: 30px;
          border-right: 1px solid #ebeef5;
          border-bottom: 1px solid #ebeef5;
          padding-left: 10px;
        }
        .u-table caption {
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: bold;
        }
        .center{ 
          text-align: center;
        }
        .middle {
          vertical-align: middle; 
          text-align: center;
        }
        /* 新增：打印时隐藏输入框区域 */
        .no-print {
          display: block;
        }
        .print-only {
          display: none;
        }
        @media print {
          .no-print {
            display: none;
          }
          .print-only {
            display: block;
          }
      </style>
    </head>
    <body>${iframeBody}</body>
    </html>`;
    let fileName = "航行通告原始资料通知单";
    pagePrint(fileName, iframeHtml);
};
// 使用 ref 来创建响应式的格式化时间变量
const formattedTime = ref('');


// 定义一个更新 formattedTime 的函数
const updateTime = () => {
    console.log(pageData.createTime)
    formattedTime.value = formatTimeToYYMMDDHHMM(pageData.createTime);
};
// 获取用户和部门信息
const getUserAndDepartmentInfo = async () => {
    // 获取用户信息
    // 分两种情况，如何add，就是当前人为发送人，如果edit，就直接拿messageid里的内容
    // 新增
    if (isEmpty(formData.value.messageId)) {
        // 第一种情况，就是当前人为发送人，那么就拿当前用户信息
        pageData.sendUserName = userStore.userInfo.userName
        pageData.sendDepName = userStore.userInfo.fullName
        pageData.sendUserMobile = userStore.userInfo.mobile
    }
    // 查看或者编辑
    else {
        // 第二种情况，就是当前人为接收人，那么就拿messageid里的内容
        if (!isEmpty(pageData.sendDepId)) {
            await queryDepartmentDetail({ id: pageData.sendDepId }).then((res) => {
                pageData.sendDepName = res.data.fullName || res.data.depName
            })
        }
        if (!isEmpty(pageData.receiveDepId)) {
            await queryDepartmentDetail({ id: pageData.receiveDepId }).then((res) => {
                pageData.receiveDepName = res.data.fullName || res.data.depName
            })
        }
        if (!isEmpty(pageData.sendUserId)) {
            await queryUserDetail({ id: pageData.sendUserId }).then((res) => {
                pageData.sendUserName = res.data.userName
                pageData.sendUserMobile = res.data.mobile
            })
        }
        if (!isEmpty(pageData.receiveUserId)) {
            await queryUserDetail({ id: pageData.receiveUserId }).then((res) => {
                pageData.receiveUserName = res.data.userName
                pageData.receiveUserMobile = res.data.mobile
            })
        }




    }
};
// 初始化请求数据
onMounted(async () => {
    Object.assign(pageData, formData.value);
    // 获取现在时间
    updateTime();
    await getUserAndDepartmentInfo()
    preCondition.value = true;
});
</script>

<style lang="css" scoped>
.u-table {
    border: 1px solid #ebeef5;
    width: 100;
    table-layout: fixed;
    border-spacing: 0;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 16px;
    width: 100%;
}

.u-table td,
.u-table th {
    height: 30px;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
    padding-left: 10px;
}

.u-table caption {
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: bold;
}

.u-blod {
    font-weight: bold;
}

/* 水平居中 */
.center {
    text-align: center;
}

/* 垂直+水平居中（需固定行高） */
.middle {
    vertical-align: middle;
    text-align: center;
}

/* 新增：控制打印和非打印状态的样式 */
.no-print {
    display: block;
    /* 默认显示输入框 */
}

.print-only {
    display: none;
    /* 默认隐藏纯文本 */
}

@media print {
    .no-print {
        display: none;
        /* 打印时隐藏输入框 */
    }

    .print-only {
        display: block;
        /* 打印时显示纯文本 */
    }
}
</style>