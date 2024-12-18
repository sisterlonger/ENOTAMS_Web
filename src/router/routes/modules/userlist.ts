import { RoleType } from '@/types/roleType';

export default {
  path: 'userlist',
  name: 'userlist',
  id: 'userlist',
  label: 'userlist',
  component: () => import('@/views/userlist/index.vue'),
  meta: {
    locale: '用户管理',
    requiresAuth: true,
    order: 10,
    roles: [RoleType.admin, RoleType.user],
  },
};
