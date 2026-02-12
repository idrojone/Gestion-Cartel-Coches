<script setup lang="ts">
// AppFooter - Template sin funcionalidad
</script>

<template>
  <footer class="mt-auto border-t border-gray-200 bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Columna 1: Marca -->
        <div>
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5m14 0h-2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h2" />
                <path d="M3 9l2.5-5h13L21 9" />
                <path d="M3 9h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <circle cx="7.5" cy="15.5" r="1.5" />
                <circle cx="16.5" cy="15.5" r="1.5" />
              </svg>
            </div>
            <span class="text-base font-bold text-gray-900">Cartel Coches</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-gray-500">
            Sistema de gestión de vehículos, clientes y casos para tu concesionario.
          </p>
        </div>

        <!-- Columna 2: Gestión -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Gestión</h3>
          <ul class="mt-4 space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Vehículos</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Clientes</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Casos</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Marcas</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Modelos</a>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Recursos -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Recursos</h3>
          <ul class="mt-4 space-y-2">
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Documentación</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">API</a>
            </li>
            <li>
              <a href="#" class="text-sm text-gray-500 transition-colors hover:text-blue-600">Soporte</a>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Contacto -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-900">Contacto</h3>
          <ul class="mt-4 space-y-2">
            <li class="flex items-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              info@cartelcoches.com
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +34 900 123 456
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Madrid, España
            </li>
          </ul>
        </div>
      </div>

      <!-- Separador y copyright -->
      <div class="mt-8 border-t border-gray-200 pt-6">
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-gray-400">
            &copy; 2026 Cartel Coches. Todos los derechos reservados.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-sm text-gray-400 transition-colors hover:text-blue-600">Privacidad</a>
            <a href="#" class="text-sm text-gray-400 transition-colors hover:text-blue-600">Términos</a>
            <a href="#" class="text-sm text-gray-400 transition-colors hover:text-blue-600">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
