<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { API_CONFIG, apiService } from '@/services';
import BaseSelect from './BaseSelect.vue';
import BaseButton from './BaseButton.vue';
import BaseProgressBar from './BaseProgressBar.vue';
import EligibilityResult from './EligibilityResult.vue';

interface CarDataRow {
    _row: number;
    marca: string;
    [key: string]: string | number; 
}

interface Selections {
    marca: string;
    modelo: string;
    anio: string;
}

const step = ref(1);
const loading = ref(false);
const error = ref<string | null>(null);
const rawData = ref<CarDataRow[]>([]);
const selections = ref<Selections>({
    marca: '',
    modelo: '',
    anio: '',
});

const checkStatus = ref<'idle' | 'checking' | 'affected' | 'not_affected'>('idle');

const marcasOptions = computed(() => {
    return rawData.value
        .map((row) => row.marca)
        .filter((marca) => marca)
        .sort();
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
    return (step.value / 3) * 100;
});

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await apiService.getSheetData<CarDataRow>(API_CONFIG.SHEETS.COCHES_COMPACT);
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
             <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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