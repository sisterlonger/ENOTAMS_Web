<template>
  <div class="menu-router">
    <tiny-tree-menu
      ref="tree" :data="MenuData" :show-filter="false" node-key="id" wrap
      :default-expanded-keys="expandeArr" @current-change="currentChange">
      <template #default="slotScope">
        <template v-for="(item, index) in routerTitle" :key="index">
          <span v-if="slotScope.label === item.value" class="menu-title">
            <component :is="item.icon"></component>
            <span>{{ item.name }}</span>
          </span>
        </template>
      </template>
    </tiny-tree-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted, unref } from 'vue';
import { RouteRecordNormalized } from 'vue-router';
import { TreeMenu as tinyTreeMenu } from '@opentiny/vue';
import { useMenuStore } from '@/store/modules/router';
import router from '@/router';
import { useUserStore } from '@/store';
import * as icons from '@opentiny/vue-icon';
import { useDeepClone } from '@/hooks/useDeepClone';


const menuStore = useMenuStore();
menuStore.getMenuList();
const tree = ref();
const expandeArr = ref();
let routerTitle = [] as any;

const userStore = useUserStore();
const role = computed(() => userStore.role);
const filtter = (arr: any[]) => {
  arr.forEach((item: any) => {
    // 这部分是菜单的树，路径作为id，与点击事件串联起来
    item.id = item.path;
    item.label = item.menuName;
    item.meta = { url: item.path };
    // 这部分是菜单的template内容
    routerTitle.push({
      value: item.menuName,
      name: item.menuName,
      //name: item.meta.locale,
      icon: item.icon ? icons[item.icon]() : "",
      bold: 'main-title',
    },);
  });

  return arr.filter((e: { children: any[]; meta: { hideInMenu: any } }) => {
    if (e.children) {
      e.children = e.children.filter((v: { meta: { hideInMenu: any } }) => {
        return true;
      });
      filtter(e.children);
    }
    return true;
  });
};

const rawMenuData = computed(() => useDeepClone(unref(menuStore.menuList)));
const MenuData = computed(() => {
  routerTitle = [];
  return filtter(rawMenuData.value);
});


/**
 * 监听路由变化高亮当前菜单,因为路径的值是唯一的，所以用路径作为id来对应
 */
onMounted(() => {
  watch(
    () => router.currentRoute.value.path,
    (newValue: string) => {
      const menuKey = newValue
        .replace(/^.*\//, '')
        .replace(/^[a-z]/, (s: string) => s);
      expandeArr.value = [menuKey];
      tree.value.setCurrentKey(menuKey);
    },
    { immediate: true },
  );
});
const currentChange = (data: any, node: any) => {
  if (!node.isLeaf) {
    return;
  }
  router.push({ name: data.meta.url.split('/').pop()});
};
</script>

<style lang="less" scoped>
.main-title {
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  color: #000;
}

.title {
  height: 20px;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
}

.menu-title {
  display: flex;
  gap: 10px;
  align-items: center;
  height: 20px;

  >svg {
    width: 1.3em;
    height: 1.3em;
  }
}

:deep(.tiny-tree-node__wrapper > .is-current > .tiny-tree-node__content) {
  color: #000 !important;
  background: none !important;
  margin-left: 0 !important;

  &:hover {
    background: #fff !important;
    color: #fff !important;
  }
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children > .tiny-tree-node__wrapper > .is-current > .tiny-tree-node__content) {
  background-color: var(--ti-tree-menu-node-hover-bg-color) !important;
  margin-left: 0 !important;

  &:hover {
    background: var(--ti-tree-menu-node-hover-bg-color) !important;
  }
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children .tiny-tree-node__wrapper .is-current .tiny-tree-node__content .tree-node-name) {
  border-left: 2px solid var(--ti-tree-menu-square-left-border-color, '#fff') !important;
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children .tiny-tree-node__wrapper .is-current .tiny-tree-node__content .tiny-tree-node__content-right) {
  background-color: var(--ti-tree-menu-node-hover-bg-color) !important;
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children .tiny-tree-node__wrapper .is-current .tiny-tree-node__content .tiny-tree-node__content-left .tiny-tree-node__content-box) {
  background-color: var(--ti-tree-menu-node-hover-bg-color) !important;
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children .tiny-tree-node__wrapper .is-current .tiny-tree-node__content .tiny-tree-node__content-left .tiny-tree-node__content-box:before) {
  display: none !important;
}

:deep(.tiny-tree-node__wrapper > .is-expanded > .tiny-tree-node__children .tiny-tree-node__wrapper .is-current .tiny-tree-node__content .tiny-tree-node__content-left:before) {
  display: none !important;
}

:deep(.tiny-tree-node__wrapper > .is-current > .tiny-tree-node__content) {
  background-color: #fff !important;
}

:deep(.tiny-tree-node__wrapper > .is-current > .tiny-tree-node__content .tiny-tree-node__content-box) {
  background-color: #fff !important;
}

:deep(.tiny-tree-node__content:hover) {
  background-color: var(--ti-tree-node-content-hover-bg-color) !important;
}

:deep(.tiny-tree-menu__wrap > .tiny-tree-node__wrapper > .is-root > .tiny-tree-node__content > .tiny-tree-node__content-left .tiny-tree-node__content-box .tree-node-name) {
  padding: 0 8px !important;
}

:deep(.tiny-tree-node > .tiny-tree-node__content) {
  margin-left: 0 !important;
}

.tiny-tree-menu .tiny-tree .tiny-tree-node.is-current>.tiny-tree-node__content .tree-node-name .tiny-svg {
  fill: var(--ti-base-icon-color);
}
</style>
