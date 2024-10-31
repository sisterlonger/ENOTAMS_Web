<template>
  <div class="menu-router">
    <tiny-tree-menu ref="tree" :data="treeDataFilter" :show-filter="false" node-key="id" wrap
      :default-expanded-keys="expandeArr" @current-change="currentChange">
      <template #default="slotScope">
        <template v-for="(item, index) in routerTitle" :key="index">
          <span v-if="slotScope.label === item.value" class="menu-title">
            <component :is="item.icon"></component>
            <span :class="item.bold">{{ $t(item.name) }}</span>
          </span>
        </template>
      </template>
    </tiny-tree-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue';
import { RouteRecordNormalized } from 'vue-router';
import {
  IconAssociation,
  IconCheckOut,
  IconText,
  IconCueL,
  IconUser,
  IconAdministrator,
  IconWordType,
  IconVersiontree,
  IconGrade,
  IconWriting,
  IconApplication,
  IconFiles
} from '@opentiny/vue-icon';
import { TreeMenu as tinyTreeMenu } from '@opentiny/vue';
import router from '@/router';
import { useUserStore } from '@/store';
import { TabItem } from '@opentiny/vue';

// icon图标
const iconAssociation = IconAssociation();
const iconCheckOut = IconCheckOut();
const iconText = IconText();
const iconCueL = IconCueL();
const iconUser = IconUser();
const iconAdministrator = IconAdministrator();
const iconWordType = IconWordType();
const iconVersiontree = IconVersiontree();
const iconGrade = IconGrade();
const iconWriting = IconWriting();
const iconApplication = IconApplication();
const iconFiles = IconFiles();
const tree = ref();
const expandeArr = ref();
const routerTitle = [
{
    value: 'UserList',
    name: 'menu.userlist',
    icon: iconAdministrator,
    bold: 'main-title',
  },
  {
    value: 'Board',
    name: 'menu.board',
    icon: iconApplication,
    bold: 'main-title',
  },
  {
    value: 'Home',
    name: 'menu.home',
    icon: null,
    bold: 'title',
  },
  {
    value: 'Work',
    name: 'menu.work',
    icon: null,
    bold: 'title',
  },
  {
    value: 'List',
    name: 'menu.list',
    icon: iconFiles,
    bold: 'main-title',
  },
  {
    value: 'Table',
    name: 'menu.list.searchTable',
    icon: null,
    bold: 'title',
  },
  {
    value: 'Exception',
    name: 'menu.exception',
    icon: iconCueL,
    bold: 'main-title',
  },
  {
    value: '403',
    name: 'menu.exception.403',
    icon: null,
    bold: 'title',
  },
  {
    value: '404',
    name: 'menu.exception.404',
    icon: null,
    bold: 'title',
  },
  {
    value: '500',
    name: 'menu.exception.500',
    icon: null,
    bold: 'title',
  },
  {
    value: 'UserCenter',
    name: 'menu.usercenter',
    icon: iconUser,
    bold: 'main-title',
  },
  {
    value: 'Node',
    name: 'menu.node',
    icon: iconVersiontree,
    bold: 'main-title',
  },
  {
    value: 'KeyWord',
    name: 'menu.keyword',
    icon: iconWordType,
    bold: 'main-title',
  },
  {
    value: 'Validation',
    name: 'menu.validation',
    icon: iconCheckOut,
    bold: 'main-title',
  },
  {
    value: 'Dictionary',
    name: 'menu.dictionary',
    icon: iconText,
    bold: 'main-title',
  },
  {
    value: 'Assemble',
    name: 'menu.assemble',
    icon: iconAssociation,
    bold: 'main-title',
  },
  {
    value: 'Department',
    name: 'menu.department',
    icon: iconGrade,
    bold: 'main-title',
  },
  {
    value: 'Log',
    name: 'menu.log',
    icon: iconWriting,
    bold: 'main-title',
  },
];

// 获取路由数据
const appRoute = computed(() => {
  return router
    .getRoutes()
    .find((el: { name: string; }) => el.name === 'root') as RouteRecordNormalized;
});
const copyRouter = JSON.parse(JSON.stringify(appRoute.value.children));
copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
  return (a.meta.order || 0) - (b.meta.order || 0);
});

const userStore = useUserStore();
const role = computed(() => userStore.role);
let treeData = ref(copyRouter);
const treeDataForEach = (arr: any[]) => {
  return arr.filter((e: { children: any[]; meta: { hideInMenu: any } }) => {
    if (e.children) {
      e.children = e.children.filter((v: { meta: { hideInMenu: any } }) => {
        return !v.meta.hideInMenu;
      });
      treeDataForEach(e.children);
    }
    return !e.meta.hideInMenu;
  });
};
let treeDataFilter = treeDataForEach(treeData.value);

watch(
  role,
  (newValue: string) => {
    treeData.value = copyRouter.filter(
      (item: { name: string, meta: { roles: Array<string> } }) => item.meta.roles.includes(newValue)
    );
    treeDataFilter = treeDataForEach(treeData.value);

  },
  { immediate: true }
);

/**
 * 监听路由变化高亮当前菜单
 */
onMounted(() => {
  watch(
    () => router.currentRoute.value.path,
    (newValue: string) => {
      const menuKey = newValue
        .replace(/^.*\//, '')
        .replace(/^[a-z]/, (s: string) => s.toUpperCase());
      expandeArr.value = [menuKey];
      tree.value.setCurrentKey(menuKey);
    },
    { immediate: true },
  );
});
const currentChange = (data: any) => {
  const filter = [
    'Exception',
    'Form',
    'Board',
    'List',
    'Profile',
    'Result',
    'User',
    'Cloud',
  ];
  if (filter.indexOf(data.id) === -1) {
    router.push({ name: data.id });
  }
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
