export default {
  path: 'exception',
  name: 'exception',
  component: () => import('@/views/other/exception/index.vue'),
  meta: {
    locale: 'menu.exception',
    order: 6,
  },
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('@/views/other/exception/403/index.vue'),
      meta: {
        locale: 'menu.exception.403',
      },
    },
    {
      path: '404',
      name: '404',
      component: () => import('@/views/other/exception/404/index.vue'),
      meta: {
        locale: 'menu.exception.404',
      },
    },
    {
      path: '500',
      name: '500',
      component: () => import('@/views/other/exception/500/index.vue'),
      meta: {
        locale: 'menu.exception.500',
      },
    },
  ],
};
