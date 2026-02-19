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
 * Punto de entrada para peticiones POST
 * Soporta action: 'insert' para añadir filas a una hoja
 * Soporta action: 'update' para modificar filas existentes
 *
 * Body esperado (JSON) para insert:
 *   { "action": "insert", "sheet": "Clientes", "data": { "DNI": "12345678A", ... } }
 *
 * Body esperado (JSON) para update:
 *   { 
 *     "action": "update", 
 *     "sheet": "Dashboard", 
 *     "row": 123,  // Opcional si se usa match
 *     "match": { "col": "ID Caso", "val": "V-123456" }, // Opcional si se usa row
 *     "data": { "Estado Viabilidad": "✅ VIABLE" } 
 *   }
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = (body.action || '').toLowerCase();
    const sheetName = body.sheet;
    const data = body.data;

    if (!sheetName || !data) {
      return jsonResponse_({ status: 'error', message: 'Parámetros "sheet" y "data" son requeridos.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return jsonResponse_({ status: 'error', message: 'Hoja "' + sheetName + '" no encontrada.' });
    }

    // Leer cabeceras de la primera fila
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function(h) {
      return String(h).trim();
    });

    // ─────────────────────────────────────────────
    //  INSERT
    // ─────────────────────────────────────────────
    if (action === 'insert') {
      // Construir la fila nueva mapeando data a las columnas correctas
      var newRow = headers.map(function(header) {
        return data[header] !== undefined ? data[header] : '';
      });

      // Añadir la fila al final
      sheet.appendRow(newRow);
      var insertedRow = sheet.getLastRow();

      return jsonResponse_({
        status: 'ok',
        message: 'Fila insertada correctamente.',
        sheet: sheetName,
        row: insertedRow
      });
    }

    // ─────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────
    else if (action === 'update') {
      let rowIndex = -1;

      // Opción A: Actualizar por número de fila directo
      if (body.row) {
        rowIndex = parseInt(body.row, 10);
      }
      // Opción B: Buscar fila por columna (ej: ID Caso)
      else if (body.match && body.match.col && body.match.val) {
        const colIndex = headers.indexOf(body.match.col);
        if (colIndex === -1) {
          return jsonResponse_({ status: 'error', message: `Columna "${body.match.col}" no encontrada en encabezados.` });
        }
        
        // Leer toda la columna para buscar (esto podría optimizarse pero es simple)
        // DataRange empieza en fila 1, pero values[0] es fila 1.
        // Queremos buscar a partir de fila 2 (índice 1 en array).
        const allData = sheet.getDataRange().getValues();
        // findIndex devuelve índice en el array. La fila en sheet es índice + 1.
        
        const matchVal = String(body.match.val).trim().toUpperCase();

        const foundIdx = allData.findIndex((row, idx) => {
          if (idx === 0) return false; // saltar cabecera
          return String(row[colIndex]).trim().toUpperCase() === matchVal;
        });

        if (foundIdx !== -1) {
          rowIndex = foundIdx + 1; // Convertir a 1-based del Sheet
        }
      }

      if (rowIndex < 2) { // 1 es cabecera, así que mínimo 2
        return jsonResponse_({ status: 'error', message: 'No se encontró la fila para actualizar.' });
      }

      // Actualizar celdas específicas
      // Recorremos los keys de 'data' y actualizamos solo esos
      Object.keys(data).forEach(key => {
        const colIdx = headers.indexOf(key);
        if (colIdx !== -1) {
          // getRange(row, col) -> col es 1-based
          sheet.getRange(rowIndex, colIdx + 1).setValue(data[key]);
        }
      });

      return jsonResponse_({
        status: 'ok',
        message: 'Fila actualizada correctamente.',
        sheet: sheetName,
        row: rowIndex
      });
    }

    else {
      return jsonResponse_({ status: 'error', message: 'Acción POST no soportada: ' + action });
    }

  } catch (error) {
    return jsonResponse_({
      status: 'error',
      message: error.message
    });
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
    const obj = { _row: index + 2 }; // index 0 es la primera fila de datos (Excel row 2)
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
      const obj = { _row: index + 2 };
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
