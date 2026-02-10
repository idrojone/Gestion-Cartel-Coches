import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Modelo {
    _row: number;
    ID_Modelo: string;
    ID_Marca: string;
    Nombre_Modelo: string;
    Segmento: string;
}

// ─── Servicio ────────────────────────────────────────────────────

class ModelosService {
    private readonly sheet = API_CONFIG.SHEETS.MODELOS;

    /** Obtener todos los modelos */
    async getAll(): Promise<ApiResponse<Modelo>> {
        return apiService.getSheetData<Modelo>(this.sheet);
    }

    /** Obtener un modelo por número de fila (1-based) */
    async getByRow(row: number): Promise<ApiRowResponse<Modelo>> {
        return apiService.getSheetRow<Modelo>(this.sheet, row);
    }

    /** Buscar modelo por ID */
    async findById(idModelo: string): Promise<Modelo | undefined> {
        const response = await this.getAll();
        return response.data?.find(m => m.ID_Modelo === idModelo);
    }

    /** Buscar modelos por marca */
    async findByMarca(idMarca: string): Promise<Modelo[]> {
        const response = await this.getAll();
        return response.data?.filter(m => m.ID_Marca === idMarca) ?? [];
    }

    /** Buscar modelos por segmento */
    async findBySegmento(segmento: string): Promise<Modelo[]> {
        const response = await this.getAll();
        return response.data?.filter(m =>
            m.Segmento.toLowerCase().includes(segmento.toLowerCase())
        ) ?? [];
    }

    /** Buscar modelos por nombre (búsqueda parcial) */
    async findByNombre(nombre: string): Promise<Modelo[]> {
        const response = await this.getAll();
        return response.data?.filter(m =>
            m.Nombre_Modelo.toLowerCase().includes(nombre.toLowerCase())
        ) ?? [];
    }
}

export const modelosService = new ModelosService();
