import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Marca {
    _row: number;
    ID_Marca: string;
    Marca: string;
    Grupo_Empresarial: string;
    Fecha_Inicio_Infraccion: string;
    Fecha_Fin_Infraccion: string;
}

// ─── Servicio ────────────────────────────────────────────────────

class MarcasService {
    private readonly sheet = API_CONFIG.SHEETS.MARCAS;

    /** Obtener todas las marcas */
    async getAll(): Promise<ApiResponse<Marca>> {
        return apiService.getSheetData<Marca>(this.sheet);
    }

    /** Obtener una marca por número de fila (1-based) */
    async getByRow(row: number): Promise<ApiRowResponse<Marca>> {
        return apiService.getSheetRow<Marca>(this.sheet, row);
    }

    /** Buscar marca por ID */
    async findById(idMarca: string): Promise<Marca | undefined> {
        const response = await this.getAll();
        return response.data?.find(m => m.ID_Marca === idMarca);
    }

    /** Buscar marca por nombre (búsqueda parcial) */
    async findByNombre(nombre: string): Promise<Marca[]> {
        const response = await this.getAll();
        return response.data?.filter(m =>
            m.Marca.toLowerCase().includes(nombre.toLowerCase())
        ) ?? [];
    }

    /** Filtrar marcas por grupo empresarial */
    async findByGrupo(grupo: string): Promise<Marca[]> {
        const response = await this.getAll();
        return response.data?.filter(m =>
            m.Grupo_Empresarial.toLowerCase().includes(grupo.toLowerCase())
        ) ?? [];
    }
}

export const marcasService = new MarcasService();
