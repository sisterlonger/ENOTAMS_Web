<template>
    <div v-if="preCondition">
        <div v-for="(item, index) in materials" :key="index">
            <div class="title">{{ item.title }}</div>
            <tiny-file-upload :ref="`upload${item.title}`" :action="item.action" :data="requestData"
                :file-list="item.fileList" list-type="saas" :open-download-file="true" :headers='header'
                :before-remove="beforeRemove" prompt-tip @download-file="handleDownloadFile" @success="onSuccess"
                @error="onError">
            </tiny-file-upload>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps, toRefs, onMounted } from 'vue'
import { TinyFileUpload, Modal } from '@opentiny/vue'
import { downloadFile, queryMessageDetail, deleteFile } from '@/api/fetchInterface';
import { saveAs } from 'file-saver';
import { getToken } from '@/utils/auth';
import { isEmpty } from '@/utils/string-utils';


const props = defineProps({
    templateID: Number,
    templateData: Object,
    messageId: Number,
    act: String,
});
const { templateID } = toRefs(props);
const { templateData } = toRefs(props);
const { messageId } = toRefs(props);
// 素材类型
const materials = ref([]);
const preCondition = ref(false);
// 上传接口的参数
const requestData = ref({
    messageId: messageId.value,
    materialType: "",
})
const header = ref({ Authorization: `Bearer ${getToken()}` })
// 删除文件VM
const deleteFileVM = {
    messageId: 0,
    url: '',
};

// 成功上传事件
const onSuccess = async (res, file) => {
    //console.log(res, file);
    Modal.message({ message: '文件上传成功!', status: 'success' });
}
const onError = async (res, file) => {
    //console.log(res, file);
    Modal.message({ message: '文件上传失败!', status: 'error' });
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
        const response = await downloadFile({ fileName: requestFileName });

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

        Modal.message({ message: '下载成功', status: 'success' });
    } catch (error) {
        console.error('下载失败:', error);
        Modal.message({
            message: error.response?.data?.msg || '下载失败',
            status: 'error'
        });
    }
};
// 移除前事件
function beforeRemove(file) {
    return new Promise((resolve, reject) => {
        Modal.confirm(`确定移除 ${file.name}?`).then(async (res) => {
            if (res === 'confirm') {
                resolve();
                deleteFileVM.fileId = file.id;
                deleteFileVM.url = file.url;
                await deleteFile(deleteFileVM).then((res1) => {
                    if (res1.code === 200) {
                        Modal.message({ message: '删除成功', status: 'success' })
                        resolve()
                    }
                    else {
                        Modal.message({ message: '删除失败', status: 'error' })
                        resolve()
                    }
                }).catch((error) => {
                    reject(new Error(`删除失败！原因:${error}`))
                });
                resolve();
            }
            else {
                reject(new Error('取消移除'))
            }
        })
    })
}
// 请求数据接口方法
const fetchData = async () => {
    let files = [];
    // 是有报文号的，编辑
    if (messageId.value) {
        const { data } = await queryMessageDetail({ id: messageId.value });
        // 有文件
        if (data.files.length > 0) {
            files = data.files;
            // 该模板下的附件类型
            if (templateData.value.materials !== "" && templateData.value.materials !== null) {
                let titleList = templateData.value.materials.split("、");
                titleList.forEach((title) => {
                    let subFiles = files.filter((item) => item.materialType === title);
                    let subFileList = [];
                    if (subFiles && subFiles.length > 0) {
                        subFiles.forEach((item) => { subFileList.push({ name: item.fileName, url: item.url, id: item.fileId }) })
                    }
                    materials.value.push({ title, fileList: subFileList || [], action: `${import.meta.env.VITE_API_BASE_URL}/file/upload?messageId=${messageId.value}&materialType=${title}` });
                });
            }
            // 处理【其他】附件
            let otherFiles = files.filter((item) => item.materialType === "其他");
            let otherFileList = [];
            if (otherFiles && otherFiles.length > 0) {
                otherFiles.forEach((item) => { otherFileList.push({ name: item.fileName, url: item.url, id: item.fileId }) })
            }
            materials.value.push({ title: '其他', fileList: otherFileList || [], action: `${import.meta.env.VITE_API_BASE_URL}/file/upload?messageId=${messageId.value}&materialType=其他` });
        }
        // 无文件
        else{
            materials.value.push({ title: '其他', fileList: [] });
        }
    }
    // 无报文号,新增
    else {
        materials.value.push({ title: '其他', fileList: [] });
    }
    console.log(materials.value)
    preCondition.value = true;
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