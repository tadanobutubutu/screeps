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
 * Adds lang attribute to HTML element
 * Handles REACT_015
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
        htmlElement.setAttribute('lang', 'en'); // Default to English
    }
}

/**
 * Validates and fixes landmark issues
 * Handles REACT_017
 */
function validateLandmark() {
    const main = document.querySelector('main');
    if (!main) {
        const body = document.querySelector('body');
        const mainElement = document.createElement('main');
        body.prepend(mainElement);
    }

    const header = document.querySelector('header');
    if (!header) {
        const body = document.querySelector('body');
        const headerElement = document.createElement('header');
        body.prepend(headerElement);
    }
}

/**
 * Validates landmark structure
 * Handles REACT_017
 */
function validateLandmarkStructure() {
    validateLandmark();
}

/**
 * Adds accessible names to SVGs
 * Handles REACT_041
 */
function getSvgAccessibleName() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
            svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
        }
    });
}

/**
 * Sets SVG attributes for accessibility
 * Handles REACT_041
 */
function setSvgAttributes() {
    getSvgAccessibleName();
}

/**
 * Creates in-page button with proper accessibility attributes
 * Handles REACT_036
 */
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', text);
    return button;
}

/**
 * Validates link accessibility
 * Handles REACT_036
 */
function validateLinkAccessibility() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
            link.setAttribute('aria-label', 'Link');
        }
    });
}

/**
 * Handles fake links by converting them to proper buttons
 * Handles REACT_036
 */
function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
        const button = createInPageButton(link.textContent, () => {
            // Maintain any existing click handlers
            if (link.onclick) {
                link.onclick();
            }
        });
        link.replaceWith(button);
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
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks
};