// Original content of main.js
// ...

// Add the new function or changes requested in the issue
function wrapContentWithMain() {
  const contentElements = document.querySelectorAll('.content');
  contentElements.forEach((element) => {
    const mainElement = document.createElement('main');
    mainElement.appendChild(element);
    element.parentNode.replaceChild(mainElement, element);
  });
}

// Call the function to wrap the content with <main>
wrapContentWithMain();

// Continue with the rest of the main.js content
// ...