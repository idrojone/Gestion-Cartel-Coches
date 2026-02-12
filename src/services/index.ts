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

// Vehiculos
export { vehiculosService } from './vehiculos.service';
export type { Vehiculo } from './vehiculos.service';

// Clientes
export { clientesService } from './clientes.service';
export type { Cliente } from './clientes.service';

// Modelos
export { modelosService } from './modelos.service';
export type { Modelo } from './modelos.service';

// Casos
export { casosService } from './casos.service';
export type { Caso, EstadoViabilidad, AccionCaso } from './casos.service';

// Marcas
export { marcasService } from './marcas.service';
export type { Marca } from './marcas.service';
