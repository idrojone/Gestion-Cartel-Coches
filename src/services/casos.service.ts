import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Caso {
    _row: number;
    'ID Caso': string;
    Cliente: string;
    DNI: string;
    Vehículo: string;
    Marca: string;
    'Fecha Compra (Est)': string;
    'Estado Viabilidad': string;
    Acción: string;
}

/** Valores posibles del estado de viabilidad */
export type EstadoViabilidad = '✅ VIABLE' | '❌ FUERA DE PLAZO';

/** Valores posibles de acción */
export type AccionCaso = 'INICIAR RECLAMACIÓN' | 'ARCHIVAR';

// ─── Servicio ────────────────────────────────────────────────────

class CasosService {
    /**
     * TODO: Verifica que este nombre coincida con el nombre real
     * de la hoja en tu Spreadsheet (gid=1923123424).
     * Cámbialo en api.config.ts → SHEETS.CASOS si es diferente.
     */
    private readonly sheet = API_CONFIG.SHEETS.CASOS;

    /** Obtener todos los casos */
    async getAll(): Promise<ApiResponse<Caso>> {
        return apiService.getSheetData<Caso>(this.sheet);
    }

    /** Obtener un caso por número de fila (1-based) */
    async getByRow(row: number): Promise<ApiRowResponse<Caso>> {
        return apiService.getSheetRow<Caso>(this.sheet, row);
    }

    /** Buscar caso por ID */
    async findById(idCaso: string): Promise<Caso | undefined> {
        const response = await this.getAll();
        return response.data?.find(c => c['ID Caso'] === idCaso);
    }

    /** Filtrar casos viables */
    async getViables(): Promise<Caso[]> {
        const response = await this.getAll();
        return response.data?.filter(c =>
            c['Estado Viabilidad'] === '✅ VIABLE'
        ) ?? [];
    }

    /** Filtrar casos fuera de plazo */
    async getFueraDePlazo(): Promise<Caso[]> {
        const response = await this.getAll();
        return response.data?.filter(c =>
            c['Estado Viabilidad'] === '❌ FUERA DE PLAZO'
        ) ?? [];
    }

    /** Buscar casos por DNI del cliente */
    async findByDni(dni: string): Promise<Caso[]> {
        const response = await this.getAll();
        return response.data?.filter(c => c.DNI === dni) ?? [];
    }

    /** Buscar casos por marca */
    async findByMarca(marca: string): Promise<Caso[]> {
        const response = await this.getAll();
        return response.data?.filter(c =>
            c.Marca.toLowerCase().includes(marca.toLowerCase())
        ) ?? [];
    }

    /** Buscar casos por acción */
    async findByAccion(accion: AccionCaso): Promise<Caso[]> {
        const response = await this.getAll();
        return response.data?.filter(c => c.Acción === accion) ?? [];
    }
}

export const casosService = new CasosService();
