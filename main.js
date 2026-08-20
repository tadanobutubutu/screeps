// main.js

// Add a custom function to generate the main structure
function wrapContentInMain(element) {
  const mainElement = document.createElement('main');
  mainElement.appendChild(element);
  element.parentNode.replaceChild(mainElement, element);

  // Add an ID to the main element for easier referencing (optional)
  mainElement.id = "main";
}

// Call the function on the appropriate elements
wrapContentInMain(document.querySelector("#table-rotated")); // For docs/dependency-graph.html
wrapContentInMain(document.querySelector(".container")); // For docs/index.html
wrapContentInMain(document.querySelector("body")); // For app/layout.tsx and dashboard/app/layout.tsx