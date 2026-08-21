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

// Function added in the first branch
function additionalFunction(creep, target) {
  // Function implementation
}

// Function added as modification to 'missingFunction'
function missingFunction() {
  // Modified function implementation
}

module.exports = {
  checkDuplicateLandmarks,
  additionalFunction,
  missingFunction
};