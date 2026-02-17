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
    // BASE_URL: 'https://script.google.com/macros/s/AKfycbyd8Uz8mh_PFjsxSgnRJVBSO8POB_mPUQR-LwtsCvnzxm99iNo9g5zTI2wKJulLLo9YrA/exec',
    BASE_URL: 'https://script.google.com/macros/s/AKfycbyqgKbS5VH-y4r0EVtJmBrkfol87jyJXVBlskM1iBD060v2Cq-gAjAWJ6heFLjx4WFulQ/exec',

    /** Nombres exactos de las hojas en el Spreadsheet */
    SHEETS: {
        CLIENTES: 'Clientes',
        DASHBOARD: 'Dashboard',
        COCHES_COMPACT: 'coches_compact',
    } as const,
} as const;

export type SheetName = (typeof API_CONFIG.SHEETS)[keyof typeof API_CONFIG.SHEETS];
