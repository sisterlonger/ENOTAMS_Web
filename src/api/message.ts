import axios from 'axios';

export interface MessageSearch {
    messageId?: number;
    type?: string;
    validType?: string;
    lat: string;
    long: string;
    radius: string;
    telegramText: string;
    startTime: string;
    endTime: string;
    pageIndex: number;
    pageSize: number;
}
export interface MessageVM {
    dicID: number;
    moduleName: string;
    dicType: string;
    dicKey: string;
    dicValue: string;
    orderID: number;
    dicDescription: string;
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
