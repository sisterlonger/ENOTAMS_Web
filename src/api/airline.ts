import axios from 'axios';

export interface AirLineSearch {
    name: string;
    lineType: string;
    startAirportId: string;
    startAirportName: string;
    endAirportId: string;
    endAirportName: string;
    pageIndex: number;
    pageSize: number;
}
export function queryAirLineTree(params: AirLineSearch) {
    return axios.get('/airline/treelist', { params });
}
export function queryAirLineDetail(params: { id: string }) {
    return axios.get('/airline/get', {
        params,
    });
}
