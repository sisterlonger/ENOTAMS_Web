export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserInfo {
  userID: string;
  userName: string;
  userCode: string;
  airSpace?: string;
  role: RoleType;
  roleName?: string;
  roleID: number;
  depName?: string;
  fullName?: string;
  field?:string;
  rank?: string;
  menuPermissions: Array<any>;
  mobile?: string;
  email?: string;
  companySMSCode?: string;
  // 暂时没用上的
  department?: string;
  employeeType?: string;
  job?: string;
  probationStart?: string;
  probationEnd?: string;
  probationDuration?: string;
  protocolStart?: string;
  protocolEnd?: string;
  address?: string;
  status?: string;
}
export interface UserFilterData {
  sort?: number;
  startTime?: string;
  endTime?: string;
  filterStatus?: Array<string>;
  filterType?: Array<string>;
  submit?: boolean;
  reset?: boolean;
}
export type UserState = UserInfo & UserFilterData;
