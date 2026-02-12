<script setup lang="ts">
import { computed } from 'vue';

interface Option {
    value: string | number;
    label: string;
}

interface Props {
    label: string;
    modelValue: string | number;
    id: string;
    options: (string | number | Option)[];
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Selecciona una opción',
    required: false,
    disabled: false,
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

const errorId = computed(() => `${props.id}-error`);

const normalizedOptions = computed<Option[]>(() => {
    return props.options.map((opt) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: opt, label: String(opt) };
        }
        return opt;
    });
});

const updateValue = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
    <div class="flex flex-col gap-1.5">
        <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            {{ label }}
            <span v-if="required" aria-hidden="true" class="text-red-500 ml-0.5">*</span>
        </label>

        <div class="relative">
            <select
                :id="id"
                :value="modelValue"
                :disabled="disabled"
                :required="required"
                :aria-invalid="!!error"
                :aria-describedby="error ? errorId : undefined"
                class="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20 appearance-none"
                :class="{
                    'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-700 dark:text-red-300 dark:focus:border-red-500': !!error,
                    'text-gray-500 dark:text-gray-500': !modelValue
                }"
                v-bind="$attrs"
                @change="updateValue"
            >
                <option value="" disabled selected>{{ placeholder }}</option>
                <option v-for="option in normalizedOptions" :key="String(option.value)" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
            
            <!-- Chevron Icon -->
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>

        <p v-if="error" :id="errorId" class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {{ error }}
        </p>
    </div>
</template>
