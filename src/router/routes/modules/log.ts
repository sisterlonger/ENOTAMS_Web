import { RoleType } from '@/types/roleType';

export default {
  path: 'log',
  name: 'Log',
  id: 'Log',
  label: 'Log',
  component: () => import('@/views/log/index.vue'),
  meta: {
    locale: 'menu.log',
    requiresAuth: true,
    order: 9,
    roles: [RoleType.admin],
  },
};
