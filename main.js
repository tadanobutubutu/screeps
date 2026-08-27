// TODO: Add back any required exports that might have been removed
// Here’s an example of how to export a required function from another file:
// Import functions from other modules if needed
// const { someFunction } = require('./utils');

/**
 * Adds proper ARIA landmark regions to the document by ensuring
 * that common structural elements have the appropriate `role`
 * attributes. This improves accessibility for screen-reader users.
 *
 * If an element already has an explicit `role` (other than an empty
 * string) it is left untouched so we never override intentional markup.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') {
    return;
  }

  const landmarks = [
    { selector: 'header:not([role]), [data-landmark="banner"]', role: 'banner' },
    { selector: 'nav:not([role]), [data-landmark="navigation"]', role: 'navigation' },
    { selector: 'main:not([role]), [data-landmark="main"]', role: 'main' },
    { selector: 'aside:not([role]), [data-landmark="complementary"]', role: 'complementary' },
    { selector: 'footer:not([role]), [data-landmark="contentinfo"]', role: 'contentinfo' },
    { selector: 'form:not([role]), [data-landmark="search"]', role: 'search' },
    { selector: 'section[data-landmark="region"], section[aria-label]:not([role])', role: 'region' }
  ];

  landmarks.forEach(function (entry) {
    const elements = document.querySelectorAll(entry.selector);
    elements.forEach(function (el) {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', entry.role);
      }
    });
  });
}

module.exports = {
  addProperLandmarkRegions
};