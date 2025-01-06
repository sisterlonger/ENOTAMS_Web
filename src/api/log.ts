import axios from 'axios';

export interface LogsSearch {
    Module: string;
    pageIndex: number;
    pageSize: number;
}
export interface LogsVM {
    OperationID: number;
    Thread: string;
    Level: string;
    Logger: string;
    Message: string;
    Exception: number;
    Module: string;
    Object: string;
}

export function queryLogsList(params: LogsSearch) {
    return axios.get('/log/list', { params });
}
export function queryLogsDetail(params: { id: number }) {
    return axios.get('/log/get', {
        params,
    });
}
export function deleteLogs(ids: []) {
    return axios.post('/log/delete', ids);
}
export function postLogs(data: LogsVM) {
    return axios.post<LogsVM>('/log/post', data);
}
