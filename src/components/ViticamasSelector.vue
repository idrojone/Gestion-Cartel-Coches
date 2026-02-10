<template>
  <div class="flex items-center gap-3">
    <label class="inline-flex items-center cursor-pointer rounded-full">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', $event.target.checked)"
        class="sr-only"
        aria-label="¿Está entre las viticamas?"
      />

      <span
        class="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-200"
        :class="{ 'bg-blue-500': modelValue }"
      >
        <span
          class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200"
          :class="{ 'translate-x-6': modelValue, 'translate-x-0': !modelValue }"
        ></span>
      </span>

      <span class="ml-3 select-none" v-if="label">{{ label }}</span>
    </label>

    <div>
      <button
        type="button"
        class="px-3 py-1 bg-blue-600 text-white rounded text-sm"
        :disabled="loading || !canCheck"
        @click="check"
      >
        <span v-if="loading">Comprobando…</span>
        <span v-else>Comprobar</span>
      </button>
    </div>

    <div v-if="result" class="ml-3 text-sm">
      <span v-if="result.affected" class="text-green-600 font-medium">Afectado</span>
      <span v-else class="text-red-600 font-medium">No afectado</span>
      <div v-if="result.message" class="text-gray-600">{{ result.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '¿Entre las viticamas?' },
  // Datos del formulario que necesitaremos enviar al backend
  formData: { type: Object as () => { brand?: string; year?: number | ''; model?: string }, default: () => ({}) },
  // URL pública del endpoint que hace la comprobación contra Google Sheets (Apps Script)
  checkUrl: { type: String, default: '' }
})

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }; (e: 'check-result', payload: { affected: boolean; message?: string }): void }>()

const loading = ref(false)
const result = ref<{ affected: boolean; message?: string } | null>(null)

const canCheck = computed(() => !!props.checkUrl && !!(props.formData?.brand && props.formData?.year && (props.formData?.model || props.formData?.modelOther)))

/**
 * Hace POST a `checkUrl` con payload { brand, year, model }.
 * Espera respuesta JSON: { affected: boolean, message?: string }
 */
async function check() {
  if (!props.checkUrl) {
    result.value = { affected: false, message: 'No hay URL de verificación configurada.' }
    emit('check-result', result.value)
    return
  }

  loading.value = true
  result.value = null

  try {
    const payload = {
      brand: props.formData?.brand || '',
      year: props.formData?.year || '',
      model: props.formData?.model || props.formData?.modelOther || ''
    }

    const res = await fetch(props.checkUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    // Esperamos { affected: boolean, message?: string }
    const affected = !!data.affected
    const message = data.message || data.reason || ''

    result.value = { affected, message }

    // sincroniza el toggle con el resultado
    emit('update:modelValue', affected)
    emit('check-result', result.value)
  } catch (err: any) {
    result.value = { affected: false, message: err?.message || 'Error desconocido' }
    emit('check-result', result.value)
  } finally {
    loading.value = false
  }
}
</script>

