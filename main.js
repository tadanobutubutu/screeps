// main.js
// Fix for REACT_015: Ensure the HTML element has a lang attribute for accessibility.

function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

// Run immediately if in a browser environment
if (typeof window !== 'undefined') {
  ensureLangAttribute();
}

module.exports = { ensureLangAttribute };