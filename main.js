export const handleRotateBack = () => {
  // Handle the rotate back functionality here
  document.body.style.transform = 'rotate(0deg)';
  document.body.style.transition = 'transform 0.3s ease';
};

document.addEventListener('DOMContentLoaded', function() {
  // Preserve existing code from main.js
  const unrotateElement = document.getElementById('unrotate');
  
  if (unrotateElement && unrotateElement.tagName === 'A') {
    // Create a button to replace the fake link for better accessibility
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = unrotateElement.textContent;
    
    // Preserve classes and inline styles
    button.className = unrotateElement.className;
    if (unrotateElement.style.cssText) {
      button.style.cssText = unrotateElement.style.cssText;
    }
    
    // Add click handler for rotate back functionality
    button.addEventListener('click', function() {
      // Rotate back to original position
      handleRotateBack();
    });
    
    // Replace the anchor with the button
    unrotateElement.parentNode.replaceChild(button, unrotateElement);
  }

  // Wrap the primary content in a <main> element for accessibility
  function wrapPrimaryContentWithMain() {
    const primaryContent = document.querySelector('table[id="table-rotated"], .container');
    if (primaryContent) {
      // Check if a <main> element already exists
      const existingMain = document.querySelector('main');
      if (!existingMain) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(primaryContent);
        primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      } else {
        // If main exists, add the content to it instead
        existingMain.appendChild(primaryContent);
      }
    }
  }

  // Call the function to wrap the primary content
  wrapPrimaryContentWithMain();
});