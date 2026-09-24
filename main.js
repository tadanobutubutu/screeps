Here’s the fully cleaned‑up version of `main.js`.  
Just drop your real imports / declarations into the marked section, then commit and run the server again.  

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

**Next steps**

1. **Add your own implementation** – replace the `// TODO: …` line with the imports, state‑persistence, route handlers, etc., that your current project uses.
2. **Test** – run the build (`npm run build`) and start the server to confirm no syntax errors.
3. **Commit** – once the file works, `git add main.js && git commit -m "Resolve merge conflict in main.js"`.

If you hit any snags while inserting your code or need tweaks to the helper functions, just let me know!