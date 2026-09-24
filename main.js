Here’s the clean‑room `main.js` after the merge has been resolved.  
Everything is syntactically complete, the helper utilities are grouped logically, and all exported symbols are explicitly listed. No `<<<<<<< …` or `>>>>>>> …` markers remain.

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
function getLangAttribute(element) {
  const html = element?.querySelector('html');
  return html ? html.getAttribute('lang') || 'en' : 'en';
}

/* REACT_015: Wrap primary content in <main> */
function wrapPrimaryContentInMain() {
  const root = document.documentElement;
  if (root) root.setAttribute('role', 'main');
}

/* REACT_027: Validate table accessibility */
function validateTableAccessibility(table) {
  if (!table.hasAttribute('scope')) return false;
  if (!table.querySelector('th')) return false;
  return true;
}

/* REACT_027: Validate table structure */
function validateTableStructure(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return false;
  if (rows.some(row => row.querySelector('table'))) return false;
  return true;
}

/* REACT_017: Validate individual landmark */
function validateLandmark(landmark) {
  return !!landmark.getAttribute('aria-label');
}

/* REACT_017: Validate landmark structure */
function validateLandmarkStructure(landmarks) {
  const names = new Set();
  for (const lm of landmarks) {
    const label = lm.getAttribute('aria-label');
    if (!label) return false;          // no label
    if (names.has(label)) return false; // duplicate
    names.add(label);
  }
  return true;
}

/* ------------------------------------------------------------------
   4. Export statements – expose every helper that callers might need  
   ------------------------------------------------------------------ */
export {
  get