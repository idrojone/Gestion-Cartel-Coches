import { ref } from 'vue';
import { dashboardService, type DashboardCase } from '../services/dashboard.service';

export function useDashboardCases() {
    const cases = ref<DashboardCase[]>([]);
    const loading = ref(true);
    const error = ref('');
    const updating = ref<string | null>(null);

    const ESTADO_OPTIONS = ['✅ VIABLE', '❌ FUERA DE PLAZO', 'RECHAZADA', 'COMPLETADA', 'PENDIENTE'];
    const ACCION_OPTIONS = ['INICIAR RECLAMACIÓN', 'EN PROCESO', 'HECHA', 'ARCHIVAR'];

    const loadCases = async () => {
        loading.value = true;
        error.value = '';
        try {
            const response = await dashboardService.getAllCases();
            if (response.status === 'ok' && response.data) {
                cases.value = response.data.map((row: any) => ({
                    ...row,
                    idCaso: row['ID Caso'],
                    DNI: row['DNI'],
                    Matricula: row['Matricula'],
                    Marca: row['Marca'],
                    Modelo: row['Modelo'],
                    Anio: row['Fecha Compra (Est)'],
                    Estado: row['Estado Viabilidad'],
                    Accion: row['Acción'],
                    Nombre: row['Nombre'] || '',
                    ID_Cliente: row['ID_Cliente'] || ''
                }));
            } else {
                error.value = response.message || 'Error al cargar los casos.';
            }
        } catch (e) {
            error.value = 'Error de conexión al cargar datos.';
            console.error(e);
        } finally {
            loading.value = false;
        }
    };

    const handleUpdate = async (c: DashboardCase, field: 'Estado' | 'Accion', newValue: string) => {
        if (!c.idCaso) return;

        const item = cases.value.find(x => x.idCaso === c.idCaso);
        if (!item) return;

        const oldValue = field === 'Estado' ? item.Estado : item.Accion;
        if (oldValue === newValue) return;

        // Optimistic update
        if (field === 'Estado') item.Estado = newValue;
        else item.Accion = newValue;

        updating.value = c.idCaso;

        try {
            const updates: Partial<DashboardCase> = {};
            if (field === 'Estado') updates.Estado = newValue;
            if (field === 'Accion') updates.Accion = newValue;

            const res = await dashboardService.updateCase(c.idCaso, updates, item._row);

            if (res.status !== 'ok') {
                throw new Error(res.message);
            }
        } catch (e) {
            console.error('Error updating case:', e);
            // Revert
            if (field === 'Estado') item.Estado = oldValue;
            else item.Accion = oldValue;
            alert('Error al actualizar: ' + (e instanceof Error ? e.message : 'Desconocido'));
        } finally {
            updating.value = null;
        }
    };

    return {
        cases,
        loading,
        error,
        updating,
        ESTADO_OPTIONS,
        ACCION_OPTIONS,
        loadCases,
        handleUpdate
    };
}
