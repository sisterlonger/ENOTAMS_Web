import axios from 'axios';
import { UserInfo } from '@/store/modules/user/types';

export interface LoginData {
  userCode: string;
  userPwd: string;
}

export interface LoginDataMail {
  mailname: string;
  mailpassword: string;
}

export interface LoginRes {
  token: string;
  userInfo: UserInfo;
}
export interface UserRes {
  chartData: [];
  tableData: [];
}
export interface UserData {
  sort?: number | undefined;
  startTime?: string;
  endTime?: string;
  filterStatus?: [];
  filterType?: [];
}
export interface UserSearch {
  userName?: string;
}

export interface UserVM {
  userID: number;
  userCode: string;
  userPwd: string;
  UserName: string;
  DepID: number;
  companySMSCode?: string;
  rank?: string;
  mobile?: string;
  email?: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/user/login', data);
}
export function loginMail(data: LoginDataMail) {
  return axios.post<LoginRes>('/api/mail/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/user/logout');
}

export function getUserInfo() {
  return axios.get<UserInfo>('/user/info');
}

export function updateUserInfo(data: UserInfo) {
  return axios.put<UserInfo>('/api/user/userInfo', data);
}

export function getUserData(data?: UserData) {
  return axios.post<UserRes>('/api/user/data', data);
}

export function registerUser(data: LoginData) {
  return axios.post<UserInfo>('/api/user/register', data);
}

export function queryUserDetail(params: { id: number }) {
  return axios.get('/user/get', {
    params,
  });
}

export function queryUserList(params: UserSearch) {
  return axios.get('/user/list', { params });
}

export function deleteUser(ids: []) {
  return axios.post('/user/delete', ids);
}

export function postUser(data: UserVM) {
  return axios.post<UserVM>('/user/post', data);
}
