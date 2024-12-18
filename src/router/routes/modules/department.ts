import { RoleType } from '@/types/roleType';

export default {
  path: 'department',
  name: 'department',
  id: 'department',
  label: 'department',
  component: () => import('@/views/department/index.vue'),
  meta: {
    locale: '组织架构',
    requiresAuth: true,
    order: 8,
    roles: [RoleType.admin, RoleType.user],
  },
};
