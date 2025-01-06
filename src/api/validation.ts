import axios from 'axios';

export interface ValidationSearch {
    validationName: string;
    pageIndex: number;
    pageSize: number;
}
export interface ValidationVM {
    validationID: number;
    validationName: string;
    dicType: string;
    editMask: string;
    remark: string;
    required:boolean;
}

export function queryValidationList(params: ValidationSearch) {
    return axios.get('/validation/list', { params });
}
export function queryValidationDetail(params: { id: number }) {
    return axios.get('/validation/get', {
        params,
    });
}
export function deleteValidation(ids: []) {
    return axios.post('/validation/delete', ids);
}
export function postValidation(data: ValidationVM) {
    return axios.post<ValidationVM>('/validation/post', data);
}
