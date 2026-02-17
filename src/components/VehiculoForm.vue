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
import BaseSelect from './BaseSelect.vue';
import BaseButton from './BaseButton.vue';
import BaseProgressBar from './BaseProgressBar.vue';
import EligibilityResult from './EligibilityResult.vue';



/**
 * Interfaz para las selecciones del usuario en el formulario.
 * @interface Selections
 */
interface Selections {
    marca: string;
    modelo: string;
    anio: string;
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
});

/** 
 * Estado de la comprobación de elegibilidad.
 * - 'idle': Estado inicial, formulario activo.
 * - 'checking': Simulando comprobación (loading).
 * - 'affected': El vehículo es elegible.
 * - 'not_affected': El vehículo no es elegible.
 */
const checkStatus = ref<'idle' | 'checking' | 'affected' | 'not_affected'>('idle');

// --- Propiedades Computadas ---

/**
 * Obtiene la lista única de marcas disponibles, ordenadas alfabéticamente.
 */
const marcasOptions = computed(() => {
    return rawData.value
        .map((row) => row.marca)
        .filter((marca) => marca)
        .sort();
});

/**
 * Obtiene los modelos correspondientes a la marca seleccionada.
 * Busca la fila de la marca y extrae las claves que empiezan por 'modelos/'.
 */
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

/**
 * Genera el rango de años afectados (2006-2013) en orden descendente.
 */
const aniosOptions = computed(() => {
    const years: number[] = [];
    for (let y = 2013; y >= 2006; y--) {
        years.push(y);
    }
    return years;
});

const progressPercentage = computed(() => {
    return (step.value / 3) * 100;
});

// --- Métodos ---

/**
 * Carga los datos de coches desde el servicio API al montar el componente.
 */
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
    if (step.value < 3) step.value++;
};

const prevStep = () => {
    if (step.value > 1) step.value--;
};

/**
 * Maneja el envío final del formulario.
 * Simula una comprobación asíncrona y determina el estado final.
 * Lógica actual: Si el modelo NO es 'OTRO', se considera afectado.
 */
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

/**
 * Reinicia el formulario a su estado inicial para realizar una nueva comprobación.
 */
const resetCheck = () => {
    checkStatus.value = 'idle';
    step.value = 1;
    selections.value = { marca: '', modelo: '', anio: '' };
};

onMounted(() => {
    fetchData();
});

</script>

<template>
    <div class="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
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
            
            <div v-if="step === 1" class="space-y-4 animate-fade-in">
                <BaseSelect
                    id="marca"
                    label="Marca"
                    v-model="selections.marca"
                    :options="marcasOptions"
                    placeholder="Selecciona una marca"
                    required
                />
            </div>

            <div v-if="step === 2" class="space-y-4 animate-fade-in">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Marca seleccionada: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selections.marca }}</span>
                </div>
                <BaseSelect
                    id="modelo"
                    label="Modelo"
                    v-model="selections.modelo"
                    :options="modelosOptions"
                    placeholder="Selecciona un modelo"
                    required
                />
            </div>

            <div v-if="step === 3" class="space-y-4 animate-fade-in">
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Vehículo: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selections.marca }} {{ selections.modelo }}</span>
                </div>
                <BaseSelect
                    id="anio"
                    label="Año de Matriculación"
                    v-model="selections.anio"
                    :options="aniosOptions"
                    placeholder="Selecciona el año"
                    required
                />
            </div>

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
                    v-if="step < 3" 
                    @click="nextStep" 
                    :disabled="step === 1 ? !selections.marca : !selections.modelo"
                >
                    Siguiente
                </BaseButton>

                <BaseButton 
                    v-if="step === 3" 
                    @click="handleSubmit" 
                    :disabled="!selections.anio"
                    variant="primary"
                >
                    Finalizar
                </BaseButton>
            </div>
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
</style>