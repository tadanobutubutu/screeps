// main.js

// Function to wrap primary content in a main element
function wrapPrimaryContentInMain(selector) {
  // Select the primary content
  const primaryContent = document.querySelector(selector);
  
  // Check if the primary content exists
  if (primaryContent) {
    // Create a new main element
    const mainElement = document.createElement('main');
    
    // Append the primary content to the main element
    mainElement.appendChild(primaryContent);
    
    // Replace the original primary content with the main element
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  }
}

// TODO: Implement wrapPrimaryContentInMain function
wrapPrimaryContentInMain('#primary-content');

// Existing code...