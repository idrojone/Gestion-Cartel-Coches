import { API_CONFIG } from './api.config';
import { apiService, type ApiResponse } from './api.service';


/**
 * Interfaz para los datos que se enviarán al Dashboard del Spreadsheet.
 * Coincide con lo esperado por el backend en `Code.gs`.
 */
export interface DashboardCase {
    _row?: number; // Para identificar la fila al editar
    Nombre: string;
    DNI: string;
    Marca: string;
    Modelo: string;
    Anio: string; // Fecha Compra (Est) -> ojo, en el excel es 'Fecha Compra (Est)'
    Estado: '✅ VIABLE' | '❌ FUERA DE PLAZO' | string;
    Accion: 'INICIAR RECLAMACIÓN' | 'ARCHIVAR' | string;
    ID_Cliente?: string;
    Matricula?: string;
    idCaso?: string; // ID Caso en el Excel
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
     * Obtiene todos los casos del Dashboard
     */
    async getAllCases(): Promise<ApiResponse<DashboardCase>> {
        // Mapeamos la respuesta para que coincida con la interfaz (las columnas del excel tienen espacios)
        return apiService.getSheetData<DashboardCase>(this.sheet);
    }

    /**
     * Crea un nuevo caso en el Dashboard.
     * @param data Datos del caso a guardar.
     */
    async createCase(data: DashboardCase): Promise<DashboardResponse> {
        try {
            // 1. Verificar si la matrícula ya existe
            if (data.Matricula) {
                const allCases = await this.getAllCases();
                const existingCase = allCases.data?.find((c: any) =>
                    c.Matricula && c.Matricula.trim().toUpperCase() === data.Matricula?.trim().toUpperCase()
                );

                if (existingCase) {
                    return {
                        status: 'error',
                        message: 'Esta matrícula ya ha sido registrada anteriormente.'
                    };
                }
            }

            const url = API_CONFIG.BASE_URL;

            // Generar datos calculados en el cliente
            const idCaso = `V-${Date.now().toString().slice(-6)}`;
            const fechaCompra = `01/06/${data.Anio}`;

            // Mapear a las columnas exactas del Excel
            const sheetData = {
                'ID Caso': idCaso,
                'DNI': data.DNI,
                'Matricula': data.Matricula || '',
                'Marca': data.Marca,
                'Fecha Compra (Est)': fechaCompra,
                'Estado Viabilidad': data.Estado,
                'Acción': data.Accion,
                'Modelo': data.Modelo,
                // Extra info opcional por si acaso
                'Nombre': data.Nombre,
                'ID_Cliente': data.ID_Cliente
            };

            const payload = {
                action: 'insert',
                sheet: this.sheet,
                data: sheetData,
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
            return {
                ...result,
                idCaso: idCaso // Devolvemos el ID generado aquí
            } as DashboardResponse;

        } catch (error) {
            console.error('[DashboardService] Error creating case:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Error desconocido al guardar el caso.',
            };
        }
    }

    /**
     * Actualiza un caso existente en el Dashboard.
     * @param idCaso ID interno del caso (ej: V-123456)
     * @param updates Objeto con los campos a actualizar (Estado, Accion, etc.)
     * @param row (Opcional) Número de fila si se conoce, para optimizar.
     */
    async updateCase(idCaso: string, updates: Partial<DashboardCase>, row?: number): Promise<DashboardResponse> {
        try {
            const url = API_CONFIG.BASE_URL;

            // Mapear campos de interfaz a nombres de columna en Excel
            const dataToUpdate: Record<string, any> = {};
            if (updates.Estado) dataToUpdate['Estado Viabilidad'] = updates.Estado;
            if (updates.Accion) dataToUpdate['Acción'] = updates.Accion;
            // Añadir otros campos si fuera necesario

            const payload: any = {
                action: 'update',
                sheet: this.sheet,
                data: dataToUpdate
            };

            // Prioridad: usar row si existe (más rápido), si no, match por ID Caso
            if (row) {
                payload.row = row;
            } else {
                payload.match = {
                    col: 'ID Caso',
                    val: idCaso
                };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            return await res.json() as DashboardResponse;

        } catch (error) {
            console.error('[DashboardService] Error updating case:', error);
            return {
                status: 'error',
                message: error instanceof Error ? error.message : 'Error desconocido al actualizar el caso.',
            };
        }
    }
}

export const dashboardService = new DashboardService();
