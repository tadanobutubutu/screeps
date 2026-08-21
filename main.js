// main.js - Application entry point

// New function to enhance accessibility (example)
function enhanceAccessibility(element) {
  // Accessible enhancement of the provided element
  // For example, adding ARIA attributes
  if (element && element.hasAttribute) {
    element.setAttribute("aria-label", "Custom accessibility label");
  }
}

// Ensure the provided element is a DOM element or a string that can be converted to a DOM element
function ensureElement(input) {
  if (typeof input === "string") {
    return document.querySelector(input);
  }
  return input;
}

// Wait for DOM to be ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Select the unrotate element
    const unrotateElement = document.getElementById('unrotate');

    if (unrotateElement) {
      // Replace the <a> element with a <button> element
      const newButton = document.createElement('button');
      newButton.id = 'unrotate';
      newButton.type = 'button';
      newButton.textContent = 'rotate back';
      newButton.className = unrotateElement.className;

      // Copy any inline styles if needed
      if (unrotateElement.style.cssText) {
        newButton.style.cssText = unrotateElement.style.cssText;
      }

      // Apply accessibility enhancement
      enhanceAccessibility(newButton);

      // Add click handler for the unrotate action
      newButton.addEventListener('click', () => {
        // Your unrotate logic here
        // For example: reset rotation, scroll to top, etc.
        console.log('Rotate back clicked');
      });

      // Add setLanguageAttribute function
      function setLanguageAttribute() {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('lang', 'en');
      }

      // Call the function to set the language attribute
      setLanguageAttribute();

      // Replace the old element with the new button
      unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
    }
  });
}

// Export for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    enhanceAccessibility: enhanceAccessibility,
    ensureElement: ensureElement,
    init: () => {
      // Update the init function if needed
    }
  };
}