import { RoleType } from '@/types/roleType';

export default {
  path: 'role',
  name: 'role',
  id: 'role',
  label: 'role',
  component: () => import('@/views/role/index.vue'),
  meta: {
    locale: '角色管理',
    requiresAuth: true,
    order: 12,
    roles: [RoleType.admin],
  },
};