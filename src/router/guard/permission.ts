import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { registerAppRoutes } from '../register-app-routes';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  // 应对刷新时的路由刷新
  registerAppRoutes(router);
  // 其他设置
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    async function crossroads() {
      const Permission = usePermission();
      if (Permission.accessRouter(to)) next();
      else {
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.roleName
        ) || {
          name: 'notFound',
        };
        next(destination);
      }
      NProgress.done();
    }
    // 已登录
    if (isLogin()) {
      if (userStore.roleName) {
        crossroads();
      } else {
        try {
          // 修复首次登录失败问题
          await userStore.info();
          crossroads();
        } catch (error) {
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
          NProgress.done();
        }
      }
    }
    // TODO无需登录的页面
    else if (to.meta.requiresAuth === false) {
      next();
      NProgress.done();
      //return;
    }
    // 未登录 
    else {

      if (to.name === 'login' || to.name === 'preview') {
        next();
        NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
