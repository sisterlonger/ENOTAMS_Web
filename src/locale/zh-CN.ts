import localeLogin from '@/views/login/locale/zh-CN';
import localeTheme from '@/components/theme/locale/zh-CN';
import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';
import localeStepForm from '@/views/usercenter/locale/zh-CN';
import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
import localekanban from '@/views/board/locale/zh-CN';
import localeSettings from './zh-CN/settings';
import localeHttpError from './zh-CN/httpError';

export default {
  'menu.board': '看板',
  'menu.home': '监控页',
  'menu.work': '工作台',
  'menu.list': '列表页',
  'menu.exception': '异常告警',
  'menu.usercenter': '个人中心',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'messageBox.assemble': '组装报文',
  'messageBox.usercenter': '用户中心',
  'messageBox.userSettings': '用户设置',
  'messageBox.logout': '退出登录',
  'menu.node': '节点管理',
  'menu.keyword': '关键字',
  'menu.validation': '校验管理',
  'menu.dictionary': '字典管理',
  'menu.assemble': '组装报文',
  'menu.department':'组织架构',
  'menu.log':'日志查询',
  'menu.userlist':'用户管理',
  ...localeSearchTable,
  ...localekanban,
  ...localeTheme,
  ...localeSettings,
  ...localeLogin,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeHttpError,
  ...localeStepForm,
};