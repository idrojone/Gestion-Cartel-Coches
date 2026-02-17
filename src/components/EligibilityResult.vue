<!-- 
  @component EligibilityResult
  @description Muestra el resultado de la comprobación de elegibilidad del vehículo.
  
  Estados posibles:
  - 'checking': Muestra un spinner de carga.
  - 'affected': Muestra mensaje de éxito (vehículo afectado) y botón para reiniciar.
  - 'not_affected': Muestra mensaje de que no se encontró coincidencia y botón para volver.

  Uso:
  Este componente se renderiza dentro de `VehiculoForm` una vez que el usuario ha completado los pasos.
-->

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { dashboardService } from '@/services/dashboard.service';
import { userStore } from '@/store/store';
import BaseButton from './BaseButton.vue';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid'

/**
 * Propiedades del componente.
 * @interface Props
 */
interface Props {
    /** Estado actual del proceso de verificación */
    status: 'idle' | 'checking' | 'affected' | 'not_affected';
    
    /** Datos del vehículo seleccionado para mostrar en el mensaje */
    vehicle: {
        marca: string;
        modelo: string;
        anio: string;
        matricula: string;
    };
}

const props = defineProps<Props>();
/**
 * Eventos emitidos por el componente.
 * @event reset Solicitud para reiniciar el proceso de comprobación.
 */
const emit = defineEmits<{
    (e: 'reset'): void;
}>();

const router = useRouter();
const store = userStore();
const isAuth = computed(() => store.getIsAuth);

const handleAction = async () => {
    const currentUser = store.getUser;

    // Datos del caso a guardar
    const caseData = {
        Nombre: currentUser?.Nombre || '',
        DNI: currentUser?.DNI || '',
        Marca: props.vehicle.marca,
        Modelo: props.vehicle.modelo,
        Anio: props.vehicle.anio,
        Matricula: props.vehicle.matricula,
        Estado: props.status === 'affected' ? '✅ VIABLE' : '❌ FUERA DE PLAZO',
        Accion: props.status === 'affected' ? 'INICIAR RECLAMACIÓN' : 'ARCHIVAR',
        ID_Cliente: currentUser?.ID_Cliente || '',
    };

    if (isAuth.value) {
        // Usuario logueado: Guardar directamente
        saveCase(caseData);
    } else {
        // Usuario NO logueado: Redirigir a Registro
        const result = await Swal.fire({
            title: '¿Quieres reclamar tu indemnización?',
            text: "Para continuar con el proceso y guardar tu consulta, necesitas registrarte.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Registrarte para trabajar con nosotros',
            cancelButtonText: 'Calcular otra vez',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            router.push('/auth');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            emit('reset');
        }
    }
};

const saveCase = async (data: any) => {
    Swal.fire({ title: 'Guardando consulta...', didOpen: () => Swal.showLoading() });
    
    const response = await dashboardService.createCase(data);
    
    if (response.status === 'ok') {
        await Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: `Tu consulta ha sido registrada con ID: ${response.idCaso}`,
            timer: 3000,
            showConfirmButton: false
        });
        emit('reset');
    } else {
        Swal.fire('Error', response.message || 'No se pudo guardar la consulta.', 'error');
    }
};
</script>

<template>
    <div class="text-center py-8 animate-fade-in">
        
        <!-- Checking State -->
        <div v-if="status === 'checking'" class="flex flex-col items-center space-y-4">
            <ArrowPathIcon class="animate-spin h-12 w-12 text-indigo-600" />
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Comprobando si tu vehículo está afectado...</p>
        </div>

        <!-- Affected State -->
        <div v-else-if="status === 'affected'" class="flex flex-col items-center space-y-6">
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <CheckCircleIcon class="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            
            <div class="space-y-2">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">¡Tu vehículo está afectado!</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    El <strong>{{ vehicle.marca }} {{ vehicle.modelo }}</strong> del año <strong>{{ vehicle.anio }}</strong> forma parte del cártel de coches.
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Tienes derecho a reclamar una indemnización.
                </p>
            </div>

            <BaseButton @click="handleAction" variant="primary">
                {{ isAuth ? 'Guardar' : 'Guardar y Calcular otra vez' }}
            </BaseButton>
            <BaseButton @click="$emit('reset')" variant="secondary" class="mt-2">Volver al inicio</BaseButton>
        </div>

        <!-- Not Affected State -->
        <div v-else-if="status === 'not_affected'" class="flex flex-col items-center space-y-6">
            <div class="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <XCircleIcon class="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            
            <div class="space-y-2">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">No hemos encontrado coincidencia</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    El <strong>{{ vehicle.marca }} {{ vehicle.modelo }}</strong> no parece estar en la lista principal de afectados en este momento.
                </p>
            </div>

            <!-- Esto es te que cambiar per un botó al login si no essta loggejat -->
            <BaseButton @click="handleAction" variant="primary">
                {{ isAuth ? 'Guardar' : 'Guardar Resultado' }}
            </BaseButton>
            <BaseButton @click="$emit('reset')" variant="secondary" class="mt-2">Volver al inicio</BaseButton>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
