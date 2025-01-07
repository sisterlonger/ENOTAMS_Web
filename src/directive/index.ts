import { App } from 'vue';
import permission from './permission';
import track from './track';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('track', track);
  },
};
