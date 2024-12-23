import { defineStore } from 'pinia';
import { queryRoleMenu } from '@/api/fetchInterface';
import useUserStore from './user';

export const useMenuStore = defineStore('menu', {
  state() {
    return {
      menuList: [] as any[],
      flatMenuList: [] as any[],
    };
  },
  actions: {
    async getMenuList() {
      const userStore = useUserStore();
      if (!userStore.userCode) {
        return [];
      }
      const { data } = await queryRoleMenu();
      this.menuList = data;
      // 在这里添加默认路由
      this.menuListFlat();
      console.log("data",data);
      return data;
    },
    menuListFlat() {
      this.flatMenuList = [];
      const dfs = (item: any) => {
        this.flatMenuList.push(item);
        for (let i = 0; i < item.children.length; i += 1) {
          dfs(item.children[i]);
        }
      };
      for (let i = 0; i < this.menuList.length; i += 1) {
        dfs(this.menuList[i]);
      }
    },
  },
});
