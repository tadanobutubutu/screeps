// existing code preserved

// New function to resolve the issue
function fixMultipleMainLandmarks() {
  // Check if the component has multiple <main> elements
  if (document.querySelectorAll('main').length > 1) {
    // Find the first <main> element
    const firstMain = document.querySelector('main');
    // Loop through all other <main> elements
    document.querySelectorAll('main:not(:first-of-type)').forEach((main) => {
      // Replace each additional <main> with a <section> element
      main.parentNode.replaceChild(document.createElement('section'), main);
    });
    // Optionally, you could add some logic here to set the 'aria-labelledby' attribute
    // on the first <main> to reference the <section> elements that replace the other <main> elements
  }
}

// Add the new function to the existing exports, ensuring to preserve all current exports
export {
  // ... other exports ...
  fixMultipleMainLandmarks,
};

// Ensure that the existing code and exports are not removed or renamed
// existing code preserved