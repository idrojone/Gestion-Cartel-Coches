<template>
  <div class="max-w-xl mx-auto p-4 bg-white rounded-md shadow-sm">
    <h2 class="text-lg font-semibold mb-4">Formulario guiado de vehículo</h2>

    <!-- Progress -->
    <div class="mb-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <span class="font-medium">Paso {{ step }} / {{ steps.length }}</span>
        <div class="flex-1 h-2 bg-gray-200 rounded overflow-hidden ml-3">
          <div
            class="h-full bg-blue-500 transition-all" :style="{ width: Math.round((step / steps.length) * 100) + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Step content -->
    <div class="space-y-4">
      <div v-if="step === 1">
        <label class="block mb-2 font-medium">Marca comercial</label>
        <select v-model="form.brand" class="w-full border rounded p-2">
          <option value="" disabled>Selecciona una marca</option>
          <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
        </select>
      </div>

      <div v-if="step === 2">
        <label class="block mb-2 font-medium">Año de compra</label>
        <select v-model.number="form.year" class="w-full border rounded p-2">
          <option value="" disabled>Selecciona año</option>
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <div v-if="step === 3">
        <label class="block mb-2 font-medium">Modelo</label>

        <div v-if="modelsForBrand.length">
          <select v-model="form.model" class="w-full border rounded p-2">
            <option value="" disabled>Selecciona modelo</option>
            <option v-for="m in modelsForBrand" :key="m" :value="m">{{ m }}</option>
            <option value="_otro">Otro (especificar)</option>
          </select>

          <div v-if="form.model === '_otro'" class="mt-2">
            <input v-model="form.modelOther" placeholder="Escribe el modelo" class="w-full border rounded p-2" />
          </div>
        </div>

        <div v-else>
          <input v-model="form.modelOther" placeholder="Escribe el modelo" class="w-full border rounded p-2" />
          <p class="text-sm text-gray-500 mt-2">No hay modelos predefinidos para esta marca; escribe el modelo.</p>
        </div>
      </div>

      <div v-if="step === 4">
        <label class="block mb-2 font-medium">Viticamas</label>
        <ViticamasSelector
          v-model="form.viticamas"
          :formData="{ brand: form.brand, year: form.year, model: form.model, modelOther: form.modelOther }"
          :checkUrl="CHECK_URL"
          @check-result="onCheckResult"
        />

        <div v-if="lastCheck" class="mt-3 text-sm">
          <p v-if="lastCheck.affected" class="text-green-600 font-medium">El coche está entre los afectados.</p>
          <p v-else class="text-red-600 font-medium">El coche no está entre los afectados.</p>
          <p v-if="lastCheck.message" class="text-gray-600">{{ lastCheck.message }}</p>
        </div>
      </div>

      <div v-if="step === 5">
        <label class="block mb-2 font-medium">Resumen</label>
        <ul class="list-disc pl-6 text-sm text-gray-700">
          <li><strong>Marca:</strong> {{ form.brand }}</li>
          <li><strong>Año:</strong> {{ form.year }}</li>
          <li><strong>Modelo:</strong> {{ resolvedModel }}</li>
          <li><strong>Viticamas:</strong> {{ form.viticamas ? 'Sí' : 'No' }}</li>
        </ul>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-between">
      <button @click="reset" type="button" class="text-sm text-red-600">Reiniciar</button>

      <div class="space-x-2">
        <button v-if="step > 1" @click="prev" class="px-3 py-1 border rounded">Atrás</button>
        <button v-if="step < steps.length" @click="next" class="px-3 py-1 bg-blue-600 text-white rounded" :disabled="!canProceed">Siguiente</button>
        <button v-else @click="submit" class="px-3 py-1 bg-green-600 text-white rounded">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import ViticamasSelector from './ViticamasSelector.vue'

const emit = defineEmits<{ (e: 'submit', payload: { brand: string; year: number | ''; model: string; viticamas: boolean }): void }>()

const step = ref(1)
const steps = ['Marca', 'Año', 'Modelo', 'Viticamas', 'Resumen']

const brands = ['Toyota', 'Ford', 'Seat', 'Renault', 'BMW']
const modelsMap: Record<string, string[]> = {
  Toyota: ['Corolla', 'Yaris', 'RAV4'],
  Ford: ['Fiesta', 'Focus', 'Kuga'],
  Seat: ['Ibiza', 'Leon', 'Arona'],
  Renault: ['Clio', 'Megane', 'Captur'],
  BMW: ['Serie 1', 'Serie 3', 'X3']
}

const years = Array.from({ length: 2013 - 2006 + 1 }, (_, i) => 2006 + i)

const form = reactive({
  brand: '',
  year: '' as number | '',
  model: '' as string,
  modelOther: '',
  viticamas: false
})

// Configura la URL del endpoint que consulta Google Sheets / Apps Script.
// Reemplaza con la URL de tu web app de Google Apps Script o endpoint que expone la verificación.
const CHECK_URL = '' // ej: 'https://script.google.com/macros/s/XXXXX/exec'

const lastCheck = ref<{ affected: boolean; message?: string } | null>(null)

const modelsForBrand = computed(() => (form.brand ? modelsMap[form.brand] ?? [] : []))
const resolvedModel = computed(() => (form.model === '_otro' ? form.modelOther : form.model || form.modelOther || ''))

const canProceed = computed(() => {
  if (step.value === 1) return !!form.brand
  if (step.value === 2) return !!form.year
  if (step.value === 3) {
    if (modelsForBrand.value.length) {
      return form.model && (form.model !== '_otro' || !!form.modelOther)
    }
    return !!form.modelOther
  }
  return true
})

function next() {
  if (!canProceed.value) return
  if (step.value < steps.length) step.value++
}
function prev() {
  if (step.value > 1) step.value--
}
function reset() {
  form.brand = ''
  form.year = ''
  form.model = ''
  form.modelOther = ''
  form.viticamas = false
  step.value = 1
}

function onCheckResult(payload: { affected: boolean; message?: string }) {
  lastCheck.value = payload
}

function submit() {
  const payload = {
    brand: form.brand,
    year: form.year,
    model: resolvedModel.value,
    viticamas: form.viticamas,
    lastCheck: lastCheck.value
  }
  // Emite evento con los datos para que el padre lo reciba
  emit('submit', payload)
  alert('Formulario enviado: ' + JSON.stringify(payload))
  reset()
}
</script>

<!-- Usamos utilidades Tailwind para estilos; elimina este comentario si Tailwind está configurado -->
