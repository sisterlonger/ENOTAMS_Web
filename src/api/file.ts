import axios from 'axios';

export interface FileVM {
    url: string;
    fileId?: number;
}
export function downloadFile(params: { objectName: string }) {
  return axios.get('/api/file/minio/download', {
    params,
    responseType: 'blob',
  });
}

// 修改函数定义，直接接收 file 参数
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post('/api/file/minio/upload', formData, {
    headers: {
      'Accept': '*/*',
    },
  })
}

export function updateFile(data: FileVM) {
    return axios.post<FileVM>('/file/update', data);
}

export function deleteFile(data: FileVM) {
    return axios.post<FileVM>('/file/delete', data);
}