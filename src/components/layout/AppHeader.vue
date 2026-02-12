<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

      <!-- Logo / Brand -->
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5m14 0h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
            <path d="M3 9l2.5-5h13L21 9" />
            <path d="M3 9h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <circle cx="7.5" cy="15.5" r="1.5" />
            <circle cx="16.5" cy="15.5" r="1.5" />
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight text-gray-900">
          Cartel Coches
        </span>
      </div>

      <!-- Autenticación -->
      <div class="flex items-center gap-3">
        <button class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
          Iniciar Sesión
        </button>
        <button class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Registrarse
        </button>
      </div>
    </div>
  </header>
</template>
