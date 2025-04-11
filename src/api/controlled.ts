import axios from 'axios';

export function queryControlledDetail(params: { id: string }) {
    return axios.get('/controlled/get', { params });
}
export function queryControlledConfig(params: { name: string}) {
    return axios.get('/controlled/getbyname', {
        params,
    });
}
