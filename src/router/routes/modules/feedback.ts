export default {
    path: 'feedback',
    name: 'feedback',
    component: () => import('@/views/sysmng/feedback/index.vue'),
    meta: {
      locale: '反馈记录',
      order: 10,
    },
  };