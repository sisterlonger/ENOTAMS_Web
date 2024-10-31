import { RoleType } from '@/types/roleType';

export default {
  path: 'keyword',
  name: 'KeyWord',
  id: 'KeyWord',
  label: 'KeyWord',
  component: () => import('@/views/keyword/index.vue'),
  meta: {
    locale: 'menu.keyword',
    requiresAuth: true,
    order: 2,
    roles: [RoleType.admin, RoleType.user],
  },
};
