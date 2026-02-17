import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '@/components/Welcome.vue'
import AuthForm from '@/components/AuthForm.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Welcome,
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthForm,
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

