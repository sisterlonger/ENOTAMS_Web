import axios from 'axios';

export function queryNaipSettings() {
    return axios.get('/naipsetting/getallnaipdataversions', {});
}
