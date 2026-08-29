const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

function ensureUniqueLandmarks(landmarks) {
    const uniqueLandmarks = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        // Use id if available, otherwise fall back to name
        const key = landmark.id || landmark.name;

        if (key && !seen.has(key)) {
            seen.add(key);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

/**
 * Adds the lang attribute to the HTML element.
 * @param {HTMLElement} el - The HTML element (typically <html>)
 * @returns {string|null} The language code, e.g., 'en', or null if not set.
 */
function getLangAttribute(el) {
  return el.getAttribute('lang') || 'en';
}

/**
 * Extracts the name of a person from their data object.
 * @param {Object} person - A person object that must have a 'name' property.
 * @returns {string} The person's name.
 */
function personName(person) {
  return person.name;
}

/**
 * Validates that a table has a basic accessible structure.
 * Checks for presence of header row and proper column definitions.
 * @param {HTMLElement} table - The table element.
 * @returns {boolean} True if the table appears accessible, false otherwise.
 */
function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object') return false;
  // Check for header row
  const headerRow = table.querySelector('thead');
  if (!headerRow) return false;
  // Check for body
  const tbody = table.querySelector('tbody');
  if (!tbody) return false;
  // Ensure at least one row exists
  const rows = Array.from(tbody.querySelectorAll('tr'));
  if (rows.length === 0) return false;
  // Basic check: each row should have at least one cell
  return rows.every(row => row.children.length > 0);
}

/**
 * Validates the overall table structure for consistency.
 * Ensures uniform column count and proper header mapping.
 * @param {HTMLElement} table - The table element.
 * @returns {boolean} True if the table passes structural checks.
 */
function validateTableStructure(table) {
  if (!table || typeof table !== 'object') return false;
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) return false;
  const cols = headerRow.querySelectorAll('th');
  if (cols.length === 0) return false;
  const expectedCols = cols.length;
  const rows = table.querySelectorAll('tr');
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td, th');
    if (cells.length !== expectedCols) {
      console.warn(`Row ${i} has ${cells.length} cells, expected ${expectedCols}`);
      return false;
    }
  }
  return true;
}

/**
 * Generates an accessible name for an SVG element.
 * Tries to use the element's own aria-label, otherwise falls back to a generic description.
 * @param {HTMLElement} svg - The SVG element.
 * @returns {string} An accessible name.
 */
function getSvgAccessibleName(svg) {
  if (svg && svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  // Fallback: describe the SVG content
  return 'SVG graphic';
}

/**
 * Creates an accessible button element for inline usage.
 * @param {string} text - The visible text of the button.
 * @param {string} [href] - Optional URL for the button.
 * @returns {HTMLElement} The created button element.
 */
function createInPageButton(text, href) {
  const btn = document.createElement('button');
  btn.textContent = text;
  if (href) {
    btn.href = href;
  }
  return btn;
}

module.exports = {
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    createInPageButton
};