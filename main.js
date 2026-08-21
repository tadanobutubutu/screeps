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

    // Add setLanguageAttribute function
    function setLanguageAttribute() {
      document.documentElement.lang = 'en';
    }

    // Call the function to set the language attribute
    setLanguageAttribute();

    // Replace the old element with the new button
    unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
  }

  // Wrap the primary content in <main> for accessibility
  const primaryContent = document.querySelector('.container'); // Assuming the primary content is within a class .container
  if (primaryContent) {
    primaryContent.insertAdjacentHTML('afterbegin', '<main>');
    primaryContent.insertAdjacentHTML('beforeend', '</main>');
  }
});

// Export for testing (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init: () => {} }; // Update the init function if needed
}