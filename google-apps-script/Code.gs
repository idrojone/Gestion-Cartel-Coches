/**
 * Google Apps Script - REST API para Google Sheets
 * Spreadsheet ID: 15oYqjqzq566UTenNN9Ffg5mIyA67zxCigzaNoQ0IKxI
 *
 * Endpoints disponibles (via query params en la URL del Web App):
 *
 *   GET ?action=sheets
 *       → Lista todas las hojas disponibles
 *
 *   GET ?action=data&sheet=NombreHoja
 *       → Devuelve todos los datos de la hoja indicada (con cabeceras como claves)
 *
 *   GET ?action=data&sheet=NombreHoja&row=3
 *       → Devuelve una fila específica (índice basado en 1, sin contar cabecera)
 *
 *   GET ?action=all
 *       → Devuelve todos los datos de TODAS las hojas
 *
 *   GET  (sin parámetros)
 *       → Devuelve información general del spreadsheet y lista de hojas
 */

const SPREADSHEET_ID = '15oYqjqzq566UTenNN9Ffg5mIyA67zxCigzaNoQ0IKxI';

/**
 * Punto de entrada principal para peticiones GET
 */
function doGet(e) {
  try {
    const params = e.parameter || {};
    const action = (params.action || '').toLowerCase();

    let result;

    switch (action) {
      case 'sheets':
        result = getSheetNames_();
        break;

      case 'data':
        result = getSheetData_(params.sheet, params.row);
        break;

      case 'all':
        result = getAllData_();
        break;

      default:
        result = getSpreadsheetInfo_();
        break;
    }

    return jsonResponse_({ status: 'ok', ...result });

  } catch (error) {
    return jsonResponse_({
      status: 'error',
      message: error.message
    });
  }
}

/**
 * Punto de entrada principal para peticiones POST
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // Esperar hasta 10s para evitar condiciones de carrera

  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const sheetName = postData.sheet;
    const data = postData.data;

    if (action !== 'insert') {
      throw new Error('Acción no soportada o no especificada.');
    }

    if (!sheetName) {
      throw new Error('Nombre de hoja no especificado.');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      throw new Error(`La hoja "${sheetName}" no existe.`);
    }

    let result = {};

    // ─── LÓGICA ESPECÍFICA PARA DASHBOARD ───
    if (sheetName === 'Dashboard') {
        const lastRow = sheet.getLastRow();
        // Generar ID Caso: V-{timestamp} para simplicidad y unicidad
        // Opcional: Podríamos leer el último ID y sumar 1, pero requiere más lógica.
        const idCaso = `V-${Date.now().toString().slice(-6)}`; 
        const fechaActual = new Date();

        // Mapeo estricto de columnas
        // Orden esperado en Dashboard:
        // ID Caso | Cliente | DNI | Vehículo | Marca | Fecha Compra (Est) | Estado Viabilidad | Acción | ID_Cliente | Matricula | Modelo | Ano
        
        const rowData = [
            idCaso,                             // ID Caso
            data.Nombre || '',                  // Cliente
            data.DNI || '',                     // DNI
            `${data.Marca} - ${data.Modelo} ${data.Anio}`, // Vehículo
            data.Marca || '',                   // Marca
            `01/06/${data.Anio}`,               // Fecha Compra (Est)
            data.Estado || '',                  // Estado Viabilidad
            data.Accion || '',                  // Acción
            data.ID_Cliente || '',              // ID_Cliente
            data.Matricula || '',               // Matricula
            data.Modelo || '',                  // Modelo
            data.Anio || ''                     // Ano
        ];

        sheet.appendRow(rowData);
        result = { idCaso: idCaso, row: lastRow + 1 };
    
    // ─── LÓGICA GENÉRICA PARA OTRAS HOJAS (ej. Clientes) ───
    } else {
        const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        const rowData = headers.map(header => {
            return data[header] || '';
        });
        
        // Si hay cabeceras que no coinciden con las keys del objeto data, se guardarán vacías.
        // Si data tiene keys que no están en headers, se ignoran.
        
        sheet.appendRow(rowData);
        result = { row: sheet.getLastRow() };
    }

    return jsonResponse_({
      status: 'ok',
      ...result
    });

  } catch (error) {
    return jsonResponse_({
      status: 'error',
      message: error.message
    });
  } finally {
    lock.releaseLock();
  }
}

// ─────────────────────────────────────────────
//  Funciones de datos
// ─────────────────────────────────────────────

/**
 * Devuelve información general del spreadsheet
 */
function getSpreadsheetInfo_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets().map(s => ({
    name: s.getName(),
    rows: s.getLastRow(),
    columns: s.getLastColumn()
  }));

  return {
    spreadsheet: ss.getName(),
    url: ss.getUrl(),
    sheets: sheets,
    endpoints: {
      listarHojas: '?action=sheets',
      datosDeHoja: '?action=data&sheet=NOMBRE_HOJA',
      filaEspecifica: '?action=data&sheet=NOMBRE_HOJA&row=NUMERO',
      todosLosDatos: '?action=all'
    }
  };
}

/**
 * Devuelve el listado de nombres de hojas
 */
function getSheetNames_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const names = ss.getSheets().map(s => s.getName());
  return { sheets: names };
}

/**
 * Devuelve los datos de una hoja concreta.
 * Si se pasa `rowIndex`, devuelve solo esa fila.
 */
function getSheetData_(sheetName, rowIndex) {
  if (!sheetName) {
    throw new Error(
      'Parámetro "sheet" requerido. Usa ?action=sheets para ver las hojas disponibles.'
    );
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Hoja "${sheetName}" no encontrada.`);
  }

  const data = sheet.getDataRange().getValues();

  if (data.length === 0) {
    return { sheet: sheetName, count: 0, data: [] };
  }

  // La primera fila son las cabeceras
  const headers = data[0].map(h => String(h).trim());
  const rows = data.slice(1);

  // Convertir cada fila en un objeto { cabecera: valor }
  const records = rows.map((row, index) => {
    const obj = { _row: index + 1 };
    headers.forEach((header, i) => {
      const key = header || `col_${i}`;
      let value = row[i];

      // Formatear fechas como ISO string
      if (value instanceof Date) {
        value = value.toISOString();
      }

      obj[key] = value;
    });
    return obj;
  });

  // Si se pidió una fila específica
  if (rowIndex !== undefined && rowIndex !== null && rowIndex !== '') {
    const idx = parseInt(rowIndex, 10);

    if (isNaN(idx) || idx < 1 || idx > records.length) {
      throw new Error(
        `Fila ${rowIndex} fuera de rango. La hoja "${sheetName}" tiene ${records.length} filas de datos.`
      );
    }

    return {
      sheet: sheetName,
      row: idx,
      data: records[idx - 1]
    };
  }

  return {
    sheet: sheetName,
    count: records.length,
    headers: headers,
    data: records
  };
}

/**
 * Devuelve los datos de TODAS las hojas
 */
function getAllData_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  const allData = {};

  sheets.forEach(sheet => {
    const name = sheet.getName();
    const data = sheet.getDataRange().getValues();

    if (data.length === 0) {
      allData[name] = { count: 0, headers: [], data: [] };
      return;
    }

    const headers = data[0].map(h => String(h).trim());
    const rows = data.slice(1);

    const records = rows.map((row, index) => {
      const obj = { _row: index + 1 };
      headers.forEach((header, i) => {
        const key = header || `col_${i}`;
        let value = row[i];

        if (value instanceof Date) {
          value = value.toISOString();
        }

        obj[key] = value;
      });
      return obj;
    });

    allData[name] = {
      count: records.length,
      headers: headers,
      data: records
    };
  });

  return {
    spreadsheet: ss.getName(),
    sheets: allData
  };
}

// ─────────────────────────────────────────────
//  Utilidades
// ─────────────────────────────────────────────

/**
 * Genera una respuesta JSON con CORS habilitado
 */
function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
