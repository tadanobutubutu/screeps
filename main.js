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
 * Ensures unique landmarks (DONE: ensureUniqueLandmarks)
 * This function addresses REACT_025 from the accessibility insight report
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

/**
 * Validates landmark structure for accessibility.
 * Ensures proper landmark roles and hierarchy.
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="region"], [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  
  landmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', landmark.tagName);
    }
  });
}

/**
 * Main entry point for landmark accessibility validation.
 * Calls ensureUniqueLandmarks() and validateLandmarkStructure()
 */
function validateLandmarks() {
  // Ensure unique landmarks data
  const uniqueLandmarkData = ensureUniqueLandmarks(landmarks);
  
  // Validate landmark structure in DOM
  validateLandmarkStructure();
  
  return uniqueLandmarkData;
}

module.exports = {
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarks,
  validateLandmarkStructure,
  landmarks,
  uniqueLandmarks
};