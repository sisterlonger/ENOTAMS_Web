import { RoleType } from '@/types/roleType';

export default {
  path: 'usercenter',
  name: 'UserCenter',
  id: 'UserCenter',
  label: 'UserCenter',
  component: () => import('@/views/usercenter/index.vue'),
  meta: {
    locale: 'menu.usercenter',
    requiresAuth: true,
    order: 7,
    roles: [RoleType.admin, RoleType.user],
  },
};
