import { RoleType } from '@/types/roleType';

export default {
  path: 'department',
  name: 'Department',
  id: 'Department',
  label: 'Department',
  component: () => import('@/views/department/index.vue'),
  meta: {
    locale: 'menu.department',
    requiresAuth: true,
    order: 8,
    roles: [RoleType.admin, RoleType.user],
  },
};
