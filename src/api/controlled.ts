import axios from 'axios';

export function queryControlledDetail(params: { id: string }) {
    return axios.get('/controlled/get', { params });
}
