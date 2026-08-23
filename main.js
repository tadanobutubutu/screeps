// Original main.js content
// ...

// Add the new functions or changes requested in the issue
function wrapPrimaryContentWithMain() {
  const primaryContentSelector = 'div.container'; // Assuming the primary content is wrapped in a div with class 'container'
  const mainElement = document.createElement('main');

  // Clone the primary content and append it to the main element
  const primaryContent = document.querySelector(primaryContentSelector).cloneNode(true);
  mainElement.appendChild(primaryContent);

  // Replace the original primary content with the main element
  const originalContentParent = document.querySelector(primaryContentSelector).parentNode;
  originalContentParent.replaceChild(mainElement, document.querySelector(primaryContentSelector));
}

// Assuming the script is run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', wrapPrimaryContentWithMain);

// ...