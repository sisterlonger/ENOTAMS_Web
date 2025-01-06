import axios from 'axios';

export interface MenuSearch {
    menuName: string;
    pageIndex: number;
    pageSize: number;
}
export interface MenuVM {
    menuID?: number;
    menuName: string;
    order: string;
    parentID: string;
    menuType: string;
    icon: string;
    component: string;
    path: string;
    locale: string;
}

export function queryMenuList(params: MenuSearch) {
    return axios.get('/menu/list', { params });
}
export function queryMenuDetail(params: { id: number }) {
    return axios.get('/menu/get', {
        params,
    });
}
export function deleteMenu(ids: []) {
    return axios.post('/menu/delete', ids);
}
export function postMenu(data: MenuVM) {
    return axios.post<MenuVM>('/menu/post', data);
}
export function queryMenuTreeList(params?: MenuSearch) {
    return axios.get('/menu/treelist', { params });
}
export function queryMenuPermissionTreeList(params?: MenuSearch) {
    return axios.get('/menu/permissiontreelist', { params });
}
