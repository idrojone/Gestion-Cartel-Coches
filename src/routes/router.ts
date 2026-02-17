import { createRouter, createWebHistory } from 'vue-router'
import AuthForm from '@/components/AuthForm.vue'
import Home from '../pages/Home.vue'
import { authGuard } from '@/guards/auth.guard'

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
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

