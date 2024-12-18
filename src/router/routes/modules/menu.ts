import { RoleType } from '@/types/roleType';

export default {
  path: 'menu',
  name: 'menu',
  id: 'menu',
  label: 'menu',
  component: () => import('@/views/menu/index.vue'),
  meta: {
    locale: '菜单管理',
    requiresAuth: true,
    order: 10,
    roles: [RoleType.admin],
  },
};