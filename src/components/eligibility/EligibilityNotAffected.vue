<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/20/solid'
import BaseButton from '../BaseButton.vue'

defineProps<{
    vehicle: {
        marca: string;
        modelo: string;
        anio: string;
        matricula: string;
    };
    actionLabel: string;
}>();

defineEmits<{
    (e: 'action'): void;
    (e: 'reset'): void;
}>();
</script>

<template>
    <div class="flex flex-col items-center space-y-6">
        <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <XCircleIcon class="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        
        <div class="space-y-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">No hemos encontrado coincidencia</h3>
            <p class="text-gray-600 dark:text-gray-300">
                El <strong>{{ vehicle.marca }} {{ vehicle.modelo }}</strong> no parece estar en la lista principal de afectados en este momento.
            </p>
        </div>

        <BaseButton @click="$emit('action')" variant="primary">
            {{ actionLabel }}
        </BaseButton>
        <BaseButton @click="$emit('reset')" variant="secondary" class="mt-2">Volver al inicio</BaseButton>
    </div>
</template>
