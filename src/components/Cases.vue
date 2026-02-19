<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { dashboardService, type DashboardCase } from '@/services/dashboard.service';
import { userStore } from '@/store/store';
import { useRouter } from 'vue-router';

// ─── Estado ─────────────────────────────────────────────────────────

const store = userStore();
const router = useRouter();

const loading = ref(true);
const error = ref<string | null>(null);
const cases = ref<DashboardCase[]>([]);

// ─── Computed ───────────────────────────────────────────────────────

const hasCases = computed(() => cases.value.length > 0);

// Usuario actual
const currentUser = computed(() => {
    // Forzamos el tipo, aunque idealmente deberíamos tener una interfaz bien definida en el store
    return store.getUser as { DNI?: string; Nombre?: string } | null;
});

// ─── Métodos ────────────────────────────────────────────────────────

const fetchCases = async () => {
    loading.value = true;
    error.value = null;

    try {
        const dni = currentUser.value?.DNI;
        
        if (!dni) {
            error.value = "No se ha podido identificar el usuario. Por favor, inicia sesión de nuevo.";
            return;
        }

        // Llamamos al nuevo servicio para filtrar por DNI
        cases.value = await dashboardService.getCasesByDni(dni);

    } catch (e) {
        console.error("Error al obtener casos:", e);
        error.value = "Hubo un error al cargar tus casos. Inténtalo más tarde.";
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Pendiente';
    return dateString;
};

// Función simple para determinar color del estado
const getStatusColor = (status: string) => {
    const s = status?.toUpperCase() || '';
    if (s.includes('VIABLE')) return 'text-green-600 bg-green-50 border-green-200';
    if (s.includes('NO VIABLE') || s.includes('FUERA')) return 'text-red-600 bg-red-50 border-red-200';
    if (s.includes('PENDIENTE')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
};

// ─── Ciclo de vida ──────────────────────────────────────────────────

onMounted(() => {
    if (!store.getIsAuth) {
        router.push('/auth');
        return;
    }
    fetchCases();
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            
            <!-- Encabezado -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Mis Casos</h1>
                    <p class="mt-2 text-gray-600">Revisa el estado de tus reclamaciones.</p>
                </div>
                <!-- Botón Nuevo Caso -->
                <RouterLink 
                    to="/" 
                    class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    + Nuevo Caso
                </RouterLink>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p class="mt-4 text-gray-500">Cargando tus expedientes...</p>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                <div class="flex">
                    <div class="shrink-0">
                        <!-- Icono Error -->
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ error }}</p>
                        <button @click="fetchCases" class="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline">
                            Intentar de nuevo
                        </button>
                    </div>
                </div>
            </div>

            <!-- Lista de Casos -->
            <div v-else>
                
                <!-- Estado Vacío -->
                <div v-if="!hasCases" class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No tienes casos registrados</h3>
                    <p class="mt-1 text-sm text-gray-500">Comienza verificando la elegibilidad de tu vehículo.</p>
                </div>

                <!-- Grilla de Tarjetas -->
                <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <div 
                        v-for="(caso, index) in cases" 
                        :key="index"
                        class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                        <div class="px-4 py-5 sm:p-6">
                            
                            <!-- Cabecera Tarjeta: Marca y Modelo -->
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                                        {{ caso.Marca }} {{ caso.Modelo }}
                                    </h3>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Matrícula: <span class="font-mono bg-gray-100 px-1 rounded">{{ caso.Matricula || 'N/A' }}</span>
                                    </p>
                                </div>
                                <span 
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                                    :class="getStatusColor(caso.Estado)"
                                >
                                    {{ caso.Estado || 'Desconocido' }}
                                </span>
                            </div>

                            <!-- Detalles -->
                            <div class="mt-4 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="block text-gray-500 text-xs uppercase tracking-wide">ID Caso</span>
                                    <span class="block font-medium text-gray-900 mt-0.5">{{ caso.ID_Caso || 'Pendiente' }}</span>
                                </div>
                                <div>
                                    <span class="block text-gray-500 text-xs uppercase tracking-wide">Año Compra</span>
                                    <span class="block font-medium text-gray-900 mt-0.5">{{ formatDate(caso.Anio) }}</span>
                                </div>
                                <div v-if="caso.Accion" class="col-span-2">
                                    <span class="block text-gray-500 text-xs uppercase tracking-wide">Acción Recomendada</span>
                                    <span class="block font-medium text-gray-900 mt-0.5">{{ caso.Accion }}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>