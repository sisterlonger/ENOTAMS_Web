import { RoleType } from '@/types/roleType';

export default {
  path: 'role',
  name: 'Role',
  id: 'Role',
  label: 'Role',
  component: () => import('@/views/role/index.vue'),
  meta: {
    locale: 'menu.role',
    requiresAuth: true,
    order: 12,
    roles: [RoleType.admin],
  },
};