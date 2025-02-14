import axios from 'axios';

export interface FeedbackSearch {
    content: string;
    comment?: string;
    state: number;
    pageIndex: number;
    pageSize: number;
}
export interface FeedbackVM {
    feedbackID: number;
    content: string;
    comment?: string;
    State: number;
}

export function queryFeedbackList(params: FeedbackSearch) {
    return axios.get('/feedback/list', { params });
}
export function queryFeedbackDetail(params: { id: number }) {
    return axios.get('/feedback/get', {
        params,
    });
}
export function deleteFeedback(ids: []) {
    return axios.post('/feedback/delete', ids);
}
export function postFeedback(data: FeedbackVM) {
    return axios.post<FeedbackVM>('/feedback/post', data);
}
export function auditFeedback(data: FeedbackVM) {
    return axios.post<FeedbackVM>('/feedback/audit', data);
}