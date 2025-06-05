import axios from 'axios';

export function downloadFile(params: { fileName: string }) {
  return axios.get('/file/download', {
    params,
    responseType: 'blob',
  });
}

export function uploadFile(params: {
  file: File;           // 文件对象
}) {
  const formData = new FormData()
  console.log("params.file", params.file);
  formData.append('file', params.file)
  console.log(formData)

  return axios.post('/file/upload', formData, {
    headers: {
      //'Content-Type': 'multipart/form-data',
      'Accept': '*/*',
    },
  })
}

// export function uploadFile(params: {
//   file: File;
// }) {
//   const formData = new FormData();
//   formData.append('file', params.file); // 字段名必须与后端一致

//   return axios.post('/file/upload', formData, {
//     headers: {
//       // 关键修复：不手动指定 Content-Type，浏览器会自动生成 multipart 格式
//       'Accept': '*/*',
//     },
//     // 添加以下配置增强稳定性
//     withCredentials: true,        // 如果跨域需要携带凭证
//     responseType: 'json',         // 明确期望 JSON 响应（根据后端实际返回类型调整）
//     onUploadProgress: (progress) => {
//       console.log('上传进度:',progress);
//     }
//   }).catch(error => {
//     // 统一错误处理（可选）
//     if (error.response) {
//       console.error('服务器返回错误:', error.response.data);
//     } else if (error.request) {
//       console.error('请求未收到响应:', error.request);
//     } else {
//       console.error('请求配置错误:', error.message);
//     }
//     throw error; // 保持错误传播以便上层处理
//   });
// }