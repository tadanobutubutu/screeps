// Assuming the following imports and module structure
import './docs/dependency-graph.html';
import './docs/index.html';

// Function to wrap the primary content in a <main> element
function wrapContentWithMain() {
  const primaryContent = document.querySelector('.primary-content'); // Assuming primary content has a class 'primary-content'
  if (primaryContent) {
    primaryContent.parentNode.insertBefore(document.createElement('main'), primaryContent);
    primaryContent.classList.add('main-content'); // Optionally add a class to identify the main content within the <main> element
  }
}

// Function to apply the <main> landmark to the existing HTML files
function applyMainLandmark() {
  wrapContentWithMain(); // Apply to 'dependency-graph.html'
  wrapContentWithMain(); // Apply to 'index.html'
}

// Call the function to apply changes
applyMainLandmark();