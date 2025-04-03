import axios from 'axios';

export function queryRestrictedDetail(params: { id: string }) {
    return axios.get('/restricted/get', { params });
}
