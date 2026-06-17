// utils/auth.ts
// 为每个标签页生成唯一标识
let tabId = sessionStorage.getItem('tab_id');
if (!tabId) {
  tabId = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  sessionStorage.setItem('tab_id', tabId);
}

const getTokenKey = () => {
  return `token_${tabId}`;
};

const isLogin = () => {
  return !!localStorage.getItem(getTokenKey());
};

const getToken = () => {
  return localStorage.getItem(getTokenKey());
};

const setToken = (token: string) => {
  localStorage.setItem(getTokenKey(), token);
};

const clearToken = () => {
  localStorage.removeItem(getTokenKey());
};

export { isLogin, getToken, setToken, clearToken };