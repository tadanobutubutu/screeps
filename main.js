// main.js - Accessibility fix for REACT_036

document.addEventListener('DOMContentLoaded', function() {
  // Get the unrotate element
  const unrotateButton = document.getElementById('unrotate');
  
  if (unrotateButton) {
    // Replace the anchor tag with a button element for proper accessibility
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = unrotateButton.className;
    
    // Copy any inline styles
    if (unrotateButton.style.cssText) {
      button.style.cssText = unrotateButton.style.cssText;
    }
    
    // Copy data attributes
    Array.from(unrotateButton.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Replace the anchor with button
    unrotateButton.parentNode.replaceChild(button, unrotateButton);
    
    // Add the click handler
    button.addEventListener('click', function() {
      document.body.classList.remove('rotated');
      button.style.display = 'none';
    });
  }

  // Any other existing code in main.js would continue here...
  // Example: other event listeners, initialization logic, etc.
});