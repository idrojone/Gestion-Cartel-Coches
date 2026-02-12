<script setup lang="ts">
import BaseButton from './BaseButton.vue';

interface Props {
    status: 'idle' | 'checking' | 'affected' | 'not_affected';
    vehicle: {
        marca: string;
        modelo: string;
        anio: string;
    };
}

defineProps<Props>();
const emit = defineEmits<{
    (e: 'reset'): void;
}>();
</script>

<template>
    <div class="text-center py-8 animate-fade-in">
        <!-- Checking State -->
        <div v-if="status === 'checking'" class="flex flex-col items-center space-y-4">
            <svg class="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Comprobando si tu vehículo está afectado...</p>
        </div>

        <!-- Affected State -->
        <div v-else-if="status === 'affected'" class="flex flex-col items-center space-y-6">
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <svg class="h-12 w-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
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

            <BaseButton @click="$emit('reset')" variant="primary">Calcular otra vez</BaseButton>
        </div>

        <!-- Not Affected State -->
        <div v-else-if="status === 'not_affected'" class="flex flex-col items-center space-y-6">
            <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg class="h-12 w-12 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            
            <div class="space-y-2">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">No hemos encontrado coincidencia</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    El <strong>{{ vehicle.marca }} {{ vehicle.modelo }}</strong> no parece estar en la lista principal de afectados en este momento.
                </p>
            </div>

            <BaseButton @click="$emit('reset')" variant="secondary">Volver al inicio</BaseButton>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
