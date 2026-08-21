// main.js - Application entry point

// Wait for DOM to be ready
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

    // Add click handler for the unrotate action
    newButton.addEventListener('click', () => {
      // Your unrotate logic here
      // For example: reset rotation, scroll to top, etc.
      console.log('Rotate back clicked');
    });

    // Replace the old element with the new button
    unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
  }

  // Add main landmark for accessibility (REACT_017)
  function createMainLandmark() {
    // Check if main landmark already exists
    if (document.querySelector('main')) {
      return document.querySelector('main');
    }

    // Find the main content container to wrap
    const mainContent = document.querySelector('.container') || 
                        document.getElementById('table-rotated')?.parentElement ||
                        document.body;

    // Create main element
    const main = document.createElement('main');
    
    // Insert main as the first child of body
    const body = document.body;
    body.insertBefore(main, body.firstChild);
    
    return main;
  }

  // Add setLanguageAttribute function
  function setLanguageAttribute() {
    document.documentElement.lang = 'en';
  }

  // Create main landmark for accessibility
  createMainLandmark();

  // Call the function to set the language attribute
  setLanguageAttribute();
});

// Export for testing (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    init: () => {},
    createMainLandmark: function() {
      if (typeof document !== 'undefined' && document.querySelector('main')) {
        return document.querySelector('main');
      }
      const main = document.createElement('main');
      const body = document.body;
      body.insertBefore(main, body.firstChild);
      return main;
    },
    setLanguageAttribute: function() {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = 'en';
      }
    }
  };
}