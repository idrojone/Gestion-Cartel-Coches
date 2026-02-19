<!-- 
  @component VehiculoForm
  @description Componente principal del formulario para comprobar la elegibilidad de un vehículo en la reclamación del Cártel de Coches.
  
  Flujo de usuario:
  1. Paso 1: Selección de Marca.
  2. Paso 2: Selección de Modelo (filtrado por marca).
  3. Paso 3: Selección de Año de matriculación (2006-2013).
  4. Resultado: Muestra si el vehículo es elegible o no.

  Características:
  - Carga datos dinámicamente desde Google Sheets (API).
  - Gestión de estado por pasos (Wizard).
  - Validación de campos obligatorios.
  - Feedback visual de carga y errores.
  - Animaciones de transición entre pasos.
-->

<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/20/solid'
import { ref, computed, onMounted } from 'vue';
import { cochesService, type Coche } from '@/services';
import BaseButton from './BaseButton.vue';
import BaseProgressBar from './BaseProgressBar.vue';
import EligibilityResult from './EligibilityResult.vue';
import SelectionBrand from './vehicle/SelectionBrand.vue';
import SelectionModel from './vehicle/SelectionModel.vue';
import SelectionYear from './vehicle/SelectionYear.vue';
import SelectionRegistration from './vehicle/SelectionRegistration.vue';

// ... (types and state logic remains the same, except imports and template)

/**
 * Interfaz para las selecciones del usuario en el formulario.
 * @interface Selections
 */
interface Selections {
    marca: string;
    modelo: string;
    anio: string;
    matricula: string;
}

// --- Estado del Componente ---

/** Paso actual del formulario (1, 2 o 3) */
const step = ref(1);

/** Indica si se están cargando los datos iniciales */
const loading = ref(false);

/** Almacena mensajes de error (ej. fallo de red) */
const error = ref<string | null>(null);

/** Datos crudos de coches cargados desde la API */
const rawData = ref<Coche[]>([]);

/** Selección actual del usuario */
const selections = ref<Selections>({
    marca: '',
    modelo: '',
    anio: '',
    matricula: '',
});

/** 
 * Estado de la comprobación de elegibilidad.
 */
const checkStatus = ref<'idle' | 'checking' | 'affected' | 'not_affected'>('idle');

// --- Propiedades Computadas ---

const marcasConImagen = computed(() => {
    return rawData.value
        .filter((row) => row.marca)
        .map((row) => ({
            marca: String(row.marca),
            imagen: row.imagen ? String(row.imagen) : '',
        }))
        .sort((a, b) => a.marca.localeCompare(b.marca));
});

const modelosOptions = computed(() => {
    if (!selections.value.marca) return [];

    const selectedRow = rawData.value.find((row) => row.marca === selections.value.marca);
    if (!selectedRow) return [];

    const models: string[] = [];
    Object.keys(selectedRow).forEach((key) => {
        if (key.startsWith('modelos/') && selectedRow[key]) {
            models.push(String(selectedRow[key]));
        }
    });

    return models.sort();
});

const aniosOptions = computed(() => {
    const years: number[] = [];
    for (let y = 2013; y >= 2006; y--) {
        years.push(y);
    }
    return years;
});

const progressPercentage = computed(() => {
    return (step.value / 4) * 100;
});

const marcaImagen = computed(() => {
    if (!selections.value.marca) return null;
    const row = rawData.value.find((r) => r.marca === selections.value.marca);
    return row?.imagen ? String(row.imagen) : null;
});

// --- Métodos ---

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await cochesService.getAll();
        if (response.data) {
            rawData.value = response.data;
        } else {
            error.value = 'No se pudieron cargar los datos.';
        }
    } catch (e) {
        error.value = 'Error de conexión al cargar los datos.';
        console.error(e);
    } finally {
        loading.value = false;
    }
};

const nextStep = () => {
    if (step.value < 4) step.value++;
};

const prevStep = () => {
    if (step.value > 1) step.value--;
};

const handleSubmit = () => {
    checkStatus.value = 'checking';

    setTimeout(() => {
        if (selections.value.marca && selections.value.modelo && selections.value.modelo.toUpperCase() !== 'OTRO') {
            checkStatus.value = 'affected';
        } else {
             checkStatus.value = 'not_affected';
        }
    }, 1500);
};

const resetCheck = () => {
    checkStatus.value = 'idle';
    step.value = 1;
    selections.value = { marca: '', modelo: '', anio: '', matricula: '' };
};

onMounted(() => {
    fetchData();
});

</script>

<template>
    <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Selecciona tu Vehículo</h2>

        <BaseProgressBar :percentage="progressPercentage" />

        <div v-if="loading" class="flex justify-center p-8">
             <ArrowPathIcon class="animate-spin h-8 w-8 text-indigo-600" />
        </div>

        <div v-else-if="error" class="text-center p-8">
            <p class="text-red-500 mb-4">{{ error }}</p>
            <BaseButton @click="fetchData" variant="outline">Reintentar</BaseButton>
        </div>

        <div v-else-if="checkStatus !== 'idle'">
             <EligibilityResult 
                :status="checkStatus"
                :vehicle="selections"
                @reset="resetCheck"
            />
        </div>

        <div v-else class="space-y-6">
            
            <SelectionBrand
                v-if="step === 1"
                v-model="selections.marca"
                :brands="marcasConImagen"
            />

            <SelectionModel
                v-if="step === 2"
                v-model="selections.modelo"
                :options="modelosOptions"
                :marca="selections.marca"
                :marcaImagen="marcaImagen"
            />

            <SelectionYear
                v-if="step === 3"
                v-model="selections.anio"
                :options="aniosOptions"
                :marca="selections.marca"
                :modelo="selections.modelo"
                :marcaImagen="marcaImagen"
            />

            <SelectionRegistration
                v-if="step === 4"
                v-model="selections.matricula"
                :marca="selections.marca"
                :modelo="selections.modelo"
                :anio="selections.anio"
                :marcaImagen="marcaImagen"
            />

            <div class="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-8">
                <BaseButton 
                    v-if="step > 1" 
                    @click="prevStep" 
                    variant="secondary"
                >
                    Atrás
                </BaseButton>
                <div v-else></div>

                <BaseButton 
                    v-if="step < 4" 
                    @click="nextStep" 
                    :disabled="step === 1 ? !selections.marca : step === 2 ? !selections.modelo : !selections.anio"
                >
                    Siguiente
                </BaseButton>

                <BaseButton 
                    v-if="step === 4" 
                    @click="handleSubmit" 
                    :disabled="!selections.matricula"
                    variant="primary"
                >
                    Finalizar
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Las animaciones y estilos específicos ahora están en los subcomponentes */
</style>