// main.js
// Fix for REACT_015: Ensure the HTML element has a lang attribute for accessibility.
// Fix for REACT_017: Add a <main> landmark to wrap the primary content for accessibility.

function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

function wrapPrimaryContentInMain() {
  if (typeof document !== 'undefined') {
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      const primaryContent = document.querySelector('body > *');
      if (primaryContent) {
        primaryContent.insertAdjacentHTML('afterbegin', '<main>');
        primaryContent.insertAdjacentHTML('beforeend', '</main>');
      }
    }
  }
}

// Run immediately if in a browser environment
if (typeof window !== 'undefined') {
  ensureLangAttribute();
  wrapPrimaryContentInMain();
}

module.exports = { ensureLangAttribute, wrapPrimaryContentInMain };