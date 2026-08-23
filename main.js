// Existing code and exports from main.js

// Add new function or changes requested in the issue
function wrapContentWithMain() {
  const contentToWrap = document.querySelectorAll('div.container, table#table-rotated');

  contentToWrap.forEach((content) => {
    const mainElement = document.createElement('main');
    mainElement.appendChild(content);
    content.parentNode.replaceChild(mainElement, content);
  });
}

// Call the function to wrap the content with <main>
wrapContentWithMain();

// Preserve all existing code, exports, and functions
// ...

// Output the complete updated main.js content