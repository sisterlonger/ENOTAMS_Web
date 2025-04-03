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
// 选择A项后获取机场参数
export function queryAirPortConfig(params: { id: string}) {
    return axios.get('/airport/getbycodeid', {
        params,
    });
}
// 选择跑道后获取跑道参数
export function queryRwyConfig(params: { name: string}) {
    return axios.get('/airport/getrwybyname', {
        params,
    });
}
export function queryRwyDirectionDetail(params: { id: string}) {
    return axios.get('/airport/getrwydirection', {
        params,
    });
}
