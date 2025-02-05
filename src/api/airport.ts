import axios from 'axios';

export interface AirPortSearch {
    codeFir: string;
    codeId: string;
    txtName:string;
    pageIndex: number;
    pageSize: number;
}
export function queryAirPortTree(params: AirPortSearch) {
    return axios.get('/airport/treelist', { params });
}
export function queryAirPortDetail(params: { id: string}) {
    return axios.get('/airport/get', {
        params,
    });
}
export function queryRwyDirectionDetail(params: { id: string}) {
    return axios.get('/airport/getrwydirection', {
        params,
    });
}
