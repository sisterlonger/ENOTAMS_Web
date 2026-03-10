// utils/auth.ts
// 为每个标签页生成唯一标识
let tabId = sessionStorage.getItem('tab_id');
if (!tabId) {
  tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

// 清理函数，退出时调用
const cleanupOldTokens = () => {
  // 可以定期清理过期的token
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('token_tab_') && !key.includes(tabId)) {
      // 可以保留或清理，根据需求决定
      // localStorage.removeItem(key);
    }
  });
};

export { isLogin, getToken, setToken, clearToken, cleanupOldTokens };