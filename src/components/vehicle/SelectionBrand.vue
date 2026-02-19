<script setup lang="ts">
interface Brand {
    marca: string;
    imagen: string;
}

defineProps<{
    modelValue: string;
    brands: Brand[];
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="animate-fade-in">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Selecciona tu marca</p>
        <div class="brand-grid">
            <button
                v-for="item in brands"
                :key="item.marca"
                type="button"
                class="brand-card"
                :class="{ 'brand-card--active': modelValue === item.marca }"
                @click="$emit('update:modelValue', item.marca)"
            >
                <img
                    v-if="item.imagen"
                    :src="item.imagen"
                    :alt="item.marca"
                    class="brand-card__logo"
                />
                <div v-else class="brand-card__placeholder">
                    {{ item.marca.charAt(0) }}
                </div>
                <span class="brand-card__name">{{ item.marca }}</span>
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

/* ── Cuadrícula de marcas ───────────────────────────────── */
.brand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
}

.brand-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 6px;
    border: 2px solid transparent;
    border-radius: 12px;
    background: #f9fafb;
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.15s ease, background 0.18s ease;
}

:global(.dark) .brand-card {
    background: #1f2937;
}

.brand-card:hover {
    border-color: #6366f1;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
    transform: translateY(-2px);
}

.brand-card--active {
    border-color: #6366f1;
    background: #eef2ff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

:global(.dark) .brand-card--active {
    background: #312e81;
}

.brand-card__logo {
    height: 52px;
    width: 100%;
    object-fit: contain;
}

.brand-card__placeholder {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    background: #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: #6b7280;
}

.brand-card__name {
    font-size: 0.7rem;
    font-weight: 600;
    text-align: center;
    color: #374151;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

:global(.dark) .brand-card__name {
    color: #d1d5db;
}
</style>
