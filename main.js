// main.js
// Main entry point for the application

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses the HTML file
 * @param {string} filePath - Path to the HTML file
 * @returns {string} - File contents
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return null;
  }
}

/**
 * Writes content to a file
 * @param {string} filePath - Path to the output file
 * @param {string} content - Content to write
 * @returns {boolean} - Success status
 */
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    return false;
  }
}

/**
 * Logs a message with timestamp
 * @param {string} message - Message to log
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Escapes HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Validates that tables in the document are accessible
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation result with isValid and errors array
 */
function validateTableAccessibility(doc) {
  const errors = [];
  
  // Get all tables in the document
  const tables = doc.getElementsByTagName('table');
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check if table has proper headers
    const headers = table.querySelector('th');
    if (!headers) {
      errors.push({
        tableIndex: i,
        error: 'Table is missing header cells (th)'
      });
    }
    
    // Check if table has caption or summary
    const caption = table.querySelector('caption');
    const summary = table.getAttribute('summary');
    if (!caption && !summary) {
      errors.push({
        tableIndex: i,
        error: 'Table should have a caption or summary attribute'
      });
    }
    
    // Check if table cells have proper scope attributes for header cells
    const headerCells = table.querySelectorAll('th');
    for (let j = 0; j < headerCells.length; j++) {
      const scope = headerCells[j].getAttribute('scope');
      if (!scope) {
        errors.push({
          tableIndex: i,
          cellIndex: j,
          error: 'Header cell missing scope attribute'
        });
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates the structure of tables in the document
 * @param {Document} doc - The document to validate
 * @returns {Object} - Validation result with isValid and errors array
 */
function validateTableStructure(doc) {
  const errors = [];
  
  // Get all tables in the document
  const tables = doc.getElementsByTagName('table');
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    
    // Check for proper table structure (thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    if (!tbody) {
      errors.push({
        tableIndex: i,
        error: 'Table is missing tbody element'
      });
    }
    
    // Check that tables don't have nested tables
    const nestedTables = table.querySelectorAll('table');
    if (nestedTables.length > 0) {
      errors.push({
        tableIndex: i,
        error: 'Table contains nested tables'
      });
    }
    
    // Check that tables have at least one row
    const rows = table.querySelectorAll('tr');
    if (rows.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table has no rows'
      });
    }
    
    // Check for consistent cell counts in rows
    const bodyRows = tbody ? tbody.querySelectorAll('tr') : rows;
    if (bodyRows.length > 0) {
      const expectedCells = bodyRows[0].querySelectorAll('td, th').length;
      
      for (let j = 0; j < bodyRows.length; j++) {
        const cellCount = bodyRows[j].querySelectorAll('td, th').length;
        if (cellCount !== expectedCells) {
          errors.push({
            tableIndex: i,
            rowIndex: j,
            expected: expectedCells,
            actual: cellCount,
            error: 'Row has inconsistent number of cells'
          });
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Export the validation functions
module.exports = {
  readFile,
  writeFile,
  log,
  escapeHtml,
  validateTableAccessibility,
  validateTableStructure
};

// Main execution
if (require.main === module) {
  const inputFile = process.argv[2] || 'index.html';
  const outputFile = process.argv[3] || 'output.html';
  
  log(`Processing ${inputFile}...`);
  
  const content = readFile(inputFile);
  if (content) {
    log('File read successfully');
    log(`Writing output to ${outputFile}...`);
    if (writeFile(outputFile, content)) {
      log('Processing complete!');
    }
  }
}