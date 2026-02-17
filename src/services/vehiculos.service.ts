import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Vehiculo {
    _row: number;
    ID_Vehiculo: string;
    ID_Cliente: string;
    Matrícula: string;
    Marca: string;
    Modelo: string;
}

// ─── Servicio ────────────────────────────────────────────────────

class VehiculosService {
    private readonly sheet = API_CONFIG.SHEETS.COCHES_COMPACT;

    /** Obtener todos los vehículos */
    async getAll(): Promise<ApiResponse<Vehiculo>> {
        return apiService.getSheetData<Vehiculo>(this.sheet);
    }

    /** Obtener un vehículo por número de fila (1-based) */
    async getByRow(row: number): Promise<ApiRowResponse<Vehiculo>> {
        return apiService.getSheetRow<Vehiculo>(this.sheet, row);
    }

    /** Buscar vehículos por matrícula */
    async findByMatricula(matricula: string): Promise<Vehiculo | undefined> {
        const response = await this.getAll();
        return response.data?.find(v => v.Matrícula === matricula);
    }

    /** Buscar vehículos por ID de cliente */
    async findByCliente(idCliente: string): Promise<Vehiculo[]> {
        const response = await this.getAll();
        return response.data?.filter(v => v.ID_Cliente === idCliente) ?? [];
    }

    /** Buscar vehículos por marca */
    async findByMarca(marca: string): Promise<Vehiculo[]> {
        const response = await this.getAll();
        return response.data?.filter(v =>
            v.Marca.toLowerCase().includes(marca.toLowerCase())
        ) ?? [];
    }

    /** Obtener marcas únicas ordenadas */
    async getBrands(): Promise<string[]> {
        const response = await this.getAll();
        const set = new Set<string>();
        response.data?.forEach(v => {
            if (v.Marca) set.add(v.Marca);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }

    /** Obtener modelos únicos por marca (nombre del modelo) */
    async getModelsByMarca(marca: string): Promise<string[]> {
        const response = await this.getAll();
        const set = new Set<string>();
        response.data?.forEach(v => {
            if (v.Marca === marca && v.Modelo) set.add(v.Modelo);
        });
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }
}

export const vehiculosService = new VehiculosService();
