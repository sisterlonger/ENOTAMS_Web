import { RoleType } from '@/types/roleType';

export default {
  path: 'assemble',
  name: 'assemble',
  id: 'assemble',
  label: 'assemble',
  component: () => import('@/views/assemble/index.vue'),
  meta: {
    // TODO 页签名
    locale: '报文组装',
    requiresAuth: true,
    order: 5,
    roles: [RoleType.admin],
  },
};
