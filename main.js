// main.js

/**
 * Validate table accessibility
 * @param {HTMLTableElement} table
 * @returns {boolean}
 */
function validateTableAccessibility(table) {
  if (!(table instanceof HTMLTableElement)) {
    throw new Error('Expected an HTMLTableElement');
  }

  // Check for a caption
  if (!table.caption) {
    console.warn('Table is missing a caption');
  }

  // Check for header cells
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    console.warn('Table has no th elements');
  } else {
    // Ensure each th has a scope attribute
    headers.forEach(th => {
      if (!th.scope) {
        console.warn('th element should have a scope attribute');
      }
    });
  }

  // Check for proper role
  const role = table.getAttribute('role');
  if (role && role !== 'table') {
    console.warn('Table should have role="table"');
  }

  return true;
}

/**
 * Validate table structure
 * @param {HTMLTableElement} table
 * @returns {boolean}
 */
function validateTableStructure(table) {
  if (!(table instanceof HTMLTableElement)) {
    throw new Error('Expected an HTMLTableElement');
  }

  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    console.warn('Table has no rows');
    return false;
  }

  // Determine expected column count from first row
  const firstRowCells = rows[0].querySelectorAll('td, th');
  const expectedColCount = firstRowCells.length;

  // Check each row has same number of cells
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== expectedColCount) {
      console.warn(`Row ${index} has ${cells.length} cells, expected ${expectedColCount}`);
    }
  });

  // Check for thead, tbody, tfoot
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  if (thead) {
    const theadRows = thead.querySelectorAll('tr');
    if (theadRows.length === 0) {
      console.warn('thead should contain at least one row');
    }
  }
  if (tfoot) {
    const tfootRows = tfoot.querySelectorAll('tr');
    if (tfootRows.length === 0) {
      console.warn('tfoot should contain at least one row');
    }
  }

  return true;
}

module.exports = { validateTableAccessibility, validateTableStructure };