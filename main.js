// Existing code from main.js (not shown, but must be preserved)
// ...

// New function or changes requested for REACT_025 issue
function handleMultipleMainElements() {
  // Check if the current DOM contains multiple <main> elements
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // If more than one <main> is found, replace all but the first with <section>
    Array.from(mainElements).forEach((element, index) => {
      if (index > 0) {
        element.outerHTML = `<section>${element.innerHTML}</section>`;
      }
    });
  }
}

// Assuming the function is called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', handleMultipleMainElements);

// Existing code from main.js (not shown, but must be preserved)
// ...