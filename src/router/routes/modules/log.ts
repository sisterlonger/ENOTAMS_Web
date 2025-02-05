export default {
  path: 'log',
  name: 'log',
  component: () => import('@/views/sysmng/log/index.vue'),
  meta: {
    locale: '系统日志',
    order: 9,
  },
};
