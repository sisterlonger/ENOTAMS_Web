export default {
  path: 'exception',
  name: 'exception',
  id: 'exception',
  label: 'exception',
  component: () => import('@/views/exception/index.vue'),
  meta: {
    locale: 'menu.exception',
    order: 6,
  },
  children: [
    {
      path: '403',
      name: '403',
      id: '403',
      label: '403',
      component: () => import('@/views/exception/403/index.vue'),
      meta: {
        locale: 'menu.exception.403',
      },
    },
    {
      path: '404',
      name: '404',
      id: '404',
      label: '404',
      component: () => import('@/views/exception/404/index.vue'),
      meta: {
        locale: 'menu.exception.404',
      },
    },
    {
      path: '500',
      name: '500',
      id: '500',
      label: '500',
      component: () => import('@/views/exception/500/index.vue'),
      meta: {
        locale: 'menu.exception.500',
      },
    },
  ],
};
