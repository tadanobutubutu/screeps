// Could you please paste the contents of `main.1.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

function checkDuplicateLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Accessibility Warning: Multiple <main> landmarks detected');
    mainElements.forEach((el, index) => {
      el.setAttribute('data-landmark-index', index);
    });
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', checkDuplicateLandmarks);
}

module.exports = { checkDuplicateLandmarks };