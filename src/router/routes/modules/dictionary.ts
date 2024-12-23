export default {
  path: 'dictionary',
  name: 'dictionary',
  component: () => import('@/views/dictionary/index.vue'),
  meta: {
    locale: '字典管理',
    order: 3,
  },
};
