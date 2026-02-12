import { API_CONFIG, type SheetName } from './api.config';

// ─── Tipos genéricos de respuesta de la API ──────────────────────

export interface ApiResponse<T> {
    status: 'ok' | 'error';
    message?: string;
    sheet?: string;
    count?: number;
    headers?: string[];
    data?: T[];
}

export interface ApiRowResponse<T> {
    status: 'ok' | 'error';
    message?: string;
    sheet?: string;
    row?: number;
    data?: T;
}

export interface ApiAllResponse {
    status: 'ok' | 'error';
    message?: string;
    spreadsheet?: string;
    sheets?: Record<string, { count: number; headers: string[]; data: Record<string, unknown>[] }>;
}

export interface SheetsListResponse {
    status: 'ok' | 'error';
    sheets?: string[];
}

// ─── Servicio base genérico ──────────────────────────────────────

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    /**
     * Construye la URL con query params
     */
    private buildUrl(params: Record<string, string>): string {
        const url = new URL(this.baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        return url.toString();
    }

    /**
     * Fetch genérico con manejo de errores
     */
    private async request<T>(params: Record<string, string>): Promise<T> {
        const url = this.buildUrl(params);

        try {
            const response = await fetch(url, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            try {
                return JSON.parse(text) as T;
            } catch {
                throw new Error(`Respuesta no es JSON válido: ${text.substring(0, 200)}`);
            }
        } catch (error) {
            console.error('[ApiService] Error en la petición:', error);
            throw error;
        }
    }

    // ─── Métodos públicos ────────────────────────────────────────

    /**
     * Lista los nombres de todas las hojas disponibles
     */
    async getSheets(): Promise<SheetsListResponse> {
        return this.request<SheetsListResponse>({ action: 'sheets' });
    }

    /**
     * Obtiene todos los datos de una hoja
     */
    async getSheetData<T>(sheetName: SheetName): Promise<ApiResponse<T>> {
        return this.request<ApiResponse<T>>({ action: 'data', sheet: sheetName });
    }

    /**
     * Obtiene una fila específica de una hoja (índice empezando en 1)
     */
    async getSheetRow<T>(sheetName: SheetName, row: number): Promise<ApiRowResponse<T>> {
        return this.request<ApiRowResponse<T>>({
            action: 'data',
            sheet: sheetName,
            row: row.toString(),
        });
    }

    /**
     * Obtiene los datos de TODAS las hojas de una vez
     */
    async getAllData(): Promise<ApiAllResponse> {
        return this.request<ApiAllResponse>({ action: 'all' });
    }
}

/** Instancia singleton del servicio API */
export const apiService = new ApiService();
