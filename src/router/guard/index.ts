import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupPermissionGuard from './permission';
import { setupMenuGuard } from './menu';
import { setupTabsGuard } from './tabs';
//import setupInfoGuard from './info';

function setupPageGuard(router: Router) {
  
  router.beforeEach(async (to) => {
    setRouteEmitter(to);
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
