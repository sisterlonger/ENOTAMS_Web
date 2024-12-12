import { RoleType } from '@/types/roleType';

export default {
  path: 'menu',
  name: 'Menu',
  id: 'Menu',
  label: 'Menu',
  component: () => import('@/views/menu/index.vue'),
  meta: {
    locale: 'menu.menu',
    requiresAuth: true,
    order: 10,
    roles: [RoleType.admin],
  },
};