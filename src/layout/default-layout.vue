<template>
  <div class="layout">
    <tiny-container :aside-width="250" :pattern="myPattern">
      <template #header>
        <tiny-layout>
          <div class="layout-navbar">
            <NavBar />
          </div>
        </tiny-layout>
      </template>
      <template #aside>
        <tiny-layout class="layout-sider">
          <div class="menu-wrapper">
            <Menu />
          </div>
        </tiny-layout>
      </template>
      <tiny-layout class="layout-content">
        <Tabs :key="tabsRefreshKey" v-model="currentTabName" with-close @click="onClick" @close="onClose">
          <tab-item v-for="(history, idx) of tabsHistory" :key="idx" :title="history.name"
            :name="history.link"></tab-item>
        </Tabs>
        <PageLayout />
      </tiny-layout>
      <template #footer>
        <tiny-layout>
          <div class="layout-footer">
            <Footer />
          </div>
        </tiny-layout>
      </template>
    </tiny-container>
    <div class="theme-box" @click="themeVisible">
      <img src="@/assets/images/theme.png" />
    </div>
    <div v-if="disTheme">
      <tiny-modal v-model="disTheme" :lock-scroll="true" show-header show-footer :title="$t('theme.title.main')"
        mask-closable="true" height="922" width="748">
        <template #default>
          <Theme />
        </template>
        <template #footer></template>
      </tiny-modal>
    </div>
    <img v-if="!appStore.navbar" src="@/assets/images/global.png" class="global-setting" @click="switchSet" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import {
  Container as TinyContainer,
  Layout as TinyLayout,
  Modal as tinyModal,
  Tabs,
  TabItem,
  Modal
} from '@opentiny/vue';
import TinyThemeTool from '@opentiny/vue-theme/theme-tool.js';
import { useAppStore, useTabStore, useUserStore, useWorkFlowStore } from '@/store';
// eslint-disable-next-line import/extensions
import Footer from '@/components/footer/index.vue';
import NavBar from '@/components/navbar/index.vue';
import Theme from '@/components/theme/index.vue';
import Menu from '@/components/menu/index.vue';
import { useRouter } from 'vue-router';
import { DefaultTheme } from '@/components/theme/type';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import PageLayout from './page-layout.vue';

// 动态切换
const appStore = useAppStore();
const router = useRouter();
const userStore = useUserStore();
const userWorkFlowStore = useWorkFlowStore();
const changefooter = ref('#fff');

const tabStore = useTabStore();

const tabsHistory = computed(() => { return tabStore.data });
const currentTabName = ref();
// 切换简约模式，图标按钮
const top = ref('10px');

watch(
  () => tabStore.current,
  () => {
    currentTabName.value = tabStore.current?.link;
  },
  { deep: true, immediate: true },
);
const tabsRefreshKey = ref('');
const onClick = (tab: { name: string; link: string }) => {
  const routePaths = router.getRoutes().map((routeItem) => routeItem.path);
  if (!routePaths.includes(tab.name)) {
    Modal.message({
      message: '错误页面',
      status: 'error',
    });
    const curName = tabStore.delByLink(tab.name);
    tabStore.set(curName);
    tabStore.$patch({
      current: tabStore.getByName(curName)[0],
    });
    currentTabName.value = tabStore.current?.link;
    tabsRefreshKey.value = '1';
    nextTick(() => {
      tabsRefreshKey.value = '';
    });
  } else {
    router.replace(tab.name);
  }
};
const onClose = (name: string) => {
  if (tabStore.data.length === 1) {
    return;
  }
  const routerPaths = router.getRoutes().map((r) => r.path);
  const deleteItemIndex = tabStore.data.findIndex(
    (item: any) => item.link === name,
  );
  let rightIdx = deleteItemIndex + 1;
  let leftIdx = deleteItemIndex - 1;
  let path = '';
  const deleteSelf = tabStore.data[deleteItemIndex] === tabStore.current;
  if (!deleteSelf) {
    tabStore.delByLink(name);
    return;
  }
  let curName = '';
  // 向右找到一个最近的路由项
  while (rightIdx < tabStore.data.length && !path) {
    const item = tabStore.data[rightIdx];
    if (routerPaths.includes(item.link)) {
      path = item.link;
      curName = item.name;
      break;
    }
    rightIdx += 1;
  }
  // 向左找到一个最近的路由
  while (leftIdx >= 0 && !path) {
    const item = tabStore.data[leftIdx];
    if (routerPaths.includes(item.link)) {
      path = item.link;
      curName = item.name;
      break;
    }
    leftIdx -= 1;
  }
  // 找不到存在的路由则不删除当前路由也不跳转
  if (leftIdx < 0 && rightIdx >= tabStore.data.length && !path) {
    return;
  }
  tabStore.delByLink(name);
  // 跳转到最近的一个合法路由
  tabStore.set(curName);
  router.push({ path });
};
// 判断是否显示设置图标
const switchSet = () => {
  appStore.updateSettings({ Settings: true });
};

// 是否显示切换框架结构
const myPattern = ref('legend');

// 主题配置
const disTheme = ref(false);
const theme = new TinyThemeTool()
const themeVisible = () => {
  disTheme.value = !disTheme.value;
};

watch(appStore.$state, (newValue, oldValue) => {
  if (!newValue.navbar) {
    myPattern.value = 'simple';
  } else if (!newValue.footer) {
    myPattern.value = 'fashion';
  } else if (!newValue.menu) {
    myPattern.value = 'classic';
  } else {
    myPattern.value = 'legend';
  }
  appStore.footer ? (top.value = '10px') : (top.value = '60px');
});

watch(appStore.$state, (newValue, oldValue) => {
  if (newValue.theme === 'dark') {
    changefooter.value = '#262323;';
  } else {
    changefooter.value = '#fff;';
  }
});
/*
// 登录工作流
const getFlyflowToken = async () => {
  await workflowaxios.post('/login/login', {
    phone: userStore.mobile,
    password: '123456',
    tenantId: "1"
  }).then((res: any) => {
    workflowaxios.defaults.headers.common = {
      'Flyflow-Tenant-Id': '1',
      'AuthUserId': res.data.data.loginId,
      "Authorization": res.data.data.tokenValue,
    }
    console.log("workflowaxios.defaults.headers.common",workflowaxios.defaults.headers.common);
    workflowaxios.get('/user/getCurrentUserDetail', {
    }).then((res1: any) => {
      console.log("rest1", res1);
      console.log('token',res.data.data.tokenValue);
      userWorkFlowStore.updateUserInfo({ loginId: res.data.data.loginId, tokenValue: res.data.data.tokenValue, depidId: res1.data.data.deptIdList[0] });
    })
  })
};*/
// 初始化默认主题
onMounted(async () => {
  appStore.updateSettings({ theme: 'light' });
  theme.changeTheme(DefaultTheme);
  appStore.updateSettings({ themelist: 'default' });
  //await getFlyflowToken();
});
</script>

<style scoped lang="less">
.layout {
  width: 100%;
  height: 100%;
}

.layout-navbar {
  position: fixed;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);
}

.menu-wrapper {
  width: inherit;
  height: 92vh;
  margin-top: v-bind(top);
  overflow-x: hidden;
  overflow-y: auto;
}

.global-setting {
  position: fixed;
  top: 280px;
  right: 0;
  z-index: 99;
  width: 30px;
  height: 30px;
}

.layout :deep(.tiny-container .tiny-container__aside) {
  z-index: 100;
  background: #fff;
  border-left: 1px solid #ccc;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.layout :deep(.tiny-container .tiny-container__main) {
  color: #ccc;
  background-color: #f5f6f7;
}

.layout :deep(.layout-content) {
  height: 100%;
  padding: 0 10px;
  overflow: hidden;
}

.layout :deep(.tiny-container .tiny-container__footer) {
  display: flex;
  justify-content: center;
  padding-top: 15px;
  background-color: #f5f6f7;
}

// 组件无法固定非message的modal类型距离顶部距离
:deep(.tiny-modal__box) {
  top: 8px !important;
}

// 路由子菜单选中后的样式
:deep(.tiny-tree-node__children .tiny-tree-node__content) {
  .tree-node-name {
    margin-left: 28px !important;
    padding-left: 6px !important;
  }
}

:deep(.tiny-tree-node__children > .tree-node-body) {
  padding-left: 50px;
}

:deep(.tiny-container__main > .tiny-layout > .tiny-tabs > .tiny-tabs__content) {
  display: none;
}

:deep(.tiny-tabs--top) {
  padding: 0 16px;
}

.theme-box {
  position: fixed;
  top: 88%;
  right: 30px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #fff;
  border-radius: 100%;
  cursor: pointer;

  img {
    display: block;
    width: inherit;
    height: inherit;
  }
}
</style>
