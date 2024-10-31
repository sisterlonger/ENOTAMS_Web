import { RoleType } from '@/types/roleType';

export default {
  path: 'assemble',
  name: 'Assemble',
  id: 'Assemble',
  label: 'Assemble',
  component: () => import('@/views/assemble/index.vue'),
  meta: {
    locale: 'menu.assemble',
    requiresAuth: true,
    order: 5,
    roles: [RoleType.admin],
  },
};
