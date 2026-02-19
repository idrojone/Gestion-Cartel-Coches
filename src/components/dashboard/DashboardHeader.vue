<script setup lang="ts">
defineProps<{
    loading: boolean;
}>();

defineEmits<{
    (e: 'refresh'): void;
}>();
</script>

<template>
    <div class="flex justify-between items-center mb-5">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Reclamaciones</h1>
        <button 
            @click="$emit('refresh')" 
            :disabled="loading" 
            class="bg-blue-500 text-white border-none py-2 px-4 rounded-md cursor-pointer font-medium transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            🔄 Recargar
        </button>
    </div>
</template>

