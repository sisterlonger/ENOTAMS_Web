import axios from 'axios';

export interface AirSpaceSearch {
    codeId?: string;
    txtLocalType?: string;
    txtName?: string;
    pageIndex: number;
    pageSize: number;
}
export function queryAirSpaceList(params: AirSpaceSearch) {
    return axios.get('/airspace/list', { params });
}
export function queryAirSpaceDetail(params: { id: string }) {
    return axios.get('/airspace/get', { params });
}
export function queryAirPortAndAirSpace(params: { qReach: string }) {
    return axios.get('/airspace/getairportandairspace',{params});
}
export function queryAirSpaceConfig(params: { id: string }) {
    return axios.get('/airspace/getairspaceconfig', { params });
}
export function queryAirSpaceTree(params: AirSpaceSearch) {
    return axios.get('/airspace/treelist', { params });
}
