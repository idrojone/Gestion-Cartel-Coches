<script setup lang="ts">
</script>

<template>
  <section class="relative px-4 py-16 text-center sm:px-6 lg:px-8">
    <div class="relative z-10">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
        </svg>
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
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          Sin coste inicial
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          Proceso 100% online
        </div>
        <div class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          Respuesta en 24h
        </div>
      </div>
    </div>
  </section>
</template>
