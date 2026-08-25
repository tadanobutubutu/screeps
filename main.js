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

    // Analyze the current main element structure by reading its classes, IDs, and attributes.
    // Determine if the mainElement has any existing classes and add or modify classes to match the desired structure.
    const existingClasses = mainElement.className;
    const desiredClasses = 'primary-main';
    if (existingClasses) {
      mainElement.className = `${existingClasses} ${desiredClasses}`;
    } else {
      mainElement.className = desiredClasses;
    }
  }
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
wrapPrimaryContentInMain('#primary-content');

// Existing code...