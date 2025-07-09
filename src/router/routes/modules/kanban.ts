export default {
  path: 'board',
  name: 'board',
  component: () => import('@/views/kanban/board/index.vue'),
  meta: {
    locale: 'menu.board',
    order: 1,
  },
  children: [
    {
      path: 'work',
      name: 'work',
      component: () => import('@/views/kanban/board/home/index.vue'),
      meta: {
        locale: '工作台',
      },
    },
    {
      path: 'home',
      name: 'home',
      component: () => import('@/views/kanban/board/work/index.vue'),
      meta: {
        locale: '首页',
      },
    },
  ],
};
