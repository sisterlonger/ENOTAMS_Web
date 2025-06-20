<template>
  <div class="login-form-container">
    <tiny-form ref="loginFormMail" :model="loginMail" class="login-form" :rules="rules" validate-type="text"
      label-width="0" size="medium">
      <tiny-form-item prop="userCode" size="medium">
        <tiny-input v-model="loginMail.userCode" :placeholder="$t('login.form.userCode.placeholder')">
        </tiny-input>
      </tiny-form-item>

      <tiny-form-item prop="userPwd" size="medium">
        <tiny-input v-model="loginMail.userPwd" type="password" show-password
          :placeholder="$t('login.form.userPwd.placeholder')">
        </tiny-input>
      </tiny-form-item>

      <div class="login-form-options">
        <tiny-checkbox style="color:#fff">{{ $t('login.form.rememberPassword') }}</tiny-checkbox>
        <div>
          <tiny-link style="color:#fff" type="primary" class="divide-line">|</tiny-link>
          <tiny-link style="color:#fff" type="primary" @click="typeChange">
            {{ $t('login.form.registration') }}
          </tiny-link>
        </div>
      </div>

      <tiny-form-item size="medium">
        <tiny-button type="primary" class="login-form-btn" :loading="loading" @click="handleSubmit">{{
          $t('login.form.login') }}</tiny-button>
      </tiny-form-item>
    </tiny-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Button as TinyButton,
  Checkbox as TinyCheckbox,
  Link as TinyLink,
  Modal,
  Notify,
} from '@opentiny/vue';
import { useI18n } from 'vue-i18n';
import { useUserStore, useWorkFlowStore } from '@/store';
import useLoading from '@/hooks/loading';
import { sm2, sm3, sm4 } from 'sm-crypto';
import workflowaxios from '@/views/workflow/components/workflow-axios';
import appRoutes from '@/router/routes/index';
import noauthRoutes from '@/router/routes/noauth';
import DefaultLayout from '@/layout/default-layout.vue';
import GeneralLayout from '@/layout/general-layout.vue';


import { RouteRecordRaw } from 'vue-router';


const router = useRouter();
const { t } = useI18n();
const { loading, setLoading } = useLoading();
const userStore = useUserStore();
const userWorkFlowStore = useWorkFlowStore();
const loginFormMail = ref();

const rules = computed(() => {
  return {
    userCode: [
      {
        required: true,
        message: t('login.form.userCode.errMsg'),
        trigger: 'change',
      },
    ],
    userPwd: [
      {
        required: true,
        message: t('login.form.userPwd.errMsg'),
        trigger: 'change',
      },
    ],
  };
});

const loginMail = reactive({
  // TODO 上线要改
  userCode: 'admin',
  userPwd: 'admin',
  rememberPassword: true,
});

// 切换模式
const handle: any = inject('handle');
const typeChange = () => {
  handle(true);
};
// 登录工作流
const getFlyflowToken = async (mobile: string) => {
  await workflowaxios.post('/login/login', {
    phone: mobile,
    password: '123456',
    tenantId: "1"
  }).then((res: any) => {
    workflowaxios.defaults.headers.common = {
      'Flyflow-Tenant-Id': '1',
      'AuthUserId': res.data.data.loginId,
      "Authorization": res.data.data.tokenValue,
    }
    console.log("rest", res);

    /*
    workflowaxios.get('/login/loginByToken', {
      params: {
        token: res.data.data.tokenValue
      }
    }).then((res2: any) => {
      userWorkFlowStore.updateUserInfo({ loginId: res.data.data.loginId, tokenValue: res2.data.data.tokenValue, });
      workflowaxios.get('/user/getCurrentUserDetail', {
      }).then((res1: any) => {
        console.log(res2.data.data.tokenValue);
        userWorkFlowStore.updateUserInfo({ loginId: res.data.data.loginId, tokenValue: res2.data.data.tokenValue, depidId: res1.data.data.deptIdList[0] });
      })
    });*/


    
    
    workflowaxios.get('/user/getCurrentUserDetail', {
    }).then((res1: any) => {
      userWorkFlowStore.updateUserInfo({ loginId: res.data.data.loginId, tokenValue: res.data.data.tokenValue, depidId: res1.data.data.deptIdList[0] });
    })
  })
};

function handleSubmit() {
  loginFormMail.value?.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }

    setLoading(true);

    try {
      await userStore.login({
        userCode: loginMail.userCode,
        userPwd: sm3(loginMail.userPwd),
      });
      Modal.message({
        message: t('login.form.login.success'),
        status: 'success',
      });
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      // 部署时需要解除注释
      //await getFlyflowToken(userStore.userInfo.mobile);
      //console.log(redirect);
      // 获取动态路由
      router.addRoute({
        name: 'root',
        path: import.meta.env.VITE_CONTEXT,
        component: DefaultLayout,
        children: appRoutes,
      });
      
      router.addRoute({
        name: 'noauth',
        path: import.meta.env.VITE_CONTEXT,
        children: noauthRoutes,
      });
      router.push({
        name: (redirect as string) || 'home',
        query: {
          ...othersQuery,
        },
      });
    } catch (err) {
      console.log("err", err);
      Notify({
        type: 'error',
        title: t('login.tip.right'),
        message: t('login.tip.mail'),
        position: 'top-right',
        duration: 2000,
        customClass: 'my-custom-cls',
      });
    } finally {
      setLoading(false);
    }
  });
}
</script>

<style lang="less" scoped>
.login-form-container {
  margin-top: 5%;
}

.login-form {
  margin-left: 6%;

  .tiny-form-item {
    margin-bottom: 20px;
  }

  &-container {
    width: 320px;
  }

  &-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 12px;
  }

  &-btn {
    display: block;
    width: 100%;
    max-width: 100%;
  }
}

.divide-line {
  margin: 0 5px;
}

// responsive
@media (max-width: @screen-ms) {
  .login-form {
    margin-left: 5%;

    &-container {
      width: 240px;
    }
  }
}
</style>
