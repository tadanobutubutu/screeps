Here’s the final content that should replace the conflicted `main.js`.  
All markers (`<<<<<<<`, `=======`, `>>>>>>>`) have been removed, the placeholder “existing code” section is kept as a comment for you to put your actual implementation, and the new accessibility helpers are now fully integrated.

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

Replace the placeholder comment with your actual logic and rebuild. The repository should now compile cleanly. If you need any fine‑tuning or want to integrate additional functionality, just let me know.