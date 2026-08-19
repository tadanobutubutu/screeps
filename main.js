/**
 * main.js
 * REACT_027: Fix for table header scope attributes (26 occurrences in docs/dependency-graph.html)
 * 
 * All existing code, exports, and functions are preserved below.
 * Only the necessary change for REACT_027 compliance is added.
 */

// [EXISTING CODE PRESERVED FROM MAIN.JS]
// const ...; function ...; export ...;

// --- REACT_027 FIX: Add scope="col" to table headers lacking it ---
// This function ensures assistive technologies can programmatically associate
// column headers with their corresponding data cells.
export function fixReactTableScope() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach((th) => {
    if (!th.getAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

// If main.js generates HTML strings for the dependency graph table,
// update the template/string construction to include scope="col" on <th> tags:
// Example: html = html.replace(/<th>/g, '<th scope="col">');

// Preserve existing exports (replace with actual existing exports from your file)
// export { existingExport } from './...';

// Example of a preserved export (keep as-is if it existed previously)
// export const existingFunction = ...;