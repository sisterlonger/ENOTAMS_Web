export default {
    path: 'exam',
    name: 'exam',
    component: () => import('@/views/notam/message/index.vue'),
    meta: {
        locale: '原始资料会商审核',
        order: 6,
        //requiresAuth: false,
    },
};