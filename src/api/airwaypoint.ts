import axios from 'axios';

export interface AirWayPointSearch {
    codeFir: string;
    codeType: string;
    txtName:string;
    pageIndex: number;
    pageSize: number;
}
export function queryAirWayPointTree(params: AirWayPointSearch) {
    return axios.get('/airwaypoint/treelist', { params });
}
export function queryAirWayPointDetail(params: { id: string}) {
    return axios.get('/airwaypoint/get', {
        params,
    });
}
