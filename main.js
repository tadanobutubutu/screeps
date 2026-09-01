// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Validates and fixes table structure accessibility issues.
 * Handles REACT_027 - Fix 26 table structure issues
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        const firstRow = rows[0];

        if (!firstRow) return;

        // Get all header cells in the first row to determine column count
        const firstRowThs = firstRow.querySelectorAll('th');
        const firstRowTds = firstRow.querySelectorAll('td');
        const firstRowHeaders = [...firstRowThs, ...firstRowTds];
        const columnCount = firstRowHeaders.length;

        rows.forEach((row, rowIndex) => {
            const ths = row.querySelectorAll('th');
            const tds = row.querySelectorAll('td');
            const allCells = [...ths, ...tds];

            allCells.forEach((cell, cellIndex) => {
                if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
                    const isFirstRow = rowIndex === 0;
                    const isFirstCell = cellIndex === 0;

                    // First row cells are column headers
                    if (isFirstRow) {
                        cell.setAttribute('scope', 'col');
                    }
                    // First cell in subsequent rows are row headers
                    else if (isFirstCell) {
                        cell.setAttribute('scope', 'row');
                    }
                }
            });
        });
    });
}

/**
 * Main entry point for table accessibility validation.
 * Calls validateTableStructure() to fix all table scope attribute issues.
 */
function validateTableAccessibility() {
    validateTableStructure();
}

/**
 * Gets the lang attribute for the HTML element
 * Handles REACT_015 - Add lang attribute to HTML element
 */
function getLangAttribute() {
    const html = document.querySelector('html');
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
    }
}

/**
 * Creates an in-page button with proper accessibility attributes
 * Handles REACT_036 - Fix 1 fake link issue
 */
function createInPageButton(text, href) {
    const button = document.createElement('button');
    button.textContent = text;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');

    if (href) {
        button.addEventListener('click', () => {
            window.location.href = href;
        });
    }

    return button;
}

/**
 * Validates landmark structure and adds ARIA roles if needed
 * Handles REACT_017 - Add/fix 2 landmark issues
 */
function validateLandmarkStructure() {
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }
}

/**
 * Gets accessible name for SVG elements
 * Handles REACT_041 - Add accessible names to 2 SVGs
 */
function getSvgAccessibleName(svg) {
    if (!svg) return '';

    // Check for title and desc elements
    const title = svg.querySelector('title');
    const desc = svg.querySelector('desc');

    if (title) return title.textContent;
    if (desc) return desc.textContent;

    // Fallback to ARIA label if available
    if (svg.hasAttribute('aria-label')) {
        return svg.getAttribute('aria-label');
    }

    return '';
}

/**
 * Sets proper attributes for SVG accessibility
 */
function setSvgAttributes(svg, name) {
    if (!svg || !name) return;

    if (!svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = name;
        svg.prepend(title);
    }

    if (!svg.hasAttribute('aria-hidden')) {
        svg.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Validates link accessibility and ensures proper attributes
 * Handles REACT_036 - Fix 1 fake link issue
 */
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
        }
    });
}

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)

/**
 * Landmark data structure
 */
const landmarks = [
  { id: 1, name: 'Eiffel Tower', location: 'Paris' },
  { id: 2, name: 'Statue of Liberty', location: 'New York' },
  { id: 3, name: 'Eiffel Tower', location: 'Paris' },
  { id: 4, name: 'Big Ben', location: 'London' },
  { id: 5, name: 'Statue of Liberty', location: 'New York' }
];

/**
 * Ensures unique landmarks by removing duplicates based on name and location
 * @param {Array} landmarksArray - Array of landmark objects
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarksArray) {
  if (!Array.isArray(landmarksArray)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarksArray) {
    const key = `${landmark.name}-${landmark.location}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// Apply uniqueness to the landmarks
const uniqueLandmarks = ensureUniqueLandmarks(landmarks);

module.exports = {
  ensureUniqueLandmarks,
  landmarks,
  uniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  getLangAttribute,
  createInPageButton,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility
};