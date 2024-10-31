import { RoleType } from '@/types/roleType';

export default {
  path: 'node',
  name: 'Node',
  id: 'Node',
  label: 'Node',
  component: () => import('@/views/node/index.vue'),
  meta: {
    locale: 'menu.node',
    requiresAuth: true,
    order: 1,
    roles: [RoleType.admin, RoleType.user],
  },
};
