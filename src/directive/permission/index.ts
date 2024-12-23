import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { menuPermissions } = userStore;
  const permissionList = menuPermissions;
  //console.log("value", value);
  //console.log("permissionList", permissionList);
  const hasPermission =
    permissionList.filter((item) => { return (item.menuName === value[0] && item.permissionName === value[1]) });
  if (hasPermission.length === 0) {
    el.remove();
  }
}

export default {
  mounted(el: HTMLElement, binding: any) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: any) {
    checkPermission(el, binding);
  },
};
