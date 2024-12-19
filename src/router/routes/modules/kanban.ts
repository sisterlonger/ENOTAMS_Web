export default {
  path: 'board',
  name: 'board',
  id: 'board',
  label: 'board',
  component: () => import('@/views/board/index.vue'),
  meta: {
    locale: 'menu.board',
    order: 1,
  },
  children: [
    {
      path: 'work',
      name: 'work',
      id: 'work',
      label: 'work',
      component: () => import('@/views/board/work/index.vue'),
      meta: {
        locale: '工作台',
      },
    },
    {
      path: 'home',
      name: 'home',
      id: 'home',
      label: 'home',
      component: () => import('@/views/board/home/index.vue'),
      meta: {
        locale: '首页',
      },
    },
  ],
};
