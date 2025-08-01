import localeLogin from '@/views/login/locale/zh-CN';
import localeTheme from '@/components/theme/locale/zh-CN';
import locale403 from '@/views/other/exception/403/locale/zh-CN';
import locale404 from '@/views/other/exception/404/locale/zh-CN';
import locale500 from '@/views/other/exception/500/locale/zh-CN';
import localeStepForm from '@/views/kanban/usercenter/locale/zh-CN';
import localeSearchTable from '@/views/kanban/list/search-table/locale/zh-CN';
import localekanban from '@/views/kanban/board/locale/zh-CN';
import localeSettings from './zh-CN/settings';
import localeHttpError from './zh-CN/httpError';

export default {
  'menu.board': '个人中心',
  'menu.home': '首页',
  'menu.work': '工作台',
  'menu.list': '列表页',
  'menu.exception': '异常告警',
  'menu.usercenter': '个人信息',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'messageBox.assemble': '原始资料收集',
  'messageBox.track': '原始资料跟踪',
  'messageBox.usercenter': '个人信息',
  'messageBox.userSettings': '用户设置',
  'messageBox.logout': '退出登录',
  'menu.node': '规范配置',
  'menu.keyword': '关键字管理',
  'menu.validation': '校验管理',
  'menu.dictionary': '字典管理',
  'menu.assemble': '原始资料收集',
  'menu.track': '原始资料跟踪',
  'menu.exam': '原始资料会商审核',
  'menu.department': '单位权限配置',
  'menu.log': '系统日志',
  'menu.userlog': '操作日志',
  'menu.workflow': '流程管理',
  'menu.menu': '菜单管理',
  'menu.systemManager': '系统管理',
  'menu.notam': '通告规范配置',
  'menu.permission': '按钮管理',
  'menu.userlist': '用户管理',
  'menu.role': '角色页面管理',
  'menu.feedback': '反馈记录',
  'menu.version': '版本管理',
  'menu.staticdata': '基础信息配置',
  'menu.dynamicdata': '业务数据',
  'menu.source': '基础信息配置',
  'menu.airspace': '飞行情报区',
  'menu.airway': '航路',
  'menu.airline': '航线',
  'menu.airport': '机场',
  'menu.airwaypoint': '航路点',
  'menu.radionavigation': '无线电导航设施',
  'menu.message': '通告审核发布',
  'menu.workPermission': '工作权限管理',
  'menu.publish': '通告发布审批',
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
