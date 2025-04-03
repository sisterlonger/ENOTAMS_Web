/* eslint-disable prefer-template */
import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import { registerMicroApps, start } from 'qiankun';
import { loadMicroApp } from 'qiankun';

import createRouteGuard from './guard';
import constant from './constant';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...constant,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});


// 乾坤
// 注册子应用
/*
registerMicroApps([
  {
    name: 'child-app',
    entry: { scripts: ['//localhost:3000/main.js'] },
    container: '#subapp-container',
    activeRule: '/(.*)', // 匹配所有以 /child 开头的路由
  },
]);

start();*/

createRouteGuard(router);

export default router;
