import axios from 'axios';

export interface RoleSearch {
    roleName: string;
    roleLevel: string;
    roleType: string;
    pageIndex: number;
    pageSize: number;
}
export interface RoleVM {
    roleID?: number;
    roleName: string;
    roleLevel: string;
    roleType: string;
    remark: string;
    createTime: null;
    updateTime: null;
    menuPermission?: any;

}

export function queryRoleList(params: RoleSearch) {
    return axios.get('/role/list', { params });
}
export function queryRoleDetail(params: { id: number }) {
    return axios.get('/role/get', {
        params,
    });
}
export function deleteRole(ids: []) {
    return axios.post(`/role/delete`, ids);
}
export function postRole(data: RoleVM) {
    return axios.post<RoleVM>(`/role/post`, data);
}

export function queryRoleMenu() {
    return axios.get('/role/getmenu');
}
export function queryRolePermission() {
    return axios.get('/role/getPermission');
}