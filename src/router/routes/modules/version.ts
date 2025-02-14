export default {
    path: 'version',
    name: 'version',
    component: () => import('@/views/sysmng/version/index.vue'),
    meta: {
      locale: '版本管理',
      order: 9,
    },
  };