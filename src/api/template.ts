import axios from 'axios';

export interface TemplateSearch {
    DicType: string;
    pageIndex: number;
    pageSize: number;
}
export interface TemplateVM {
    templateID: null,
    template: string,
    remark: string,
    example: string,
    qCode: string,
    qFlightType: string,
    qTarget: string,
    qReach: string,
    qLowerLimit: string,
    qUpperLimit: string,
    qRadius: string,
    materials: string,
    relatedQCodes: string,
}

export function queryTemplateList(params: TemplateSearch) {
    return axios.get('/template/list', { params });
}
export function queryTemplateDetail(params: { id: number }) {
    return axios.get('/template/get', {
        params,
    });
}
export function queryByTemplateIdTemplateDetail(params: { templateId: number }) {
    return axios.get('/template/getbytemplateid', {
        params,
    });
}
export function deleteTemplate(ids: []) {
    return axios.post('/template/delete', ids);
}
export function postTemplate(data: TemplateVM) {
    return axios.post<TemplateVM>('/template/post', data);
}
