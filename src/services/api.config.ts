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
    BASE_URL: 'https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec',

    /** Nombres exactos de las hojas en el Spreadsheet */
    SHEETS: {
        VEHICULOS: 'Vehiculos',
        CLIENTES: 'Clientes',
        MODELOS: 'Modelos',
        // TODO: Reemplaza con el nombre real de la hoja (gid=1923123424)
        CASOS: 'Casos',
    } as const,
} as const;

export type SheetName = (typeof API_CONFIG.SHEETS)[keyof typeof API_CONFIG.SHEETS];
