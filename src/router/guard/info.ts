import { getUserInfo } from '@/api/fetchInterface';
//import { _i18 } from '@/locale';
import { useUserStore } from '@/store';
//import { useLocales } from '@/store/modules/locales';
//import { Role } from '@/store/modules/user/types';
import { isLogin, setToken } from '@/utils/auth';
import NProgress from 'nprogress';
import { getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { LocationQueryRaw, Router } from 'vue-router';

export default function setupInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    if (to.name === 'login') {
      next();
      NProgress.done();
      return;
    }
    const userStore = useUserStore();
    //const localesStore = useLocales();
    /* 修复第一次登录无法正常登录的问题
    const { data } = (await getUserInfo()) ?? { data: null };
    if (!data) {
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      setToken('');
      NProgress.done();
      return;
    }
    userStore.setInfo(data);*/
    next();
    NProgress.done();
  });
}
