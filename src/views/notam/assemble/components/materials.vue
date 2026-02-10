<template>
    <div v-if="preCondition">
        <div v-for="(item, index) in materials" :key="index">
            <div class="title">{{ item.title }}</div>
            <tiny-file-upload :ref="`upload${item.title}`" :http-request="(params) => httpRequest(params, item)"
                :file-list="item.fileList" list-type="saas" :open-download-file="true" :headers='header'
                :before-remove="beforeRemove" prompt-tip :disabled="act === 'detail'"
                @download-file="handleDownloadFile" @success="onSuccess" @error="onError">
            </tiny-file-upload>
        </div>
        <div>
            <div class="title">参考的航空情报资料列表</div>
            <tiny-select v-model="attachment" :options="attachmentOptions" placeholder="请选择该通知单参考的航空情报资料列表"
                clearable></tiny-select>
            <iframe v-show="attachment" :src="attachment" width="100%" height="600px" type="application/pdf" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, defineProps,defineEmits, toRefs, onMounted, watch } from 'vue'
import { TinyFileUpload, Modal, TinySelect, TinyModal } from '@opentiny/vue'
import { downloadFile, queryMessageDetail, queryTemplateDetail, deleteFile, updateFile, uploadFile } from '@/api/fetchInterface';
import { saveAs } from 'file-saver';
import { getToken } from '@/utils/auth';
import { isEmpty } from '@/utils/string-utils';

const emit = defineEmits(['changeFiles']);
const props = defineProps({
    templateID: Number,
    messageId: Number,
    act: String,
});
const { templateID } = toRefs(props);
const templateData = reactive({});
const { messageId } = toRefs(props);
const { act } = toRefs(props);
// 素材类型
const materials = ref([]);
const preCondition = ref(false);
// 上传接口的参数
const requestData = ref({
    //messageId: messageId.value || 0,
    //materialType: "",

})
const header = ref({ Authorization: `Bearer ${getToken()}` })
// 删除文件VM
const deleteFileVM = {
    messageId: 0,
    url: '',
};
// 机场图、情报图附件
const attachment = ref();
const attachmentOptions = ref([
    {
        label: '白云机场chart图',
        value: '/pdf/白云机场chart图.pdf',
    },
    {
        label: '白云机场高度chart图',
        value: '/pdf/白云机场高度chart图.pdf',
    },
    {
        label: '广州区域图',
        value: '/pdf/广州区域图.pdf',
    },
    {
        label: '航路图',
        value: '/pdf/航路图.pdf',
    },
    {
        label: '10A-RWY01L',
        value: '/pdf/10A-RWY01L.pdf',
    },
]);
watch(
    messageId,
    async (newValue) => {
        // 调用关联接口

        if (!isEmpty(newValue) && act.value === "add") {
            //console.log(newValue);
            //console.log(materials);
            let updateFileVM = [];
            materials.value.forEach(item => {
                if (item.fileList.length > 0) {
                    updateFileVM.push({ fileId: item.fileList[0].id, messageId: newValue })
                }
            })
            //console.log(updateFileVM);
            if (updateFileVM.length > 0) {
                await updateFile(updateFileVM).then((res1) => {
                    if (res1.code !== 200) {
                        Modal.message({ message: '更新文件失败', status: 'error' })
                    }
                });
            }
        }
    },
    { immediate: true, deep: true, }
);
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
    requestFileName = file.url
    console.log(file);
    console.log(requestFileName);
    try {
        // 该文件名附带日期
        const response = await downloadFile({ objectName: requestFileName });

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
// 修改 beforeRemove 函数
function beforeRemove(file, fileList) {
    console.log('文件:', file)
    console.log('文件列表:', fileList)
    console.log('materials:', materials.value)
    return new Promise((resolve, reject) => {
        TinyModal.confirm(`确定移除 ${file.name}？`).then((res) => {
            //res === 'confirm' ? resolve() : reject(new Error('取消移除'))
            if (res === 'confirm') {
                materials.value.forEach(item => {
                    if (!isEmpty(item.fileList) && item.fileList.length > 0) {
                        item.fileList.forEach(fileItem => {
                            if (fileItem.id === file.id) {
                                item.fileList.splice(item.fileList.indexOf(fileItem), 1)
                            }
                        })
                    }
                })
                console.log('materials.value:', materials.value)
                Modal.message({ message: '删除成功', status: 'success' })
                emit('changeFiles',materials.value);
            }

        })
    })
}

// 上传接口相关函数
const httpRequest = reactive((params, item) => {
    const { file } = params;
    console.log(item)
    return new Promise((resolve, reject) => {
        // 移除 await，直接使用 Promise 链
        uploadFile(file)
            .then((res1) => {
                if (res1.code === 200) {
                    Modal.message({ message: '上传成功', status: 'success' })
                    item.fileList.push({ name: res1.data.fileName, url: res1.data.folderPath + res1.data.fileName, id: res1.data.fileId })
                    console.log("materials.value",materials.value)
                    emit('changeFiles',materials.value);
                    resolve()
                } else {
                    Modal.message({ message: '上传失败', status: 'error' })
                    console.log(res1, materials)
                    resolve()
                }
            })
            .catch((error) => {
                console.log(error)
                reject(new Error(`上传失败！原因:${error}`))
            })
    })
})
const handleNoFile = (files) => {
    // 该模板下的附件类型
    if (!isEmpty(templateData.materials)) {
        let titleList = templateData.materials.split("、");
        titleList.forEach((title) => {
            let subFiles = files.filter((item) => item.materialType === title);
            let subFileList = [];
            if (subFiles && subFiles.length > 0) {
                subFiles.forEach((item) => { subFileList.push({ name: item.fileName, url: item.url, id: item.fileId }) })
            }
            materials.value.push({ title, fileList: subFileList || [], action: `${import.meta.env.VITE_API_BASE_URL}/api/file/minio/upload` });
        });
    }
    materials.value.push({ title: '其他', fileList: [] });
}
// 请求数据接口方法
const fetchData = async () => {
    let files = [];
    // 是有通告号的，编辑
    if (messageId.value) {
        const { data } = await queryMessageDetail({ id: messageId.value });
        console.log(data.files);
        // 有文件
        if (data.files.length > 0) {
            files = data.files;
            // 该模板下的附件类型
            if (!isEmpty(templateData.materials)) {
                let titleList = templateData.materials.split("、");
                titleList.forEach((title) => {
                    let subFiles = files.filter((item) => item.materialType === title);
                    let subFileList = [];
                    if (subFiles && subFiles.length > 0) {
                        subFiles.forEach((item) => { subFileList.push({ name: item.fileName, url: item.url, id: item.fileId }) })
                    }
                    materials.value.push({ title, fileList: subFileList || [], action: `${import.meta.env.VITE_API_BASE_URL}/api/file/minio/upload` });
                });
            }
            // 处理【其他】附件
            let otherFiles = files.filter((item) => item.materialType === "其他");
            let otherFileList = [];
            if (otherFiles && otherFiles.length > 0) {
                otherFiles.forEach((item) => { otherFileList.push({ name: item.fileName, url: item.url, id: item.fileId }) })
            }
            materials.value.push({ title: '其他', fileList: otherFileList || [], action: `${import.meta.env.VITE_API_BASE_URL}/api/file/minio/upload` });
        }
        // 无文件,和无通告号一样处理
        else {
            handleNoFile(files)
        }
    }
    // 无通告号,新增
    else {
        handleNoFile(files)
    }
    preCondition.value = true;
};
// 初始化请求数据
onMounted(async () => {
    if (templateID.value) {
        const { data } = await queryTemplateDetail({ id: templateID.value });
        Object.assign(templateData, data);
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