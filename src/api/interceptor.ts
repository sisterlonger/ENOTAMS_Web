import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Modal } from '@opentiny/vue';
import locale from '@opentiny/vue-locale';
import router from '@/router';
import { getToken, clearToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  errMsg: string;
  code: string | number;
  data: T;
  msg: string;
  count: number;
}

const { VITE_API_BASE_URL, VITE_BASE_API, VITE_MOCK_IGNORE } =
  import.meta.env || {};

if (VITE_API_BASE_URL) {
  axios.defaults.baseURL = VITE_API_BASE_URL;
}
const ignoreMockApiList = VITE_MOCK_IGNORE?.split(',') || [];
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const isProxy = ignoreMockApiList.includes(config.url);
    if (isProxy) {
      config.url = config.url?.replace(VITE_BASE_API, '/api/v1');
    }

    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers = { ...config.headers };

    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    if (res.code !== '0' && res.code !== 200) {
      (res.errMsg || res.msg) &&
        Modal.message({
          message: res.errMsg + res.msg,
          status: 'error',
        });
      return Promise.reject(new Error(res.errMsg + res.msg || 'Error'));
    }
    return res;
  },
  (error) => {
    const { status, data } = error.response;
    // console.log(status);
    // console.log(data.errMsg || data.msg);
    // console.log(data);
    if (status === 401) {
      clearToken();
      router.replace({ name: 'login' });
      Modal.message({
        message: locale.t('http.error.TokenExpire'),
        status: 'error',
      });
    } else {
      (data.errMsg || data.msg) &&
        Modal.message({
          message: locale.t(`http.error.${data.errMsg + data.msg}`),
          status: 'error',
        });
    }

    return Promise.reject(error);
  }
);