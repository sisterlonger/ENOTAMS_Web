import type { Router } from 'vue-router';
import { setRouteEmitter } from '@/utils/route-listener';
import setupPermissionGuard from './permission';
import { setupMenuGuard } from './menu';
import { setupTabsGuard } from './tabs';

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
}
