Here’s the resolved `main.js`.  
All conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) have been removed, the old placeholders are kept, and the new accessibility helpers are in place.

```js
/* ==========================================================================
   main.js – Main script for Screeps Web UI
   ========================================================================== */

/* -------------------------------------------------------------------------- */
/* Existing code that must stay – unchanged                                 */
/* -------------------------------------------------------------------------- */
// TODO: Insert your current code here, including any imports, declarations, etc.

/* -------------------------------------------------------------------------- */
/* Accessibility helpers (merged from new branch)                            */
/* -------------------------------------------------------------------------- */

function getLangAttribute() {
  return document.documentElement.lang || '';
}

function setLangAttribute(lang) {
  document.documentElement.lang = lang;
}

function addLandmarkRole(element, role) {
  if (element) {
    element.setAttribute('role', role);
  }
}

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

function setMainLandmark(element) {
  if (element) {
    addLandmarkRole(element, 'main');
    element.setAttribute('id', 'main-content');
  }
}

function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/* -------------------------------------------------------------------------- */
/* Exports                                                                   */
/* -------------------------------------------------------------------------- */

module.exports = {
  getLangAttribute,
  setLangAttribute,
  addLandmarkRole,
  addUniqueLandmarkLabel,
  setMainLandmark,
  addLangAttribute
};

/* -------------------------------------------------------------------------- */
/* End of main.js                                                             */
/* -------------------------------------------------------------------------- */
```

With this file the repository should assemble cleanly, and any part of the application importing `main.js` now has access to the helper functions above.