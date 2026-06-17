import { DirectiveBinding } from 'vue';
import checkPermission from '@/utils/permission';

function applyPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  if (!checkPermission(value)) {
    el.remove();
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    applyPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    applyPermission(el, binding);
  },
};
