import axios from 'axios';

export interface FileVM {
    url: string;
    fileId?: number;
}
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
  //console.log("params", params);
  formData.append('file', params.file)
  //console.log(formData)

  return axios.post('/file/upload', formData, {
    headers: {
      //'Content-Type': 'multipart/form-data',
      'Accept': '*/*',
    },
  })
}



export function deleteFile(data: FileVM) {
    return axios.post<FileVM>('/file/delete', data);
}