<script setup lang="ts">
import { AppHeader, AppFooter } from './components/layout'
</script>

<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-900 text-gray-100">
    <div class="fixed inset-0 opacity-20">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 30px 30px;"></div>
    </div>
    
    <!-- Blue accents/glows -->
    <div class="fixed -left-20 -top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]"></div>
    <div class="fixed -bottom-40 -right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]"></div>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
    
    <div class="relative z-10 flex min-h-screen flex-col">
      <AppHeader />

      <main class="flex-1">
        <router-view />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
