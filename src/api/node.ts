import axios from 'axios';

export interface NodeVM {
    NodeID: number;
    ParentID: number;
    NodeName: string;
    Grade: number;
    State: string;
    OID: number;
}

export function queryNodeTree() {
    return axios.get('/node/treeList');
}
export function queryNodeTemplate(params: { id: number }) {
    return axios.get('/node/gettemplate', { params });
}
export function queryNodeDetail(params: { id: number }) {
    return axios.get('/node/get', {
        params,
    });
}
export function deleteNode(ids: []) {
    return axios.post('/node/delete', ids );
}
export function postNode(data: NodeVM) {
    return axios.post<NodeVM>('/node/post', data);
}
