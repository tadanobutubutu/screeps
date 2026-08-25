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

    // Analyze the current main element structure by reading its classes, IDs, and attributes
    // Determine if the mainElement has any existing classes and add or modify classes to match the desired structure
    if (mainElement.className) {
      // Preserve existing classes while adding any required ones
      mainElement.classList.add('primary-wrapper');
    } else {
      mainElement.className = 'primary-wrapper';
    }
  }
}

// Initialize the primary content wrapper
wrapPrimaryContentInMain('#primary-content');

// Existing code...