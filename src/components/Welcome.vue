<!-- 
  @component Welcome
  @description Sección principal (Hero) de la aplicación que informa sobre las reclamaciones del Cartel de Coches.
  
  Características:
  - Resalta el periodo de afectación (2006-2013).
  - Presenta estadísticas clave (multas, fechas, volumen de afectados).
  - Enumera beneficios del servicio (sin coste inicial, proceso online).
-->

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
</script>

<template>
  <section class="relative px-4 py-16 text-center sm:px-6 lg:px-8">
    <div class="relative z-10">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        <CheckCircleIcon class="h-4 w-4" />
        Reclamación sin coste inicial
      </div>
      
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        ¿Te afecta el
        <span class="relative inline-block">
          <span class="relative z-10 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text">
            Cartel de Coches
          </span>
          <span class="absolute -bottom-2 left-0 h-3 w-full bg-yellow-400/30 blur-sm"></span>
        </span>
        ?
      </h1>
      
      <p class="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
        Si compraste un vehículo entre <strong class="text-white">2006 y 2013</strong>, 
        podrías tener derecho a una compensación. Únete a miles de afectados.
      </p>
      
      <div class="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div class="text-3xl font-bold text-white">171M€</div>
          <div class="text-sm text-blue-100">Multa impuesta</div>
        </div>
        <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div class="text-3xl font-bold text-white">2006-2013</div>
          <div class="text-sm text-blue-100">Período afectado</div>
        </div>
        <div class="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
          <div class="text-3xl font-bold text-white">Miles</div>
          <div class="text-sm text-blue-100">Afectados</div>
        </div>
      </div>
      
      <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          Sin coste inicial
        </div>
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          Proceso 100% online
        </div>
        <div class="flex items-center gap-2">
          <CheckCircleIcon class="h-5 w-5 text-green-400" />
          Respuesta en 24h
        </div>
      </div>
    </div>
  </section>
</template>
