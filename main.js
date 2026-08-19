// main.js
// (Preserving all existing code and exports)

/**
 * Replaces fake links with proper buttons in the dependency graph
 */
function replaceFakeLinksWithButtons() {
  // This function would be called when the dependency graph is loaded
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Create a new button element
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = rotateBackLink.className;

    // Replace the link with the button
    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);

    // Add click event listener to maintain functionality
    button.addEventListener('click', function() {
      // Add your rotation logic here
      console.log('Rotation triggered');
    });
  }
}

// Call this function when the dependency graph is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('dependency-graph.html')) {
    replaceFakeLinksWithButtons();
  }
});

// Preserve all existing exports and functions below
// ...