import { defineStore } from 'pinia';
import { WorkFlowState, WorkFlowUserInfo, WorkFlowDeptTree } from './types';

const useWorkFlowStore = defineStore('workflow', {
  state: (): WorkFlowState => ({
    user: {}, // 用户信息初始值
    dept: {},  // 部门信息初始值
    msgMaxId : 0  // 最大消息ID
  }),

  getters: {
    // 用户信息获取器（网页3推荐模式）
    workflowCurrentUserInfo(state): WorkFlowUserInfo {
      return state.user;
    },
    // 部门信息获取器（网页4类型安全实践）
    workflowCurrentDeptInfo(state): WorkFlowDeptTree {
      return state.dept;
    },
    // 获取最大消息ID
    workflowMsgMaxId(state): number {
      return state.msgMaxId;
    }
  },

  actions: {
    // 用户信息更新（网页2分层更新策略）
    updateUserInfo(partial: Partial<WorkFlowUserInfo>) {
      this.$patch({
        user: { ...this.user, ...partial }
      });
    },
    // 部门信息更新（网页3模块化更新）
    updateDeptInfo(partial: Partial<WorkFlowDeptTree>) {
      this.$patch({
        dept: { ...this.dept, ...partial }
      });
    },
    // 更新最大消息ID
    updateMsgMaxId(partial: number) {
      this.$patch({
        msgMaxId: partial
      });
    }
  },
});

export default useWorkFlowStore;