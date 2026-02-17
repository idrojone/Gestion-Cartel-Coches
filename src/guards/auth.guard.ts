import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { userStore } from '@/store/store'

export const authGuard = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const store = userStore()

    // Si el usuario está autenticado, no puede acceder a /auth
    if (store.isAuth) {
        next({ name: 'Home' })
    } else {
        next()
    }
}
