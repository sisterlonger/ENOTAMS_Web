import axios from 'axios';

export interface DepartmentSearch {
    DepName: string;
    pageIndex: number;
    pageSize: number;
}
export interface DepartmentVM {
    DepID: number;
    DepName: string;
    ParentDepID: string;
    DepCode: string;
    ParentDepCode: string;
    Grade: number;
    FullName: string;
    Field: string;
}

export function queryDepartmentList(params: DepartmentSearch) {
    return axios.get('/department/list', { params });
}
export function queryDepartmentTreeList(params?: DepartmentSearch) {
    return axios.get('/department/treelist', { params });
}
export function queryDepartmentDetail(params: { id: number }) {
    return axios.get('/department/get', {
        params,
    });
}
export function deleteDepartment(ids: []) {
    return axios.post(`/department/delete`,  ids );
}
export function postDepartment(data: DepartmentVM) {
    return axios.post<DepartmentVM>(`/department/post`, data);
}
