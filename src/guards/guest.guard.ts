import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { userStore } from '@/store/store'

export const guestGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const store = userStore()

    if (store.getIsAuth) {
        next({ name: 'Home' })
    } else {
        next()
    }
}
