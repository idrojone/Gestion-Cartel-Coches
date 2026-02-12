<script setup lang="ts">
import { AppHeader, AppFooter } from '@/components/layout'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <AppHeader />

    <main class="flex-1">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>