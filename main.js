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

    // Additional logic from the conflicting changes
    /*
    Analyze the current main element structure by reading its classes, IDs, and attributes.
    Determine if the mainElement has any existing classes and add or modify classes to match the desired structure.
    */
    analyzeMainElementStructure(mainElement);
  }
}

// Analyze the main element structure by reading its classes, IDs, and attributes.
// Determine if the mainElement has any existing classes and add or modify classes to match the desired structure.
function analyzeMainElementStructure(mainElement) {
  // Get existing classes from the main element
  const existingClasses = mainElement.className;
  
  // Check if the mainElement has any existing classes
  if (existingClasses && existingClasses.length > 0) {
    // Add or modify classes to match the desired structure
    mainElement.classList.add('main-wrapper');
  } else {
    // Set default class for the main element
    mainElement.className = 'main-wrapper';
  }
  
  // Preserve existing ID as a data attribute if it exists
  const existingId = mainElement.id;
  if (existingId) {
    mainElement.setAttribute('data-original-id', existingId);
  }
}

// Export the wrapPrimaryContentInMain function
module.exports = { wrapPrimaryContentInMain };