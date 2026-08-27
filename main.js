// main.js

/**
 * Main application module
 */

const fs = require('fs');
const path = require('path');

/**
 * Load configuration from file
 * @param {string} configPath - Path to config file
 * @returns {Object} Configuration object
 */
function loadConfig(configPath) {
  try {
    const absolutePath = path.resolve(configPath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Process document data
 * @param {Object} data - Document data to process
 * @returns {Object} Processed result
 */
function processDocument(data) {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid data format' };
  }
  
  return {
    success: true,
    timestamp: new Date().toISOString(),
    processed: true
  };
}

/**
 * Validates that tables in the document are accessible
 * @param {Object} document - The document object containing table data
 * @returns {Object} Validation result with isValid boolean and any errors
 */
function validateTableAccessibility(document) {
  const errors = [];
  
  if (!document || !document.tables) {
    return { isValid: false, errors: ['Document or tables not found'] };
  }
  
  for (let i = 0; i < document.tables.length; i++) {
    const table = document.tables[i];
    
    // Check if table has proper headers
    if (!table.headers || table.headers.length === 0) {
      errors.push(`Table ${i + 1} is missing headers for accessibility`);
    }
    
    // Check if table has data rows
    if (!table.rows || table.rows.length === 0) {
      errors.push(`Table ${i + 1} has no data rows`);
    }
    
    // Check if headers have proper scope attributes
    if (table.headers && !table.scope) {
      errors.push(`Table ${i + 1} headers missing scope information`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates the structure of tables
 * @param {Object} document - The document object containing table data
 * @returns {Object} Validation result with isValid boolean and any errors
 */
function validateTableStructure(document) {
  const errors = [];
  
  if (!document || !document.tables) {
    return { isValid: false, errors: ['Document or tables not found'] };
  }
  
  for (let i = 0; i < document.tables.length; i++) {
    const table = document.tables[i];
    
    // Validate column consistency across rows
    if (table.headers && table.rows) {
      const headerCount = table.headers.length;
      
      for (let j = 0; j < table.rows.length; j++) {
        const row = table.rows[j];
        if (!Array.isArray(row)) {
          errors.push(`Table ${i + 1}, Row ${j + 1}: Invalid row format`);
          continue;
        }
        
        if (row.length !== headerCount) {
          errors.push(`Table ${i + 1}, Row ${j + 1}: Column count mismatch (expected ${headerCount}, got ${row.length})`);
        }
      }
    }
    
    // Validate no empty cells
    if (table.rows) {
      for (let j = 0; j < table.rows.length; j++) {
        const row = table.rows[j];
        if (Array.isArray(row)) {
          for (let k = 0; k < row.length; k++) {
            if (row[k] === null || row[k] === undefined || row[k] === '') {
              errors.push(`Table ${i + 1}, Row ${j + 1}, Column ${k + 1}: Empty cell detected`);
            }
          }
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  loadConfig,
  processDocument,
  validateTableAccessibility,
  validateTableStructure
};