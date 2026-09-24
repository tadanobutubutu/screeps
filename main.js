Below is a clean, conflict‑free `main.js`.  
All functions that were defined in the *HEAD* section are kept, the placeholder code from the other branch is dropped, and I’ve added a proper export list at the bottom so that the rest of the repo can import any of the helpers that you need.

```js
/* ==================================================
   main.js – merge resolution
   ================================================== */

/* ------------------------------------------------------------------
   1. Arithmetic helper  
   ------------------------------------------------------------------ */
export function calculateSum(a, b) {
  return a + b;
}

/* ------------------------------------------------------------------
   2. Accessibility helper (new)  
   ------------------------------------------------------------------ */
export function addressAccessibilityIssues() {
  // Placeholder – swap out for real logic later
  console.log('Addressing accessibility issues...');
}

/* ------------------------------------------------------------------
   3. Existing accessibility logic (from the earlier branch)  
   ------------------------------------------------------------------ */

/* REACT_015: Get language attribute from the root <html> element */
export function getLangAttribute(element) {
  const html = element?.querySelector('html');
  return html ? html.getAttribute('lang') || 'en' : 'en';
}

/* REACT_015: Wrap primary content in <main> */
export function wrapPrimaryContentInMain() {
  const root = document.documentElement;
  if (root) root.setAttribute('role', 'main');
}

/* REACT_027: Validate table accessibility */
export function validateTableAccessibility(table) {
  if (!table.hasAttribute('scope')) return false;
  if (!table.querySelector('th')) return false;
  return true;
}

/* REACT_027: Validate table structure */
export function validateTableStructure(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return false;
  if (rows.some(row => row.querySelector('table'))) return false;
  return true;
}

/* REACT_017: Validate individual landmark */
export function validateLandmark(landmark) {
  // Basic stub – feel free to flesh out the real validation logic.
  if (!landmark || !landmark.hasAttribute('role')) return false;
  const role = landmark.getAttribute('role');
  return typeof role === 'string' && role.length > 0;
}

/* ------------------------------------------------------------------
   Export list
   ------------------------------------------------------------------ */
export {
  calculateSum,
  addressAccessibilityIssues,
  getLangAttribute,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark
};
```

Please replace any placeholder logic (e.g., `addressAccessibilityIssues` or `validateLandmark`) with the real implementation you need. Once you commit this file, the merge conflict markers will be gone and the project should build normally. Happy coding!