import axios from 'axios';

export interface TemplateSearch {
    DicType: string;
    pageIndex: number;
    pageSize: number;
}
export interface TemplateVM {
    DicID: number;
    ModuleName: string;
    DicType: string;
    DicKey: string;
    DicValue: string;
    OrderID: number;
    DicDescription: string;
}

export function queryTemplateList(params: TemplateSearch) {
    return axios.get('/template/list', { params });
}
export function queryTemplateDetail(params: { id: number }) {
    return axios.get('/template/get', {
        params,
    });
}
export function deleteTemplate(ids: []) {
    return axios.post('/template/delete',  ids );
}
export function postTemplate(data: TemplateVM) {
    return axios.post<TemplateVM>('/template/post', data);
}
