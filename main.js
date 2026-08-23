// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or changes requested in the issue
function wrapContentWithMain() {
  const contentToWrap = document.querySelectorAll('html > body > .container, html > body > table');

  contentToWrap.forEach((element) => {
    const mainElement = document.createElement('main');
    mainElement.appendChild(element);
    element.parentNode.replaceChild(mainElement, element);
  });
}

// Call the function to wrap the content in <main>
wrapContentWithMain();

// ... (Preserve all existing code, exports, and functions)