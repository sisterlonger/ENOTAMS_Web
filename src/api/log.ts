import axios from 'axios';

export interface LogsSearch {
    module: string;
    pageIndex: number;
    pageSize: number;
}
export interface LogsVM {
    operationID: number;
    thread: string;
    level: string;
    logger: string;
    message: string;
    exception: number;
    module: string;
    object: string;
}
export interface UserLogsSearch {
    logger: string;
    message: string;
    module: string;
    loggerID?:number
}
export interface UserLogsVM {
    operationID: number;
    logTime: Date;
    logger: string;
    message: string;
    module: string;
    loggerID?:number
}

export function queryLogsList(params: LogsSearch) {
    return axios.get('/log/list', { params });
}
export function queryLogsDetail(params: { id: number }) {
    return axios.get('/log/get', {
        params,
    });
}
export function queryUserLogsList(params: UserLogsSearch) {
    return axios.get('/log/operationlist', { params });
}
export function queryUserLogsDetail(params: { ts: Date }) {
    return axios.get('/log/operationget', {
        params,
    });
}
export function pushTrackLogs(data: UserLogsVM) {
    return axios.post<UserLogsVM>('/log/pushtrack', data);
}
