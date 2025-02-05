export default {
  path: 'list',
  name: 'list',
  component: () => import('@/views/kanban/list/index.vue'),
  meta: {
    locale: '列表',
    order: 2,
  },
  children: [
    {
      path: 'table', // The midline path complies with SEO specifications
      name: 'table',
      component: () => import('@/views/kanban/list/search-table/index.vue'),
      meta: {
        locale: 'menu.list.searchTable',
      },
    },
  ],
};
