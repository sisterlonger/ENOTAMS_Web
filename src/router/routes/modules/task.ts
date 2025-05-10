export default {
    path: 'task',
    name: 'task',
    component: () => import('@/views/workflow/task/index.vue'),
    meta: {
      locale: '待办任务',
      order: 5,
    },
  };
  