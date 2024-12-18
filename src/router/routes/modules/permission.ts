import { RoleType } from '@/types/roleType';

export default {
  path: 'permission',
  name: 'permission',
  id: 'permission',
  label: 'permission',
  component: () => import('@/views/permission/index.vue'),
  meta: {
    locale: '权限管理',
    requiresAuth: true,
    order: 11,
  },
};