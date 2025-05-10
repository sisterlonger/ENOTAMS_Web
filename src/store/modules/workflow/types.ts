export interface WorkFlowUserInfo {
    loginId?: number;
    tokenValue?: string;
    depidId?: number;
}
export interface WorkFlowDeptTree {
    depid?: number;
}
export interface WorkFlowState {
    user: WorkFlowUserInfo;
    dept: WorkFlowDeptTree;
  }