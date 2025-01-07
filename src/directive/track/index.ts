// src/directives/trackClick.ts
import { Directive, DirectiveBinding } from 'vue';
import { trackEvent } from '@/utils/track'; // 引入埋点函数

const trackClickDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const Module = binding.value || '空事件';
    const Message = binding.arg ? JSON.parse(binding.arg) : {};
    el.addEventListener('click', () => {
      trackEvent(Module, { ...Message, target: el.textContent });
    });
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('click', () => {});
  },
};

export default trackClickDirective;