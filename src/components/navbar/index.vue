<template>
  <div class="navbar">
    <div class="left-side">
      <div style="display: flex; align-items: center">
        <img src="@/assets/images/opentiny-logo.png" alt="logo" @click="jumpUrl" />
        <h5 @click="jumpUrl">ENOTAMS:V1</h5>
        <div class="divider"></div>
        <!-- <img class="vue-icon" alt="logo" src="@/assets/images/pro.png" />
        <h4>TinyPro of Vue</h4> -->
      </div>
    </div>
    <ul class="right-side">
      <li v-if="false">
        <input id="navbar-search" class="input-icon" :placeholder="$t('setting.input.search')" />
      </li>
      <li>
        <div class="divider"></div>
      </li>
      <li v-if="false" @click="changeLan">
        <span v-if="i18.locale.value === 'zhCN'">中文</span>
        <span v-else>English</span>
        <img src="@/assets/images/lan.png" alt="lan" class="navbar-lan" />
        <div v-if="lan" class="trigger-lan">
      <li v-for="(item, index) in locales" :key="index" :value="item.value" @click="changeLocale(locales[index].value)">
        {{ item.label }}</li>
  </div>
  </li>

  <li>
    <span @click="help">{{ $t('settings.navbar.help') }}</span>
  </li>
  <li>
    <span @click="setVisible">{{ $t('settings.title') }}</span>
  </li>
  <li class="navbar-user">
    <tiny-button type="info"> 快捷菜单</tiny-button>
    <div class="trigger-user">
  <li v-for="(item, index) in userlist" :key="index" :value="item.label" @click="switchUser(item.value)">
    <iconPublicHome v-if="item.value === 1"></iconPublicHome>
    <iconAssociation v-if="item.value === 2"></iconAssociation>
    <iconUser v-if="item.value === 3"></iconUser>
    <iconEditorRedo v-if="item.value === 4"></iconEditorRedo>
    {{ $t(item.label) }}
  </li>
  </div>
  </li>
  <li><tiny-user-contact v-if="false" :data="data" :show-number="false"></tiny-user-contact></li>
  </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  UserHead as TinyUserHead,
  Modal,
  TinyUserContact,
  Button as TinyButton,
} from '@opentiny/vue';
import {
  IconAssociation,
  IconUser,
  IconEditorRedo,
  IconPublicHome,
} from '@opentiny/vue-icon';
import { useAppStore, useUserStore } from '@/store';
import router from '@/router';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import useUser from '@/hooks/user';

const i18 = useI18n();
const iconAssociation = IconAssociation();
const iconUser = IconUser();
const iconEditorRedo = IconEditorRedo();
const iconPublicHome = IconPublicHome();
const lan = ref(false);

const appStore = useAppStore();
const userStore = useUserStore();
const { logout } = useUser();
const { changeLocale } = useLocale();
const locales = [...LOCALE_OPTIONS];

const data = reactive({
  // TODO 图片
  imgUrl: new URL('@/assets/images/user-head.png', import.meta.url).href,
  userName: '',
  values: [
  ],
});

// 切换语言
const changeLan = () => {
  lan.value = !lan.value;
};
// 帮助中心
const help = () => {
  window.location.href = `${window.location.protocol}//${window.location.host}/vue-pro/docs/start`;
};

// 设置页面显示
const setVisible = () => {
  appStore.updateSettings({ Settings: true });
};

// 用户设置
const userlist = [
  { label: 'menu.home', value: 1 },
  { label: 'messageBox.assemble', value: 2 },
  { label: 'menu.usercenter', value: 3 },
  { label: 'messageBox.logout', value: 4 },
];

const switchUser = (e: number) => {
  switch (e) {
    case 1:
      router.push({ name: 'home' });
      break;
    case 2:
      router.push({ name: 'assemble' });
      break;
    case 3:
      router.push({ name: 'usercenter' });

      break;
    case 4:
      logout();
      break;
    default:
    // eslint-disable-next-line no-console
  }
};
onMounted(() => {
  data.userName = userStore.userInfo.userName;
  data.values.push({ text: '部门', value: userStore.userInfo.fullName || '' }, { text: '电话', value: userStore.userInfo.mobile || '' }, { text: '邮箱', value: userStore.userInfo.email || '' },)
});

// 点击图标跳转首页
const jumpUrl = () => {
  router.push({ name: 'home' });
  // 这是回登录页
  // window.location.href = `${window.location.protocol}//${window.location.host}`;
};
</script>

<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: #fff;
  border-bottom: 1px solid var(--color-border);
}

#navbar-search {
  width: 159px;
  height: 30px;
  padding: 14px;
  background-color: #eff1f7;
  background-position: 130px 8px;
  border: none;
  border-radius: 16px;
  outline: none;
}

.input-icon {
  background: url('@/assets/images/search.png') no-repeat scroll right center transparent;
}

.divider {
  width: 1px;
  height: 18px;
  margin: 0 2px;
  margin-top: 1px;
  background: #dfe1e6;
}

.left-side {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding-left: 10px;
  cursor: pointer;

  .vue-icon {
    width: 24px;
    height: 24px;
    margin-left: 30px;
  }

  h5 {
    margin: 0 30px 0 12px;
    color: var(--ti-base-common-title-color);
    font-weight: 700;
    font-size: 22px;
    line-height: 32px;
    letter-spacing: 0.55px;
  }

  h4 {
    width: 135px;
    height: 22px;
    margin-left: 10px;
    color: var(--ti-base-common-title-color);
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    text-align: left;
  }
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 15px;

    .item {
      display: inline-block;
      margin: 4px;
    }

    span {
      cursor: pointer;
    }

    span:hover {
      color: #2f5bea;
    }

    .navbar-lan {
      padding: 2px 0 0 2px;
    }
  }

  .user-image {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-weight: 600;
    font-size: 2em;
    font-style: oblique;
    cursor: pointer;
    fill: var(--ti-common-color-line-active);
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .trigger-lan {
    position: absolute;
    bottom: -44px;
    width: 100px;
    margin-left: -35px;
  }

  .navbar-user:hover>.trigger-user {
    display: inline-block;
  }

  .trigger-user {
    position: absolute;
    bottom: -102px;
    display: none;
    width: 100px;
    //margin-left: -43px;
  }

  .trigger-user:hover {
    display: inline-block;
  }

  .trigger-user {
    li {
      display: flex;
      justify-content: space-around;
      padding: 6px;
      font-size: 12px;
      text-align: center;
      list-style-type: none;
      background-color: #fff;
      box-shadow: 0 0 2px 2px var(--ti-common-color-bg-normal);
      cursor: pointer;
    }

    li:hover {
      color: #2f5bea;
      background-color: #f5f6f7;
    }
  }

  .trigger-lan {
    li {
      display: block;
      padding: 6px;
      font-size: 12px;
      text-align: center;
      list-style-type: none;
      background-color: #fff;
      box-shadow: 0 0 2px 2px var(--ti-common-color-bg-normal);
      cursor: pointer;
    }

    li:hover {
      color: #2f5bea;
      background-color: #f5f6f7;
    }
  }
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-ms) {
  .left-side {
    img {
      width: 38px;
    }
  }

  .right-side {
    display: none;
  }
}

@media (max-width: @screen-mm) {
  .left-side {
    img {
      width: 38px;
    }
  }

  .right-side {
    display: none;
  }
}
</style>
