<script setup lang="ts">
import BaseSelect from '../BaseSelect.vue';

defineProps<{
    modelValue: string | number;
    options: number[];
    marca: string;
    modelo: string;
    marcaImagen: string | null;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();
</script>

<template>
    <div class="space-y-4 animate-fade-in">
        <div class="flex items-center gap-3 mb-2">
            <img v-if="marcaImagen" :src="marcaImagen" :alt="marca" class="brand-logo-sm" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
                Vehículo: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ marca }} {{ modelo }}</span>
            </span>
        </div>
        <BaseSelect
            id="anio"
            label="Año de Matriculación"
            :modelValue="modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
            :options="options"
            placeholder="Selecciona el año"
            required
        />
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

.brand-logo-sm {
    height: 36px;
    max-width: 80px;
    object-fit: contain;
    border-radius: 6px;
    padding: 3px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}
</style>
