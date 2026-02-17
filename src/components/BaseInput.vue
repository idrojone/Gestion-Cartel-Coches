<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    label: string;
    modelValue: string | number;
    id: string;
    error?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    placeholder?: string;
    required?: boolean;
}

const props =  withDefaults(defineProps<Props>(), {
    type: 'text',
    placeholder: '',
    required: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>()

const errorId = computed(() => `${props.id}-error`);

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ label }}
        <span v-if="required" aria-hidden="true" class="text-red-500 ml-0.5">*</span>
        </label>

        <input
            :id="id"
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required"
            :aria-invalid="!!error"
            :aria-describedby="error ? errorId : undefined"
            class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
            :class="{ 
                'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:text-red-300 dark:focus:border-red-500': !!error 
            }"
            v-bind="$attrs"
            @input="updateValue"
        />

        <p v-if="error" :id="errorId" class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {{ error }}
        </p>
    </div>
</template>