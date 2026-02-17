/**
 * Barrel export — importa todos los servicios desde un único punto:
 *
 *   import { vehiculosService, clientesService, ... } from '@/services';
 */

// Configuración
export { API_CONFIG } from './api.config';
export type { SheetName } from './api.config';

// Servicio base
export { apiService } from './api.service';
export type {
    ApiResponse,
    ApiRowResponse,
    ApiAllResponse,
    SheetsListResponse,
} from './api.service';

// Clientes
export { clientesService } from './clientes.service';
export type { Cliente } from './clientes.service';

// Coches
export { cochesService } from './coches.service';
export type { Coche } from './coches.service';
