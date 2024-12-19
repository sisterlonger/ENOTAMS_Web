export default {
  path: 'node',
  name: 'node',
  id: 'node',
  label: 'node',
  component: () => import('@/views/node/index.vue'),
  meta: {
    locale: '节点管理',
    order: 1,
  },
};
