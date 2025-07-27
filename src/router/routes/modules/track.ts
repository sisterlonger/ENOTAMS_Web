export default {
    path: 'track',
    name: 'track',
    component: () => import('@/views/notam/message/index.vue'),
    meta: {
        locale: '原始资料跟踪',
        order: 6,
        //requiresAuth: false,
    },
};