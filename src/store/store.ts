import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    state: () => {
        // Recuperar usuario de localStorage al iniciar
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            try {
                return {
                    user: JSON.parse(savedUser),
                    isAuth: true
                }
            } catch (e) {
                localStorage.removeItem('user')
            }
        }
        return {
            user: null,
            isAuth: false,
        }
    },
    getters: {
        getUser: (state) => state.user,
        getIsAuth: (state) => state.isAuth,
    },
    actions: {
        setUser(user: any) {
            this.user = user
            this.isAuth = !!user

            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                localStorage.removeItem('user')
            }
        },
        setIsAuth(isAuth: boolean) {
            this.isAuth = isAuth
        },
    },
})