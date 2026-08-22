function init() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Select the unrotate element
    const unrotateElement = document.querySelector('#unrotate');
    if (unrotateElement) {
      // Replace the <a> element with a <button> element
      const newButton = document.createElement('button');
      newButton.id = 'unrotate';
      newButton.type = 'button';
      newButton.textContent = 'rotate back';
      newButton.className = unrotateElement.className;
      if (unrotateElement.style.cssText) {
        newButton.style.cssText = unrotateElement.style.cssText;
      }
      newButton.addEventListener('click', function() {
        // Your unrotate logic here
        // For example: reset rotation, scroll to top, etc.
        console.log('Rotate back clicked');
      });
      unrotateElement.parentNode.replaceChild(newButton, unrotateElement);
    }
  });
}

// Export for testing (if applicable)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init };
}