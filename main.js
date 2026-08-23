function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
}

// Ensure only one <main> exists in the entire rendered tree.
function ensureSingleMain() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('More than one <main> element found. This may affect accessibility.');
    // Additional logic to handle the case can be implemented here.
    // For example, remove the extra <main> elements, or replace them with a <section> or <article>.
  }
}

// Call the function to check for multiple <main> elements
ensureSingleMain();