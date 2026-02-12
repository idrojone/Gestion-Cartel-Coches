<script setup lang="ts">
import { AppHeader, AppFooter } from './components/layout'
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
    <div class="fixed inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 50px 50px;"></div>
    </div>
    
    <div class="fixed -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl"></div>
    <div class="fixed -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl"></div>
    
    <div class="relative z-10 flex min-h-screen flex-col">
      <AppHeader />

      <main class="flex-1">
        <router-view />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
