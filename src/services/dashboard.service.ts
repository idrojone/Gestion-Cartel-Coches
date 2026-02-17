import { API_CONFIG } from './api.config';


/**
 * Interfaz para los datos que se enviarán al Dashboard del Spreadsheet.
 * Coincide con lo esperado por el backend en `Code.gs`.
 */
export interface DashboardCase {
    Nombre: string;
    DNI: string;
    Marca: string;
    Modelo: string;
    Anio: string;
    Estado: '✅ VIABLE' | '❌ FUERA DE PLAZO' | string;
    Accion: 'INICIAR RECLAMACIÓN' | 'ARCHIVAR' | string;
    ID_Cliente?: string;
    Matricula?: string;
}

export interface DashboardResponse {
    status: string;
    idCaso?: string;
    row?: number;
    message?: string;
}

class DashboardService {
    private readonly sheet = API_CONFIG.SHEETS.DASHBOARD;

    /**
     * Crea un nuevo caso en el Dashboard.
     * @param data Datos del caso a guardar.
     */
    async createCase(data: DashboardCase): Promise<DashboardResponse> {
        try {
            const url = API_CONFIG.BASE_URL;
            const payload = {
                action: 'insert',
                sheet: this.sheet,
                data: data,
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const result = await res.json();
            return result as DashboardResponse;

        } catch (error) {
            console.error('[DashboardService] Error creating case:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Error desconocido al guardar el caso.',
            };
        }
    }
}

export const dashboardService = new DashboardService();
