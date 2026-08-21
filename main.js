// main.js
// Fix for REACT_015: Ensure the HTML element has a lang attribute for accessibility.
// Fix for REACT_025: Remove duplicate <main> elements to improve accessibility.

function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

function removeDuplicateMainElements() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].parentNode.removeChild(mainElements[i]);
    }
  }
}

// Run immediately if in a browser environment
if (typeof window !== 'undefined') {
  ensureLangAttribute();
  removeDuplicateMainElements();
}

module.exports = { ensureLangAttribute, removeDuplicateMainElements };