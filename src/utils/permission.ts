// utils/permission.ts
import { useUserStore } from '@/store';

export default function checkPermission(requiredPermission: [string, string]) {
    const userStore = useUserStore();
    return userStore.menuPermissions.some(item =>
        item.menuName === requiredPermission[0] &&
        item.permissionName === requiredPermission[1]
    );
}