export default {
    path: 'staticdata',
    name: 'staticdata',
    component: () => import('@/views/naip/staticdata/index.vue'),
    meta: {
      locale: '静态数据',
      order: 5,
    },
  };
