// main.js
// ... (existing imports and code above)

/**
 * Handles the rotation back functionality for the dependency graph
 */
function handleRotateBack() {
  // Implement the actual rotation logic here
  console.log('Rotating back to original view');
  // You might want to add actual rotation logic or state management here
}

// ... (existing code below)

// Example of how you might use this in a React component
// <button id="unrotate" onClick={handleRotateBack}>rotate back</button>

// New function to update table headers with proper scope attributes
function updateTableHeaders() {
  // This function would be called when the dependency graph is rendered
  // to ensure all table headers have the required scope attributes
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Call this function when the dependency graph is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);