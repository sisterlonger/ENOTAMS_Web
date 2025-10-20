import axios from 'axios';

export interface MessageSearch {
    messageId?: number;
    qCode?: string;
    airSpaceCodeId?: string;
    type?: string;
    validType?: string;
    lat?: string;
    long?: string;
    radius?: string;
    telegramText?: string;
    startTime: string;
    endTime: string;
    pageIndex: number;
    pageSize: number;
}
export interface MessageVM {
    qCode: string;
    airSpaceCodeId: string;
    type: string;
    validType: string;
    lat: string;
    long: string;
    radius: string;
    telegramText: string;
    templateId: number;
    workflowId: number;
    parentId: number;
}
export interface MessageWorkflowVM {
    messageId: number;
    workflowId: string;
}
export interface PublishVM {
    messageId: number;
    state: string;
}
export interface SetDepIdVM {
    messageId: number;
    receiveDepId: number;
    consultDepId: string;
}
export function queryMessageList(params: MessageSearch) {
    return axios.get('/message/list', { params });
}
export function queryMessageDetail(params: { id: number }) {
    return axios.get('/message/get', {
        params,
    });
}
export function deleteMessage(ids: []) {
    return axios.post('/message/delete', ids);
}
export function postMessage(data: MessageVM) {
    return axios.post<MessageVM>('/message/post', data);
}
export function postWorkflowId(data: MessageWorkflowVM) {
    return axios.post<MessageWorkflowVM>('/message/postworkflowid', data);
}
export function publishMessage(data: PublishVM) {
    return axios.post<PublishVM>('/message/publish', data);
}
export function queryGetRelateMessage(params: { id: number }) {
    return axios.get('/message/getrelatemessage', {
        params,
    });
}

export function setDepId(data: SetDepIdVM) {
    return axios.post<SetDepIdVM>('/message/setdepid', data);
}