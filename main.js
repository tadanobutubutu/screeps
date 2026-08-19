const UNROTATE_ID = 'unrotate';

/**
 * Ensures only one main landmark exists in the document
 * @param {HTMLElement} element - The element to check for main landmarks
 */
function ensureSingleMainLandmark(element) {
  const mains = element.querySelectorAll('main');
  if (mains.length > 1) {
    // Convert all but the first main to section elements
    for (let i = 1; i < mains.length; i++) {
      const section = document.createElement('section');
      while (mains[i].firstChild) {
        section.appendChild(mains[i].firstChild);
      }
      mains[i].replaceWith(section);
    }
  }
}

// Run the check when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureSingleMainLandmark(document.body);
});

// Also run on React hydration complete (if using React)
if (typeof window !== 'undefined' && window.React) {
  const originalRender = window.ReactDOM.render;
  window.ReactDOM.render = function(...args) {
    const result = originalRender.apply(this, args);
    ensureSingleMainLandmark(document.body);
    return result;
  };
}