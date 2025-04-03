import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import DefaultLayout from '@/layout/default-layout.vue';
import appRoutes from '../routes';

export default function setupPermissionGuard(router: Router) {
  // 应对刷新时的路由刷新
  router.addRoute({
    name: 'root',
    path: import.meta.env.VITE_CONTEXT,
    component: DefaultLayout,
    children: appRoutes,
  });
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
          userStore.role
        ) || {
          name: 'notFound',
        } || {
          name: 'preview',
        };
        next(destination);
      }
      NProgress.done();
    }
    // 已登录
    if (isLogin()) {
      if (userStore.role) {
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
