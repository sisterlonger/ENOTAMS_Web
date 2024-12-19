export default {
  path: 'menu',
  name: 'menu',
  id: 'menu',
  label: 'menu',
  component: () => import('@/views/menu/index.vue'),
  meta: {
    locale: '菜单管理',
    order: 10,
  },
};