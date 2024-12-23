export default {
  path: 'log',
  name: 'log',
  component: () => import('@/views/log/index.vue'),
  meta: {
    locale: '日志管理',
    order: 9,
  },
};
