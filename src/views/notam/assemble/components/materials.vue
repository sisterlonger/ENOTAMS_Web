<template>
    <div>
        <div v-for="(item, index) in materials" :key="index">
            <div class="title">{{ item }}</div>
            <tiny-file-upload ref="upload" :action="action" :data="requestData" :file-list="fileList" list-type="saas"
                :open-download-file="true" :headers='header' :before-remove="beforeRemove" prompt-tip @download-file="handleDownloadFile"
                @success="onSuccess" @error="onError"></tiny-file-upload>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, toRefs, onMounted } from 'vue'
import { TinyFileUpload, TinyModal } from '@opentiny/vue'
import { downloadFile } from '@/api/fetchInterface';
import { saveAs } from 'file-saver';
import { getToken } from '@/utils/auth';


const props = defineProps({
    templateID: Number,
    templateData: Object,
});
const { templateID } = toRefs(props);
const { templateData } = toRefs(props);
// 素材类型
const materials = ref([]);
// 上传地址TODO
const action = ref(`${import.meta.env.VITE_API_BASE_URL}/file/upload`)
// 上传接口的参数
const requestData = ref({
    //id: 123
})
const header =ref({Authorization:`Bearer ${getToken()}`})
// 文件列表
const fileList = reactive([
])

// 成功上传事件
const onSuccess = async (res, file) => {
    console.log(res, file);
    TinyModal.message({ message: '文件上传成功!', status: 'success' });
}
const onError = async (res, file) => {
    //console.log(res, file);
    TinyModal.message({ message: '文件上传失败!', status: 'error' });
}
// 下载事件
const handleDownloadFile = async (file) => {
    let requestFileName = "";
    if (!file.name.includes('/')) {
        let getCurrentDate = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        };

        // 获取日期前缀
        const datePrefix = getCurrentDate();
        requestFileName = `${datePrefix}/${file.name}`
    }
    else {
        requestFileName = file.names
    }
    try {
        // 该文件名附带日期
        const response = await downloadFile({ fileName:requestFileName });

        // 手动处理文件下载
        const contentDisposition = response.headers['content-disposition'];
        let fileName = file.name;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
            if (match) fileName = decodeURIComponent(match[1]);
        }

        saveAs(
            new Blob([response.data], { type: response.headers['content-type'] }),
            fileName
        );

        TinyModal.message({ message: '下载成功', status: 'success' });
    } catch (error) {
        console.error('下载失败:', error);
        TinyModal.message({
            message: error.response?.data?.msg || '下载失败',
            status: 'error'
        });
    }
};

function beforeRemove(file) {
    return new Promise((resolve, reject) => {
        TinyModal.confirm(`确定移除 ${file.name}?`).then((res) => {
            res === 'confirm' ? resolve() : reject(new Error('取消移除'))
        })
    })
}
// 请求数据接口方法
const fetchData = async () => {
    if (templateData.value.materials !== "" && templateData.value.materials !== null) {
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