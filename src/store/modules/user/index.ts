import { defineStore } from 'pinia';
import {
  login as userLogin,
  loginMail as userLoginMail,
  getUserInfo,
  updateUserInfo,
  LoginData,
  LoginDataMail,
  queryRolePermission,
} from '@/api/fetchInterface';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState, UserInfo } from './types';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userID: '',
    userName: '',
    userCode: '',
    airSpaceCodeId:'',
    airPortCodeId:'',
    email:'',
    mobile:'',
    depName:'',
    fullName:'',
    field:'',
    roleName:'',
    rank:'',
    companySMSCode:'',
    department: 'Tiny-Vue-Pro',
    employeeType: 'social recruitment',
    job: 'Front end',
    probationStart: '2021-04-19',
    probationEnd: '2021-10-15',
    probationDuration: '180',
    protocolStart: '2021-04-19',
    protocolEnd: '2024-04-19',
    address: '',
    status: '',
    roleID: 0,
    sort: 1,
    startTime: '',
    endTime: '',
    filterStatus: [],
    filterType: [],
    submit: false,
    reset: false,
    menuPermissions:[],
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return state;
    },
  },
  actions: {
    /*
    switchRoles() {
      return new Promise((resolve) => {
        this.roleName = this.roleName === 'user' ? 'user' : 'admin';
        resolve(this.roleName);
      });
    },*/
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Reset filter information
    resetFilterInfo() {
      this.startTime = '';
      this.endTime = '';
      this.filterStatus = [];
      this.filterType = [];
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      const userInfo = res.data;
      console.log("userInfo",userInfo);
      //获取按钮权限
      const rolePerMissions = await queryRolePermission();
      userInfo.menuPermissions = rolePerMissions.data;
      this.setInfo(userInfo);
    },

    async updateInfo(data: UserInfo) {
      const res = await updateUserInfo(data);
      this.setInfo(res.data);
    },

    // Login登录接口的逻辑写在这里
    async login(loginForm: LoginData) {
      try {
        // 登录
        const res = await userLogin(loginForm);
        const { token, userInfo } = res.data;
        // 设置token
        setToken(token);
        // 获取按钮权限
        const rolePerMissions = await queryRolePermission();
        userInfo.menuPermissions = rolePerMissions.data;
        this.setInfo(userInfo);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async loginMail(loginForm: LoginDataMail) {
      try {
        const res = await userLoginMail(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Logout
    async logout() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
  },
});

export default useUserStore;
