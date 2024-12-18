import { RoleType } from '@/types/roleType';

export default {
  path: 'node',
  name: 'node',
  id: 'node',
  label: 'node',
  component: () => import('@/views/node/index.vue'),
  meta: {
    locale: '节点管理',
    requiresAuth: true,
    order: 1,
    roles: [RoleType.admin, RoleType.user],
  },
};
