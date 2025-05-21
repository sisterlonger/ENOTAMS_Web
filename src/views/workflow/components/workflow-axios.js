import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_WORKFLOW_URL}/api`,
  timeout: 10000,
});

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    // 直接使用response.ok判断请求是否成功
    return response;
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // 请求已发送但未收到响应
      console.error('No response received:', error.request);
    } else {
      // 其他错误
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;