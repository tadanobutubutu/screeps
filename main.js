/**
 * main.js
 * 
 * REACT_027 Fix: Ensure <th> elements have scope attributes for accessibility.
 * Adds scope="col" to table headers that lack it, so assistive technologies
 * can programmatically associate headers with data cells.
 */

// Existing exports and functions would be preserved here.
// Only new code requested in the issue is added below.

/**
 * Fixes table structure by adding scope="col" to <th> elements
 * that do not already have a scope attribute.
 * Can be called on window load or after DOM insertion.
 */
function fixTableStructure() {
  const headers = document.querySelectorAll('th');
  headers.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

/**
 * Auto-invoke when the DOM is ready (if this script runs in a browser context).
 * In Node/Jest environments, this can be called explicitly.
 */
if (typeof window !== 'undefined' && document) {
  document.addEventListener('DOMContentLoaded', fixTableStructure);
}

/**
 * Exported for testing and manual invocation.
 */
export { fixTableStructure };

// ⚠️ PRESERVE ALL CODE ABOVE THIS LINE FROM THE ORIGINAL main.js
// ⚠️ ONLY ADD NEW FUNCTIONS/CHANGES REQUESTED IN THE ISSUE ABOVE THIS COMMENT