import { RoleType } from '@/types/roleType';

export default {
  path: 'keyword',
  name: 'keyword',
  id: 'keyword',
  label: 'keyword',
  component: () => import('@/views/keyword/index.vue'),
  meta: {
    locale: '关键字管理',
    requiresAuth: true,
    order: 2,
    roles: [RoleType.admin, RoleType.user],
  },
};
