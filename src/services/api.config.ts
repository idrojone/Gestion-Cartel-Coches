/**
 * Configuración de la API REST (Google Apps Script Web App)
 *
 * Después de desplegar el script en Apps Script, pega aquí la URL
 * de tu Web App (Implementar → Nueva implementación → copiar URL).
 */
export const API_CONFIG = {
    /**
     * URL base del Web App desplegado en Google Apps Script.
     * ⚠️  REEMPLAZA esta URL con la tuya real tras desplegar.
     */
    BASE_URL: 'https://script.google.com/macros/s/AKfycbyd8Uz8mh_PFjsxSgnRJVBSO8POB_mPUQR-LwtsCvnzxm99iNo9g5zTI2wKJulLLo9YrA/exec',

    /** Nombres exactos de las hojas en el Spreadsheet */
    SHEETS: {
        VEHICULOS: 'Vehiculos',
        CLIENTES: 'Clientes',
        MODELOS: 'Modelos',
        MARCAS: 'Marcas',
        DASHBOARD: 'Dashboard',
        CASOS: 'Casos',
        COCHES_COMPACT: 'coches_compact',
    } as const,
} as const;

export type SheetName = (typeof API_CONFIG.SHEETS)[keyof typeof API_CONFIG.SHEETS];
