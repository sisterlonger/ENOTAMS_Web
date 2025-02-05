import axios from 'axios';

export interface RadioNavigationSearch {
    codeFir: string;
    codeType: string;
    txtName:string;
    pageIndex: number;
    pageSize: number;
}
export function queryRadioNavigationTree(params: RadioNavigationSearch) {
    return axios.get('/radionavigation/treelist', { params });
}
export function queryRadioNavigationDetail(params: { id: string}) {
    return axios.get('/radionavigation/get', {
        params,
    });
}
