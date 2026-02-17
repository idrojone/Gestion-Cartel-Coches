import { apiService, type ApiResponse, type ApiRowResponse } from './api.service';
import { API_CONFIG } from './api.config';
import { userStore } from '@/store/store';

// ─── Interfaz del modelo ─────────────────────────────────────────

export interface Cliente {
    _row: number;
    ID_Cliente: string;
    DNI: string;
    Nombre: string;
    Contacto: string;
}

// ─── Tipos de respuesta para auth ────────────────────────────────

export interface LoginResponse {
    success: boolean;
    message: string;
    cliente?: Cliente;
}

// ─── Servicio ────────────────────────────────────────────────────

class ClientesService {
    private readonly sheet = API_CONFIG.SHEETS.CLIENTES;

    // ─── CRUD ────────────────────────────────────────────────────

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

    // ─── AUTH ────────────────────────────────────────────────────

    /**
     * Inicia sesión buscando un cliente por DNI y verificando el Contacto.
     * Si la autenticación es correcta, actualiza el store de Pinia.
     */
    async login(dni: string, contacto: string): Promise<LoginResponse> {
        try {
            const cliente = await this.findByDni(dni);

            if (!cliente) {
                return { success: false, message: 'No se encontró un cliente con ese DNI.' };
            }

            if (cliente.Contacto !== contacto) {
                return { success: false, message: 'Las credenciales son incorrectas.' };
            }

            // ── Actualizar estado en Pinia ──
            const store = userStore();
            store.setUser(cliente);
            store.setIsAuth(true);

            return {
                success: true,
                message: `Bienvenido, ${cliente.Nombre}`,
                cliente,
            };
        } catch (error) {
            console.error('[ClientesService] Error en login:', error);
            return { success: false, message: 'Error al conectar con el servidor.' };
        }
    }

    /**
     * Registra un nuevo cliente en la hoja de Clientes.
     * Comprueba que no exista ya un cliente con el mismo DNI.
     * Si el registro es correcto, hace login automático.
     */
    async register(nombre: string, dni: string, contacto: string): Promise<LoginResponse> {
        try {
            // Comprobar si ya existe un cliente con ese DNI
            const existente = await this.findByDni(dni);
            if (existente) {
                return { success: false, message: 'Ya existe un cliente con ese DNI.' };
            }

            // Enviar datos al Web App por POST
            const url = API_CONFIG.BASE_URL;
            const payload = {
                action: 'insert',
                sheet: this.sheet,
                data: {
                    DNI: dni,
                    Nombre: nombre,
                    Contacto: contacto,
                },
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                redirect: 'follow',
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const result = await res.json();

            if (result.status !== 'ok') {
                return { success: false, message: result.message || 'Error al registrar el cliente.' };
            }

            // Auto-login tras registro exitoso
            const store = userStore();
            const nuevoCliente: Cliente = {
                _row: result.row ?? 0,
                ID_Cliente: result.data?.ID_Cliente ?? '',
                DNI: dni,
                Nombre: nombre,
                Contacto: contacto,
            };
            store.setUser(nuevoCliente);
            store.setIsAuth(true);

            return {
                success: true,
                message: `¡Bienvenido, ${nombre}! Tu cuenta ha sido creada.`,
                cliente: nuevoCliente,
            };
        } catch (error) {
            console.error('[ClientesService] Error en register:', error);
            return { success: false, message: 'Error al conectar con el servidor.' };
        }
    }

    /**
     * Cierra la sesión del usuario actual y limpia el store.
     */
    logout(): void {
        const store = userStore();
        store.setUser(null);
        store.setIsAuth(false);
    }

    /**
     * Comprueba si hay un usuario autenticado en el store.
     */
    isAuthenticated(): boolean {
        const store = userStore();
        return store.getIsAuth;
    }

    /**
     * Devuelve el cliente autenticado actualmente, o null si no hay sesión.
     */
    getCurrentUser(): Cliente | null {
        const store = userStore();
        return store.getUser as Cliente | null;
    }
}

export const clientesService = new ClientesService();
