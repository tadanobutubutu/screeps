document.addEventListener('DOMContentLoaded', function() {
  // Preserve existing code from main.js
  const unrotateElement = document.querySelector('.rotate-back');
  
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
      document.body.style.transform = 'rotate(0deg)';
      document.body.style.transition = 'transform 0.3s ease';
    });
    
    // Replace the anchor with the button
    unrotateElement.parentNode.replaceChild(button, unrotateElement);
  }

  // Wrap the primary content in a <main> element for accessibility
  function wrapPrimaryContent() {
    const primaryContent = document.querySelector('.container');
    if (primaryContent) {
      const mainElement = document.createElement('main');
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
    }
  }

  // Call the function to wrap the primary content
  wrapPrimaryContent();
});