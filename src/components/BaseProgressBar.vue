<script setup lang="ts">
interface Props {
    percentage: number;
}

defineProps<Props>();
</script>

<template>
    <div class="mb-8 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
            class="h-full bg-indigo-600 transition-all duration-500 ease-out" 
            :style="{ width: `${percentage}%` }"
        ></div>
    </div>
</template>
