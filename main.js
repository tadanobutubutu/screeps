// TODO: Implement this function for checking table structure

function checkTableStructure(table, schema) {
  if (!table || !Array.isArray(table) || table.length === 0) {
    return false;
  }
  
  if (!schema || !schema.columns || !Array.isArray(schema.columns)) {
    return false;
  }

  const firstRow = table[0];
  const tableColumns = Object.keys(firstRow);

  for (const requiredColumn of schema.columns) {
    if (!tableColumns.includes(requiredColumn)) {
      return false;
    }
  }

  if (schema.required) {
    for (const row of table) {
      for (const requiredField of schema.required) {
        if (row[requiredField] === undefined || row[requiredField] === null) {
          return false;
        }
      }
    }
  }

  return true;
}

function validateTableData(table, schema) {
  if (!checkTableStructure(table, schema)) {
    return { valid: false, errors: ['Table structure does not match schema'] };
  }

  const errors = [];

  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    
    if (schema.types) {
      for (const [column, expectedType] of Object.entries(schema.types)) {
        if (row[column] !== undefined) {
          const actualType = typeof row[column];
          if (actualType !== expectedType) {
            errors.push(`Row ${i + 1}: Column "${column}" has type ${actualType}, expected ${expectedType}`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

module.exports = { checkTableStructure, validateTableData };