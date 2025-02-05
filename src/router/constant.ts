/* eslint-disable prefer-template */

//import DefaultLayout from '@/layout/default-layout.vue';
import { RouteRecordRaw } from 'vue-router';

export default [
  {
    path: '/',
    redirect: `${import.meta.env.VITE_CONTEXT}login`,
  },
  {
    path: `/${import.meta.env.VITE_CONTEXT}`,
    redirect: `${import.meta.env.VITE_CONTEXT}login`,
  },
  // 线上地址
  {
    path: `${import.meta.env.VITE_CONTEXT}login`,
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  /*
  {
    name: 'root',
    path: import.meta.env.VITE_CONTEXT,
    component: DefaultLayout,
    children: appRoutes,
  },*/
  {
    path: `${import.meta.env.VITE_CONTEXT}:pathMatch(.*)*`,
    name: 'notFound',
    component: () => import('@/views/other/not-found/index.vue'),
  },
  {
    name: 'redirect',
    path: `${import.meta.env.VITE_CONTEXT}redirect`,
    component: () => import('@/views/redirect.vue'),
  },
] as RouteRecordRaw[];
