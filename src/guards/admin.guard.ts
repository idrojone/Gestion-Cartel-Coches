import { userStore } from '@/store/store'
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export const adminAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const user = userStore();
    if (user.user?.Nombre === 'admin') {
        next();
    } else {
        next({ name: 'Auth' });
    }
}