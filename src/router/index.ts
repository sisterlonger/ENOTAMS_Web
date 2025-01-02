/* eslint-disable prefer-template */
import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import createRouteGuard from './guard'
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

createRouteGuard(router);

export default router;
