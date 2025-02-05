export default {
  path: 'menu',
  name: 'menu',
  component: () => import('@/views/sysmng/menu/index.vue'),
  meta: {
    locale: '菜单管理',
    order: 10,
  },
};
