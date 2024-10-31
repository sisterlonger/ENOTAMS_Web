import localeLogin from '@/views/login/locale/en-US';
import localeTheme from '@/components/theme/locale/en-US';
import locale403 from '@/views/exception/403/locale/en-US';
import locale404 from '@/views/exception/404/locale/en-US';
import locale500 from '@/views/exception/500/locale/en-US';
import localeStepForm from '@/views/usercenter/locale/en-US';
import localekanban from '@/views/board/locale/en-US';
import localeSearchTable from '@/views/list/search-table/locale/en-US';
import localeSettings from './en-US/settings';
import localeHttpError from './en-US/httpError';

export default {
  'menu.board': 'Dashboard Page',
  'menu.home': 'Monitoring page',
  'menu.work': 'workbench',
  'menu.list': 'List',
  'menu.exception': 'Exception',
  'menu.profile': 'Profile',
  'menu.profile.detail': 'Basic details page',
  'menu.visualization': 'Data Visualization',
  'menu.usercenter': 'User Center',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  'messageBox.assemble': 'Assemble',
  'messageBox.usercenter': 'User Center',
  'messageBox.userSettings': 'User Settings',
  'messageBox.logout': 'Logout',
  'menu.node': 'Node Management',
  'menu.keyword': 'KeyWord Management',
  'menu.validation': 'Validation Management',
  'menu.dictionary': 'Dictionary Management',
  'menu.assemble': 'Assemble',
  'menu.department': 'Department Management',
  'menu.log': 'Log Management',
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
