<!-- 
  @component BaseSelect
  @description Componente reutilizable para selectores (dropdowns) con estilos personalizados y soporte para modo oscuro.
  
  Características:
  - Soporta opciones simples (strings/numbers) u objetos con { value, label }.
  - Estilizado con Tailwind CSS.
  - Accesible (labels, aria-invalid, aria-describedby).
  - Estado de error visual y mensaje de validación.
-->

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

/**
 * Interfaz para definir una opción estructurada.
 * @interface Option
 */
interface Option {
    value: string | number;
    label: string;
}

/**
 * Propiedades del componente.
 * @interface Props
 */
interface Props {
    /** Etiqueta visible del campo */
    label: string;
    
    /** Valor seleccionado (v-model) */
    modelValue: string | number;
    
    /** ID único para accesibilidad (label for, aria-describedby) */
    id: string;
    
    /** 
     * Lista de opciones. 
     * Puede ser un array de primitivos (string/number) o de objetos `Option`.
     */
    options: (string | number | Option)[];
    
    /** Mensaje de error para mostrar estado inválido */
    error?: string;
    
    /** Texto placeholder de la primera opción deshabilitada */
    placeholder?: string;
    
    /** Indica si el campo es obligatorio (añade asterisco y atributo required) */
    required?: boolean;
    
    /** Deshabilita la interacción con el select */
    disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Selecciona una opción',
    required: false,
    disabled: false,
});

/**
 * Eventos emitidos por el componente.
 * @event update:modelValue Emite el nuevo valor seleccionado.
 */
const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
}>();

/**
 * ID computado para el mensaje de error, usado para aria-describedby.
 */
const errorId = computed(() => `${props.id}-error`);

/**
 * Normaliza las opciones de entrada para que siempre sean objetos { value, label }.
 * Permite pasar arrays simples ['Opción 1', 'Opción 2'] facilitando el uso.
 */
const normalizedOptions = computed<Option[]>(() => {
    return props.options.map((opt) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return { value: opt, label: String(opt) };
        }
        return opt;
    });
});

/**
 * Manejador del evento change nativo.
 * Emite el valor actualizado al padre.
 */
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
                <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
            </div>
        </div>

        <p v-if="error" :id="errorId" class="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {{ error }}
        </p>
    </div>
</template>
