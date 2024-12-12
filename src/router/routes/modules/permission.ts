import { RoleType } from '@/types/roleType';

export default {
  path: 'permission',
  name: 'Permission',
  id: 'Permission',
  label: 'Permission',
  component: () => import('@/views/permission/index.vue'),
  meta: {
    locale: 'menu.permission',
    requiresAuth: true,
    order: 11,
    roles: [RoleType.admin],
  },
};