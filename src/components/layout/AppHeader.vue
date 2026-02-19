<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { userStore } from '@/store/store'
import { clientesService } from '@/services/clientes.service'

const store = userStore()
const router = useRouter()

const isAuth = computed(() => store.getIsAuth)
const userName = computed(() => {
  const user = store.getUser as { Nombre?: string } | null
  return user?.Nombre ?? ''
})

const isAdmin = computed(() => {
  const user = store.getUser as { Nombre?: string } | null
  return user?.Nombre === 'admin'
})

const handleLogout = () => {
  clientesService.logout()
  router.push('/auth')
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

      <!-- Logo / Brand -->
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5m14 0h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
            <path d="M3 9l2.5-5h13L21 9" />
            <path d="M3 9h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <circle cx="7.5" cy="15.5" r="1.5" />
            <circle cx="16.5" cy="15.5" r="1.5" />
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          F*** Cartel Coches
        </span>
      </RouterLink>

      <!-- Usuario autenticado -->
      <div v-if="isAuth" class="flex items-center gap-3">
        <div class="flex items-center gap-2">
          <RouterLink 
            v-if="isAdmin"
            to="/dashboard" 
            class="mr-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/cases" 
            class="mr-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            Ver mis casos
          </RouterLink>
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {{ userName.charAt(0).toUpperCase() }}
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ userName }}</span>
        </div>
        <button
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="handleLogout"
        >
          Salir
        </button>
      </div>

      <!-- No autenticado -->
      <div v-else class="flex items-center gap-3">
        <RouterLink
          to="/auth"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Autenticarse
        </RouterLink>
      </div>
    </div>
  </header>
</template>

