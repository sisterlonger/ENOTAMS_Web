import axios from 'axios';

export interface PermissionSearch {
    menuName: string;
    pageIndex: number;
    pageSize: number;
}
export interface PermissionVM {
    permissionID?: number;
    permissionName: string;
    desc: string;

}

export function queryPermissionList(params: PermissionSearch) {
    return axios.get('/permission/list', { params });
}
export function queryPermissionDetail(params: { id: number }) {
    return axios.get('/permission/get', {
        params,
    });
}
export function deletePermission(ids: []) {
    return axios.post('/permission/delete', ids);
}
export function postPermission(data: PermissionVM) {
    return axios.post<PermissionVM>('/permission/post', data);
}
