export default {
    path: 'enotam/:pathMatch(.*)*',
    name: 'enotam',
    component: () => import('@/views/notam/assemble/components/enotam.vue'),
    meta: {
      locale: '通告详情',
      order: 0,
      requiresAuth: false,
    },
  };
//做一个单独的路由，能够接受route，参看message/index.vue
/*
export default {
  path: 'message',
  name: 'message',
  component: () => import('@/views/notam/message/index.vue'),
  meta: {
    locale: '报文管理',
    order: 6,
    requiresAuth: false,
  },
  children: [
    // 子路由 1：带路径参数的详情页（如 /message/detail/123）
    {
      path: 'test/:id', // 路径参数 id
      name: 'message-detail',
      component: () => import('@/views/notam/message/components/form.vue'), // 子组件
      //meta: { ...meta, title: '详情' }, // 可选：继承或覆盖 meta
    },
    // // 子路由 2：列表页（如 /message/list）
    // {
    //   path: 'list',
    //   name: 'message-list',
    //   component: () => import('@/views/notam/message/List.vue'), // 子组件
    //   meta: { ...meta, title: '列表' },
    // },
    // 子路由 3：通配所有未定义的子路径（可选，作为兜底）
    {
      path: ':pathMatch(.*)*', // 匹配如 /message/unknown/123
      name: 'message-wildcard',
      component: () => import('@/views/other/exception/500/index.vue'), // 兜底组件
      //meta: { ...meta, title: '未知页面' },
    },
  ],
};*/