<template>
    <div>
        <tiny-button type="info" @click="exportPDF">导出通知单</tiny-button>
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
                    <td colspan="3">提供人：姜静逸</td>
                    <td colspan="3">联系电话：13250527593</td>
                </tr>
                <tr>
                    <td colspan="3">提供单位：技术保障中心</td>
                    <td colspan="3">联系日期和时间：20250829</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">2.航空情报原始资料收集人</td>
                </tr>
                <tr>
                    <td colspan="3">收集人：admin</td>
                    <td colspan="3">联系电话：13250527593</td>
                </tr>
                <tr>
                    <td colspan="3">收集单位：飞行服务中心</td>
                    <td colspan="3">联系传真：</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">3.提供内容</td>
                </tr>
                <tr>
                    <td colspan="3">提供序列号：0003</td>
                    <td colspan="3">生效日期和时间：20250901</td>
                </tr>
                <tr>
                    <td colspan="3">共1页</td>
                    <td colspan="3">失效日期和时间：20250902</td>
                </tr>
                <tr>
                    <td colspan="6">
                        <pre
                            style="display: inline; margin: 0; font-family: inherit;">公布方式  √ 航行通告    □ 航空资料汇编修订  □ 航空资料汇报补充资料  □ 航空资料通报</pre>
                    </td>
                </tr>
                <tr>
                    <td colspan="6"><pre style="white-space: pre-wrap; margin: 0; font-family: inherit;">内容：<br>{{ pageData.value.telegramText }}</pre></td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">4.AIRAC事宜</td>
                </tr>
                <tr>
                    <td colspan="6">应采取AIRAC但未能实施的原因:{{  }}</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">5.声明</td>
                </tr>
                <tr>
                    <td colspan="6">提供的航空情报原始数据内容真实、数据准确、全面。</td>
                </tr>
                <tr>
                    <td colspan="6">负责人签名admin</td>
                </tr>
                <tr>
                    <td colspan="6" class="u-blod center">6.回执</td>
                </tr>
                <tr>
                    <td colspan="6">提供序列号：0003
                        <br>收集单位：飞行服务中心
                        <br>收集人：admin
                        <br>收集时间：20250829
                        <br>备注：无
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps, defineEmits, reactive, onMounted } from 'vue'
import { TinyButton } from '@opentiny/vue'
import pagePrint from '@/utils/tools'

const props = defineProps({
    formData: Object
});
const { formData } = toRefs(props);
const preCondition = ref(false);
const pageData = reactive({});
const exportPDF = () => {
    let iframeBody = document.getElementById(
        "exportElementProcessOperate"
    ).innerHTML;
    let iframeHtml =`
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
      </style>
    </head>
    <body>${iframeBody}</body>
    </html>`;
    let fileName = "航行通告原始资料通知单";
    pagePrint(fileName, iframeHtml);
};

// 初始化请求数据
onMounted(() => {
    pageData.value = formData.value;
    console.log(pageData)
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
.center{ 
  text-align: center;
}
/* 垂直+水平居中（需固定行高） */
.middle{
  vertical-align: middle; 
  text-align: center;
}
</style>