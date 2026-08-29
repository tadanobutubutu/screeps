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

// Import functions from other modules if needed
const { someFunction } = require('./utils');

// Assuming the original code had a loop function, we add it here.
function loop() {
  // Your loop code here
  someFunction(); // Example usage of the imported function
}

/**
 * Count dependencies and return the number
 */
function countDependencies() {
  let count = 0;

  for (const key in require.cache) {
    const file = require.cache[key];
    if (file.parent && file.parent.filename === __filename) {
      continue;
    }
    count++;
  }

  return count;
}

/**
 * Manages focus for accessibility (ARIA best practice)
 * @param {HTMLElement} element - The element to focus on
 */
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Traps focus within a container element (useful for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @param {KeyboardEvent} event - The keyboard event
 */
function trapFocus(container, event) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcementElement = document.getElementById('sr-announcer');
  if (announcementElement) {
    announcementElement.setAttribute('aria-live', priority);
    announcementElement.textContent = '';
    // Force screen reader to announce by removing and re-adding content
    setTimeout(() => {
      announcementElement.textContent = message;
    }, 100);
  }
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
function handleKeyboardNavigation(event, orientation = 'horizontal') {
  const key = event.key;
  const isVertical = orientation === 'vertical';
  const nextKeys = isVertical ? ['ArrowDown'] : ['ArrowRight'];
  const prevKeys = isVertical ? ['ArrowUp'] : ['ArrowLeft'];

  if (nextKeys.includes(key) || prevKeys.includes(key)) {
    event.preventDefault();
    // Navigation logic handled by component-specific implementations
  }
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

// Export the validation and accessibility functions
module.exports = {
  // Node utilities
  readFile,
  writeFile,
  log,
  escapeHtml,
  countDependencies, // New function for counting dependencies
  // Table validation
  validateTableAccessibility,
  validateTableStructure,
  // Accessibility functions
  manageFocus,
  trapFocus,
  announceToScreenReader,
  handleKeyboardNavigation,
  // Main loop
  loop
};

// Export the countDependencies function separately as well
module.exports.countDependencies = countDependencies;

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