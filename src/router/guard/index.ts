import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import { trackEvent } from '@/utils/track'; 
import setupPermissionGuard from './permission';
import { setupMenuGuard } from './menu';
import { setupTabsGuard } from './tabs';
//import setupInfoGuard from './info';

function setupPageGuard(router: Router) {
  
  router.beforeEach(async (to) => {
    setRouteEmitter(to);
    // 页面埋点
    //trackEvent('路由跳转', { path: to.path, fullPath: to.fullPath, name: to.name });
  });
  setupMenuGuard(router);
  setupTabsGuard(router);
  setupPermissionGuard(router);
}

export default function createRouteGuard(router: Router) {
  setupPageGuard(router);
  // 取消注释则无法刷新会导致404
  //if(import.meta.env.VITE_USE_MOCK) setupPermissionGuard(router);
}
