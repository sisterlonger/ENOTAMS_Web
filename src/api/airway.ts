import axios from 'axios';

export interface AirWaySearch {
    txtDesig: string;
    txtLocType: string;
    pageIndex: number;
    pageSize: number;
}
export function queryAirWayTree(params: AirWaySearch) {
    return axios.get('/airway/treelist', { params });
}
export function queryAirWayDetail(params: { id: string}) {
    return axios.get('/airway/get', {
        params,
    });
}
