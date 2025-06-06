import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useWorkFlowStore from './modules/workflow';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import { useTabStore } from './modules/tabs';

const pinia = createPinia();

export { useAppStore, useWorkFlowStore,useUserStore, useTabBarStore,useTabStore };
export default pinia;
