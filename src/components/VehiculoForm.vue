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
import BaseInput from './BaseInput.vue';
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
 * - 'idle': Estado inicial, formulario activo.
 * - 'checking': Simulando comprobación (loading).
 * - 'affected': El vehículo es elegible.
 * - 'not_affected': El vehículo no es elegible.
 */
const checkStatus = ref<'idle' | 'checking' | 'affected' | 'not_affected'>('idle');

// --- Propiedades Computadas ---

/**
 * Obtiene la lista de marcas con su imagen, ordenadas alfabéticamente.
 */
const marcasConImagen = computed(() => {
    return rawData.value
        .filter((row) => row.marca)
        .map((row) => ({
            marca: String(row.marca),
            imagen: row.imagen ? String(row.imagen) : '',
        }))
        .sort((a, b) => a.marca.localeCompare(b.marca));
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
    return (step.value / 4) * 100;
});

/**
 * Devuelve la URL del logo/imagen de la marca seleccionada.
 */
const marcaImagen = computed(() => {
    if (!selections.value.marca) return null;
    const row = rawData.value.find((r) => r.marca === selections.value.marca);
    return row?.imagen ? String(row.imagen) : null;
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
    if (step.value < 4) step.value++;
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
    checkStatus.value = 'idle';
    step.value = 1;
    selections.value = { marca: '', modelo: '', anio: '', matricula: '' };
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
            
            <div v-if="step === 1" class="animate-fade-in">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">Selecciona tu marca</p>
                <div class="brand-grid">
                    <button
                        v-for="item in marcasConImagen"
                        :key="item.marca"
                        type="button"
                        class="brand-card"
                        :class="{ 'brand-card--active': selections.marca === item.marca }"
                        @click="selections.marca = item.marca"
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

            <div v-if="step === 2" class="space-y-4 animate-fade-in">
                <div class="flex items-center gap-3 mb-2">
                    <img v-if="marcaImagen" :src="marcaImagen" :alt="selections.marca" class="brand-logo-sm" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        Marca seleccionada: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selections.marca }}</span>
                    </span>
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
                <div class="flex items-center gap-3 mb-2">
                    <img v-if="marcaImagen" :src="marcaImagen" :alt="selections.marca" class="brand-logo-sm" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        Vehículo: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selections.marca }} {{ selections.modelo }}</span>
                    </span>
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

            <div v-if="step === 4" class="space-y-4 animate-fade-in">
                <div class="flex items-center gap-3 mb-2">
                    <img v-if="marcaImagen" :src="marcaImagen" :alt="selections.marca" class="brand-logo-sm" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                        Vehículo: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ selections.marca }} {{ selections.modelo }} ({{ selections.anio }})</span>
                    </span>
                </div>
                <BaseInput
                    id="matricula"
                    label="Matrícula"
                    v-model="selections.matricula"
                    placeholder="Ej: 1234ABC"
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

/* ── Logo pequeño en resúmenes de contexto (pasos 2-4) ── */
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
</style>