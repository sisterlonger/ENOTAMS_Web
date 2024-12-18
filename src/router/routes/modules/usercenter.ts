import { RoleType } from '@/types/roleType';

export default {
  path: 'usercenter',
  name: 'usercenter',
  id: 'usercenter',
  label: 'usercenter',
  component: () => import('@/views/usercenter/index.vue'),
  meta: {
    locale: '用户中心',
    requiresAuth: true,
    order: 7,
    roles: [RoleType.admin, RoleType.user],
  },
};
