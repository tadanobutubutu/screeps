// Existing code from main.js that needs to be preserved
// ... (code between conflict markers, if any)

// Add the new function or changes requested in the issue
function wrapContentWithMain() {
  const mainElements = document.querySelectorAll('html body > div');

  mainElements.forEach((element) => {
    const mainTag = document.createElement('main');
    mainTag.appendChild(element);
    element.parentNode.replaceChild(mainTag, element);
  });
}

// Call the function to wrap the primary content with <main>
wrapContentWithMain();

// ... (rest of the main.js code)