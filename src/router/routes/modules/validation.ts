import { RoleType } from '@/types/roleType';

export default {
  path: 'validation',
  name: 'Validation',
  id: 'Validation',
  label: 'Validation',
  component: () => import('@/views/validation/index.vue'),
  meta: {
    locale: 'menu.validation',
    requiresAuth: true,
    order: 4,
    roles: [RoleType.admin, RoleType.user],
  },
};
