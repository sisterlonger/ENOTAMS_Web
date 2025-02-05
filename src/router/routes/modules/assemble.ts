export default {
  path: 'assemble',
  name: 'assemble',
  component: () => import('@/views/notam/assemble/index.vue'),
  meta: {
    locale: '报文组装',
    order: 5,
  },
};
