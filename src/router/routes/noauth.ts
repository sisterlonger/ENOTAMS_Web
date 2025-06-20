import type { RouteRecordRaw } from 'vue-router';

const noathus = import.meta.glob('./noauths/*.ts', { eager: true });
// 这里插入角色权限页面
//console.log("noathus",noathus);
const noathusRoutes: RouteRecordRaw[] = [];

Object.keys(noathus).forEach((key) => {
  const defaultModule = noathus[key].default;
  if (!defaultModule) return;
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule]
    : [defaultModule];
  noathusRoutes.push(...moduleList);
});
// TODO 添加动态路由的关键
export default noathusRoutes;