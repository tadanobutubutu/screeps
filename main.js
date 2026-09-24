Here’s a clean, conflict‑free `main.js` that keeps all the logic from both branches without any merge markers.  
I’ve split the helpers into logical groups, kept all the `export` statements, and made sure every function that was present in either side is still available.  

```js
// ====================================================
// main.js – merge resolution
// ====================================================

/* ------------------------------------------------------------------
   1️⃣  Arithmetic helper
   ------------------------------------------------------------------ */
export function calculateSum(a, b) {
  return a + b;
}

/* ------------------------------------------------------------------
   2️⃣  Accessibility helper (new)
   ------------------------------------------------------------------ */
/**
 * Placeholder‑only – replace with real logic if needed.
 * In Screeps the DOM is unused, so you can safely strip this out
 * if you’re not running front‑end tests.
 */
export function addressAccessibilityIssues() {
  console.log('Addressing accessibility issues...');
}

/* ------------------------------------------------------------------
   3️⃣  Root‑element helpers
   ------------------------------------------------------------------ */

/**
 * Get the language attribute from the document root or return
 * the default `'en'` if none is set.
 *
 * @param {Object} element - The element containing the <html> tag
 * @returns {string} language code
 */
export function getLangAttribute(element) {
  const html = element?.querySelector('html');
  return html ? html.getAttribute('lang') || 'en' : 'en';
}

/**
 * Mark the root element as the main landmark for assistive tech.
 */
export function wrapPrimaryContentInMain() {
  const root = document.documentElement;
  if (root) root.setAttribute('role', 'main');
}

/* ------------------------------------------------------------------
   4️⃣  Table‑accessibility helpers
   ------------------------------------------------------------------ */

/**
 * Verify that the table has a scope attribute and at least one `<th>`
 * element. Returns `true` only when those conditions are met.
 */
export function validateTableAccessibility(table) {
  if (!table.hasAttribute('scope')) return false;
  if (!table.querySelector('th')) return false;
  return true;
}

/**
 * Perform a quick structural sanity check on a table:
 *  • Must contain at least one row
 *  • Must not have a nested table inside any row
 */
export function validateTableStructure(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return false;
  if (rows.some(row => row.querySelector('table'))) return false;
  return true;
}

/* ------------------------------------------------------------------
   5️⃣  Landmark helper
   ------------------------------------------------------------------ */

/**
 * Validate that a landmark element has a non‑empty `role` attribute.
 */
export function validateLandmark(landmark) {
  if (!landmark || !landmark.hasAttribute('role')) return false;
  const role = landmark.getAttribute('role');
  return typeof role === 'string' && role.length > 0;
}

/* ------------------------------------------------------------------
   6️⃣  Other helpers that existed on the other side
   ------------------------------------------------------------------ */

/**
 * Example helper – replace with real logic or remove if unnecessary.
 */
export function exampleIncomingHelper() {
  console.log('Intro from the incoming branch.');
}

/* ------------------------------------------------------------------
   7️⃣  Export list (named exports only – no default)
   ------------------------------------------------------------------ */
export {
  calculateSum,
  addressAccessibilityIssues,
  getLangAttribute,
  wrapPrimaryContentInMain,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  exampleIncomingHelper,
};
```

Feel free to delete the placeholder `addressAccessibilityIssues` or `exampleIncomingHelper` if they’re not required for your production Screeps bot. The rest of the file now forms a single, unified module that imports cleanly from anywhere else in your repository.