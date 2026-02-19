<script setup lang="ts">
defineProps<{
    modelValue: string;
    options: string[];
    marca: string;
    marcaImagen: string | null;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="space-y-4 animate-fade-in">
        <div class="flex items-center gap-3 mb-2">
            <img v-if="marcaImagen" :src="marcaImagen" :alt="marca" class="brand-logo-sm" />
            <span class="text-sm text-gray-500 dark:text-gray-400">
                Marca seleccionada: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ marca }}</span>
            </span>
        </div>
        
        <div class="model-grid">
            <button
                v-for="option in options"
                :key="option"
                type="button"
                class="model-card"
                :class="{ 'model-card--active': modelValue === option }"
                @click="$emit('update:modelValue', option)"
            >
                <span class="model-card__name">{{ option }}</span>
            </button>
        </div>
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

/* ── Cuadrícula de modelos ───────────────────────────────── */
.model-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
}

.model-card {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 12px;
    border: 2px solid transparent;
    border-radius: 12px;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 60px;
}

:global(.dark) .model-card {
    background: #1f2937;
}

.model-card:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
    transform: translateY(-2px);
}

.model-card--active {
    border-color: #6366f1;
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

:global(.dark) .model-card--active {
    background: #312e81;
}

.model-card__name {
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    color: #374151;
    line-height: 1.3;
}

:global(.dark) .model-card__name {
    color: #d1d5db;
}
</style>
