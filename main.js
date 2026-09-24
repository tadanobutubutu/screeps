// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (usually in index.html, but can be added here for dynamic content.)

// REACT_015: Add lang attribute helper
function setHtmlLang(document, lang) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
}

// Export all functions for testing
export {
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute,
  setHtmlLang // Add this new export
};