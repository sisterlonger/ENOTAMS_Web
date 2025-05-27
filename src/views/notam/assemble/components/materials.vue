<template>
    <div>
        <div v-for="(item, index) in materials" :key="index">
            <div class="title">{{ item }}</div>
            <tiny-file-upload ref="upload" :action="action" :file-list="fileList" list-type="saas" :open-download-file="true"
                :before-remove="beforeRemove" prompt-tip :file-size="[100, 200]" accept=".doc,.docx"
                @download-file="handleDownloadFile"></tiny-file-upload>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, toRefs, onMounted } from 'vue'
import { TinyFileUpload, TinyModal } from '@opentiny/vue'
import { queryTemplateDetail } from '@/api/fetchInterface';


const props = defineProps({
    templateID: Number,
    templateData: Object,
});
const { templateID } = toRefs(props);
const { templateData } = toRefs(props);
// 素材类型
const materials = ref([]);
// 上传地址TODO
const action = ref(`${import.meta.env.VITE_API_BASE_URL}/api/upload`)
// 文件列表
const fileList = reactive([
    {
        docId: 'M1T2A1N548572512085860351',
        path: 'edm/one/',
        docVersion: 'V1',
        name: '佐证材料1.png',
        docSize: 100 * 1024,
        size: 100 * 1024,
        serverName: 'ShenZhen'
    },
    {
        docId: 'M1T2A1N548572512085860352',
        path: 'edm/one/',
        docVersion: 'V1',
        name: '佐证材料2.png',
        docSize: 100 * 1024,
        size: 100 * 1024,
        serverName: 'ShenZhen'
    }
])
// 下载事件
const handleDownloadFile = (file) => {
    // 模拟下载成功场景
    if (file.docId === 'M1T2A1N548572512085860351') {
        file.showDownloadBar = true
        file.downloadPercentage = 0

        const timer = setInterval(() => {
            if (file.downloadPercentage >= 100) {
                clearInterval(timer)
                // 下载完成后可以隐藏进度条，因为进度条有过渡动画，所以可以延迟 1s 再隐藏
                setTimeout(() => {
                    file.showDownloadBar = false
                }, 1000)

                TinyModal.message({ message: '下载成功', status: 'success' })
                return
            }
            file.downloadPercentage += 10
        }, 300)
    } else {
        // 模拟下载失败场景
        file.showDownloadBar = true

        file.downloadPercentage = 0

        const timer = setInterval(() => {
            if (file.downloadPercentage >= 50) {
                clearInterval(timer)
                // file.showDownloadBar = false
                file.downloadStatus = 'exception'

                TinyModal.message({ message: '下载失败', status: 'error' })
                return
            }
            file.downloadPercentage += 10
        }, 300)
    }
}

function beforeRemove(file) {
    return new Promise((resolve, reject) => {
        TinyModal.confirm(`确定移除 ${file.name}?`).then((res) => {
            res === 'confirm' ? resolve() : reject(new Error('取消移除'))
        })
    })
}
// 请求数据接口方法
const fetchData = async () => {
    if(templateData.value.materials !== "" && templateData.value.materials !== null){
        materials.value = templateData.value.materials.split("、");
    }
    materials.value.push('其他');
};
// 初始化请求数据
onMounted(async () => {
    if (templateID.value) {
        await fetchData();
    }
});
</script>
<style>
.title {
    font-size: 20px;
    font-weight: bold;
    margin: 15px 0px
}
</style>