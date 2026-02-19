import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '@/components/AuthForm.vue'
import Home from '../pages/Home.vue'
import Dashboard from '../pages/Dashboard.vue'
import { authGuard } from '@/guards/auth.guard'
import { adminAuth } from '@/guards/admin.guard'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthForm,
        beforeEnter: authGuard,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter: adminAuth,
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

