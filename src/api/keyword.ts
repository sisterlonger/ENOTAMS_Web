import axios from 'axios';

export interface KeyWordSearch {
    keyword: string;
    pageIndex: number;
    pageSize: number;
}
export interface KeyWordVM {
    keywordID: number;
    keyword: string;
    inputType: string;
    state: string;
    placeholder: string;
    dicType: string;
    prefix: string;
    suffix: string;
    span: string;
}

export function queryKeyWordList(params: KeyWordSearch) {
    return axios.get('/keyword/list', { params });
}
export function queryKeyWordDetail(params: { id: number }) {
    return axios.get('/keyword/get', {
        params,
    });
}
export function deleteKeyWord(ids: []) {
    return axios.post(`/keyword/delete`, ids);
}
export function postKeyWord(data: KeyWordVM) {
    return axios.post<KeyWordVM>(`/keyword/post`, data);
}
