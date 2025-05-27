import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Modal } from '@opentiny/vue';
import { useUserStore, useWorkFlowStore } from '@/store';
import workflowaxios from '@/views/workflow/components/workflow-axios';

export default function useUser() {
  const { t } = useI18n();
  const router = useRouter();
  const userStore = useUserStore();
  const userWorkFlowStore = useWorkFlowStore();
  // 退出工作流
  const logoutFlyflow = async () => {
    await workflowaxios.post('/login/logout', {}).then((res: any) => {
      console.log(res);
    })
  };
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    await logoutFlyflow();
    const currentRoute = router.currentRoute.value;
    Modal.message({
      message: t('setting.loginout'),
      status: 'success',
    });
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      query: {
        ...router.currentRoute.value.query,
        redirect: currentRoute.name as string,
      },
    });
  };
  return {
    logout,
  };
}
