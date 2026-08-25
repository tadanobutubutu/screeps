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
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    }
  }

  // Call the function to wrap the primary content
  wrapPrimaryContentWithMain();

  // Fix REACT_015: Add lang attribute to <html> element for screen reader accessibility
  // This ensures screen readers pick the correct language voice
  function setHtmlLangAttribute() {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }

  // Call the function to set the lang attribute
  setHtmlLangAttribute();
});