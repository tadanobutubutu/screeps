Here’s a clean, conflict‑free version of **`main.js`** that merges everything from both sides while keeping the `HEAD` logic and adding the new helper functions.  
Feel free to tweak the placeholder parts (like the accessibility stubs) to better match your actual Screeps gameplay or utility needs.

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
  // TODO: replace this stub with real logic.
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
  if (!landmark || !landmark.hasAttribute('role')) return false;
  const role = landmark.getAttribute('role');
  return typeof role === 'string' && role.length > 0;
}

/* ------------------------------------------------------------------
   4. Export list
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

### How the merge was handled

1. **Kept all `HEAD`‑only content** – arithmetic helper, accessibility helper stubs, and the table/landmark validation functions.
2. **Dropped placeholder code** from the other branch that simply said “add my own stuff here”.
3. Unified all exported symbols into a single explicit export block so consumers of the module don’t need to worry about default vs named exports.

**Next steps**

- Replace the stub in `addressAccessibilityIssues()` with real logic that fits your Screeps game logic (e.g., logging, AI decisions, etc.).
- If you decide to drop or rename any helper, adjust the export block accordingly.
- Run your test harness (or a simple Node script) to confirm all functions behave as expected.

That should satisfy the merge conflict and leave you with a clean, maintainable JavaScript module. Happy coding!