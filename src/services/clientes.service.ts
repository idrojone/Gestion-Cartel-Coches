import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Cliente {
    _row: number;
    ID_Cliente: string;
    DNI: string;
    Nombre: string;
    Contacto: string;
}

// ─── Servicio ────────────────────────────────────────────────────

class ClientesService {
    private readonly sheet = API_CONFIG.SHEETS.CLIENTES;

    /** Obtener todos los clientes */
    async getAll(): Promise<ApiResponse<Cliente>> {
        return apiService.getSheetData<Cliente>(this.sheet);
    }

    /** Obtener un cliente por número de fila (1-based) */
    async getByRow(row: number): Promise<ApiRowResponse<Cliente>> {
        return apiService.getSheetRow<Cliente>(this.sheet, row);
    }

    /** Buscar cliente por ID */
    async findById(idCliente: string): Promise<Cliente | undefined> {
        const response = await this.getAll();
        return response.data?.find(c => c.ID_Cliente === idCliente);
    }

    /** Buscar cliente por DNI */
    async findByDni(dni: string): Promise<Cliente | undefined> {
        const response = await this.getAll();
        return response.data?.find(c => c.DNI === dni);
    }

    /** Buscar clientes por nombre (búsqueda parcial) */
    async findByNombre(nombre: string): Promise<Cliente[]> {
        const response = await this.getAll();
        return response.data?.filter(c =>
            c.Nombre.toLowerCase().includes(nombre.toLowerCase())
        ) ?? [];
    }
}

export const clientesService = new ClientesService();
