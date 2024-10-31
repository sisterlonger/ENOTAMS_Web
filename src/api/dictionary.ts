import axios from 'axios';

export interface DictionarySearch {
    dicType: string;
    pageIndex: number;
    pageSize: number;
}
export interface DictionaryVM {
    dicID: number;
    moduleName: string;
    dicType: string;
    dicKey: string;
    dicValue: string;
    orderID: number;
    dicDescription: string;
}

export function queryDictionaryList(params: DictionarySearch) {
    return axios.get('/dictionary/list', { params });
}
export function queryDictionaryDetail(params: { id: number }) {
    return axios.get('/dictionary/get', {
        params,
    });
}
export function deleteDictionary(ids: []) {
    return axios.post(`/dictionary/delete`,  ids );
}
export function postDictionary(data: DictionaryVM) {
    return axios.post<DictionaryVM>(`/dictionary/post`, data);
}
export function queryDicType() {
    return axios.get('/dictionary/getdictype');
}