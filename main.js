// main.js

// TODO: Implement this function for checking table structure
function checkTableStructure(table, schema) {
  if (!table || !Array.isArray(table)) {
    return { valid: false, error: 'Table must be an array' };
  }

  if (!schema || !schema.columns) {
    return { valid: false, error: 'Schema must define columns' };
  }

  const requiredColumns = schema.columns;
  const tableColumns = table.length > 0 ? Object.keys(table[0]) : [];

  for (const required of requiredColumns) {
    const columnName = typeof required === 'string' ? required : required.name;
    if (!tableColumns.includes(columnName)) {
      return { 
        valid: false, 
        error: `Missing required column: ${columnName}` 
      };
    }
  }

  if (schema.primaryKey) {
    const pkColumns = Array.isArray(schema.primaryKey) 
      ? schema.primaryKey 
      : [schema.primaryKey];
    
    for (const pk of pkColumns) {
      if (!tableColumns.includes(pk)) {
        return { 
          valid: false, 
          error: `Primary key column not found: ${pk}` 
        };
      }
    }
  }

  return { valid: true };
}

// Placeholder for other existing functions
function initializeApp() {
  return 'App initialized';
}

function processData(data) {
  return data;
}

module.exports = {
  checkTableStructure,
  initializeApp,
  processData
};