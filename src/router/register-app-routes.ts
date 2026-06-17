import type { Router } from 'vue-router';
import DefaultLayout from '@/layout/default-layout.vue';
import appRoutes from './routes';
import noauthRoutes from './routes/noauth';

/**
 * 注册应用主路由（需鉴权）与无需鉴权路由。
 * 用于页面刷新时恢复路由，以及登录成功后动态挂载路由。
 */
export function registerAppRoutes(router: Router) {
  router.addRoute({
    name: 'root',
    path: import.meta.env.VITE_CONTEXT,
    component: DefaultLayout,
    children: appRoutes,
  });

  router.addRoute({
    name: 'noauth',
    path: import.meta.env.VITE_CONTEXT,
    children: noauthRoutes,
  });
}
