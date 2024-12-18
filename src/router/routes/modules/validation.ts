import { RoleType } from '@/types/roleType';

export default {
  path: 'validation',
  name: 'validation',
  id: 'validation',
  label: 'validation',
  component: () => import('@/views/validation/index.vue'),
  meta: {
    locale: '校验管理',
    requiresAuth: true,
    order: 4,
    roles: [RoleType.admin, RoleType.user],
  },
};
