Here’s a clean‑room version of `main.js` with the conflict markers removed.  
Feel free to drop your actual imports, state‑persistence logic, and route
handlers where the `// TODO` comment is.

```js
/* ==========================================================================
   main.js – Main script for Screeps Web UI
   ========================================================================== */

/* -------------------------------------------------------------------------- */
/* Existing code that must stay – unchanged                                 */
/* -------------------------------------------------------------------------- */
// TODO: Insert your current code here, including any imports, declarations,
//       state loaders, route registrations, etc.

////////////////////////////////////////////////////////////////////////////////
// Accessibility helpers – merged from the incoming branch
////////////////////////////////////////////////////////////////////////////////

/**
 * Return the current language attribute of the `<html>` element.
 */
function getLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * Override the language attribute of the `<html>` element.
 * @param {string} lang – e.g. "en", "fr", etc.
 */
function setLangAttribute(lang) {
  document.documentElement.lang = lang;
}

/**
 * Assign a landmark role (e.g. "navigation", "banner") to the element.
 * @param {Element} element
 * @param {string} role
 */
function addLandmarkRole(element, role) {
  if (element) {
    element.setAttribute('role', role);
  }
}

/**
 * Give an element a unique ID that is derived from the supplied baseId.
 * Useful for ARIA landmarks that need distinct ids.
 * @param {Element} element
 * @param {string} baseId
 * @returns {string|null}
 */
function addUniqueLandmarkLabel(element, baseId) {
  if (element) {
    const uniqueId =
      `${baseId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    element.setAttribute('id', uniqueId);
    return uniqueId;
  }
  return null;
}

/**
 * Designate the main content region.
 * @param {Element} element
 */
function setMainLandmark(element) {
  if (element) {
    addLandmarkRole(element, 'main');
    element.setAttribute('id', 'main-content');
  }
}

/**
 * Ensure that the `<html>` tag always has a language attribute.
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
  getLangAttribute,
  setLangAttribute,
  addLandmarkRole,
  addUniqueLandmarkLabel,
  setMainLandmark,
  addLangAttribute,
  /* TODO: export any additional helpers, routers, middleware, etc. that your
           application requires. */
};

////////////////////////////////////////////////////////////////////////////////
// End of main.js
////////////////////////////////////////////////////////////////////////////////
```

### How to finish the merge

1. **Replace the `// TODO` block** with whatever you normally put in `main.js`
   – imports, initialisation logic, Zustand stores, Express/koa routes, etc.
2. **Test the bundle**  
   ```bash
   npm run build   # or yarn build
   node dist/server.js  # or whatever your start script is
   ```
   Make sure no syntax errors pop up.
3. **Commit**  
   ```bash
   git add main.js
   git commit -m "Resolve merge conflict in main.js – merge accessibility helpers"
   ```

That’s it. Once the file builds, your merge is clean and the accessibility
helpers from the feature branch are now part of your production code.