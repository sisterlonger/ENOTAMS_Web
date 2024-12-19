export default {
  path: 'list',
  name: 'list',
  id: 'list',
  label: 'list',
  component: () => import('@/views/list/index.vue'),
  meta: {
    locale: '列表',
    order: 2,
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
      },
    },
  ],
};
