import { apiService, type ApiResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Coche {
    _row: number;
    marca: string;
    /** URL del logo/imagen de la marca */
    imagen: string;
    // Las claves dinámicas como 'modelos/...'
    [key: string]: string | number;
}

// ─── Servicio ────────────────────────────────────────────────────

class CochesService {
    private readonly sheet = API_CONFIG.SHEETS.COCHES_COMPACT;

    /** Obtener todos los coches */
    async getAll(): Promise<ApiResponse<Coche>> {
        return apiService.getSheetData<Coche>(this.sheet);
    }
}

export const cochesService = new CochesService();
