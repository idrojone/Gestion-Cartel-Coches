<script setup lang="ts">
import { AppHeader, AppFooter } from '@/components/layout'
import Welcome from '@/components/Welcome.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <AppHeader />

    <main class="flex-1">
      <Welcome />
    </main>

    <AppFooter />
  </div>
</template>