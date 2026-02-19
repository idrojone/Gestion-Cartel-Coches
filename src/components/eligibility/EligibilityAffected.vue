<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
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
        <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
            <CheckCircleIcon class="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        
        <div class="space-y-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">¡Tu vehículo está afectado!</h3>
            <p class="text-gray-600 dark:text-gray-300">
                El <strong>{{ vehicle.marca }} {{ vehicle.modelo }}</strong> del año <strong>{{ vehicle.anio }}</strong> forma parte del cártel de coches.
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Tienes derecho a reclamar una indemnización.
            </p>
        </div>

        <BaseButton @click="$emit('action')" variant="primary">
            {{ actionLabel }}
        </BaseButton>
        <BaseButton @click="$emit('reset')" variant="secondary" class="mt-2">Volver al inicio</BaseButton>
    </div>
</template>
