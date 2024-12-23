export default {
  path: 'userlist',
  name: 'userlist',
  component: () => import('@/views/userlist/index.vue'),
  meta: {
    locale: '用户管理',
    order: 10,
  },
};
