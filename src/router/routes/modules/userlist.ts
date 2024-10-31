import { RoleType } from '@/types/roleType';

export default {
  path: 'userlist',
  name: 'UserList',
  id: 'UserList',
  label: 'UserList',
  component: () => import('@/views/userlist/index.vue'),
  meta: {
    locale: 'menu.userlist',
    requiresAuth: true,
    order: 10,
    roles: [RoleType.admin, RoleType.user],
  },
};
