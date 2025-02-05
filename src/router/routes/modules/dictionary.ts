export default {
  path: 'dictionary',
  name: 'dictionary',
  component: () => import('@/views/notam/dictionary/index.vue'),
  meta: {
    locale: '字典管理',
    order: 3,
  },
};
