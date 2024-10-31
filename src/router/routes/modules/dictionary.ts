import { RoleType } from '@/types/roleType';

export default {
  path: 'dictionary',
  name: 'Dictionary',
  id: 'Dictionary',
  label: 'Dictionary',
  component: () => import('@/views/dictionary/index.vue'),
  meta: {
    locale: 'menu.dictionary',
    requiresAuth: true,
    order: 3,
    roles: [RoleType.admin, RoleType.user],
  },
};
