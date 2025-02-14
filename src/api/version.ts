import axios from 'axios';

export interface VersionVM {
    versionID: number;
    title: string;
    content: string;
}

export function queryVersionList() {
    return axios.get('/version/list');
}
export function pushVersion(data: VersionVM) {
    return axios.post<VersionVM>('/version/push', data);
}
