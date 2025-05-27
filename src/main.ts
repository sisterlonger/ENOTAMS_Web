import { createApp } from 'vue';
import * as echarts4 from 'echarts4';
import globalComponents from '@/components';
import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import { setupProdMockServer } from './mockProdServer';
import './mock';
import App from './App.vue';
import '@/api/interceptor';
import '@/assets/style/global.less';
import config from '../hwc-exports.json';
// eslint-disable-next-line import/extensions
import 'echarts4/map/js/china.js';
import chinaMap from './assets/chaina.json';

if(import.meta.env.VITE_USE_MOCK) setupProdMockServer();
echarts4.registerMap('china', chinaMap);
const app = createApp(App);


app.use(router);
app.use(store);
app.use(i18n({ locale: 'zhCN' }));
app.use(globalComponents);
app.use(directive);


// 接受子页面的传值
window.addEventListener('message', (event) => {
  console.log("event",event);
  //if (event.origin !== import.meta.env.VITE_API_WORKFLOW_URL) return;
  if (event.data.type === 'CHILD_ROUTE_CHANGE') {
    // 可选：更新父项目UI或状态
  }
});


app.mount('#app');

