import { RoleType } from '@/types/roleType';

export default {
  path: 'list',
  name: 'list',
  id: 'list',
  label: 'list',
  component: () => import('@/views/list/index.vue'),
  meta: {
    locale: '列表',
    requiresAuth: true,
    order: 2,
    roles: [RoleType.admin, RoleType.user],
  },
  children: [
    {
      path: 'table', // The midline path complies with SEO specifications
      name: 'Table',
      id: 'Table',
      label: 'Table',
      component: () => import('@/views/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchTable',
        requiresAuth: true,
        roles: [RoleType.admin, RoleType.user],
      },
    },
  ],
};
