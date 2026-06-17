import type { RouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', { eager: true });
// 这里插入角色权限页面
const appRoutes: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const defaultModule = modules[key].default;
  if (!defaultModule) return;
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule]
    : [defaultModule];
  appRoutes.push(...moduleList);
});
// TODO 添加动态路由的关键
export default appRoutes;
