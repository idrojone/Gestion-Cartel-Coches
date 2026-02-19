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
import EligibilityChecking from './eligibility/EligibilityChecking.vue';
import EligibilityAffected from './eligibility/EligibilityAffected.vue';
import EligibilityNotAffected from './eligibility/EligibilityNotAffected.vue';

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

const actionLabel = computed(() => {
    if (props.status === 'affected') {
        return isAuth.value ? 'Guardar' : 'Guardar y Calcular otra vez';
    } else { // not_affected
        return isAuth.value ? 'Guardar' : 'Guardar Resultado';
    }
});

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
        // Usuario NO logueado: Guardar datos temporalmente y redirigir
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
            // Guardar datos en localStorage para recuperarlos tras loguearse
            localStorage.setItem('pendingCase', JSON.stringify(caseData));
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
        
        <EligibilityChecking v-if="status === 'checking'" />

        <EligibilityAffected 
            v-else-if="status === 'affected'"
            :vehicle="vehicle"
            :actionLabel="actionLabel"
            @action="handleAction"
            @reset="$emit('reset')"
        />

        <EligibilityNotAffected
            v-else-if="status === 'not_affected'"
            :vehicle="vehicle"
            :actionLabel="actionLabel"
            @action="handleAction"
            @reset="$emit('reset')"
        />
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
