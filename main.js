// Assuming this is the main.js file and the following function is part of it

// ... (other code)

function renderDependencyGraph() {
  // ... (existing code to render the dependency graph)

  // Replace the anchor with a button
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Remove the anchor element
    rotateBackLink.parentNode.removeChild(rotateBackLink);

    // Create a new button element
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.onclick = function() {
      // Add the event handler for the button click if needed
      // For example, to scroll back to the top of the page:
      window.scrollTo(0, 0);
    };

    // Append the button to the parent element
    rotateBackButton.parentNode.appendChild(rotateBackButton);
  }
}

// ... (other code)