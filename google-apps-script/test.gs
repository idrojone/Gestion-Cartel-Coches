/**
 * Test para obtener datos de la hoja 'coches_compact'
 */
function testCochesCompact() {
  const sheetName = 'coches_compact';
  
  Logger.log('Iniciando prueba de lectura para la hoja: ' + sheetName);
  
  try {
    // Usamos la función interna getSheetData_ definida en Code.gs
    const result = getSheetData_(sheetName);
    
    Logger.log('--- RESULTADO ---');
    Logger.log('Estado: OK');
    Logger.log('Total registros: ' + result.count);
    
    if (result.count > 0) {
      Logger.log(JSON.stringify(result.data));
    } else {
      Logger.log('La hoja está vacía o no tiene datos.');
    }
    
  } catch (e) {
    Logger.log('--- ERROR ---');
    Logger.log(e.toString());
  }
}
