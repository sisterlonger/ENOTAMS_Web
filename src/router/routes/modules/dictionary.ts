import { RoleType } from '@/types/roleType';

export default {
  path: 'dictionary',
  name: 'dictionary',
  id: 'dictionary',
  label: 'dictionary',
  component: () => import('@/views/dictionary/index.vue'),
  meta: {
    locale: '字典管理',
    requiresAuth: true,
    order: 3,
    roles: [RoleType.admin, RoleType.user],
  },
};
