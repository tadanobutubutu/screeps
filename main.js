// Please paste your main.js content here

/**
 * Replaces fake links (<a href="#">) with proper buttons for better accessibility
 * @param {string} selector - CSS selector for the elements to replace
 */
function replaceFakeLinksWithButtons(selector) {
  const fakeLinks = document.querySelectorAll(selector);

  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.id = link.id;
    button.className = link.className;
    button.innerHTML = link.innerHTML;

    // Copy all event listeners from the link to the button
    const clone = link.cloneNode(true);
    const listeners = getEventListeners(link);
    Object.keys(listeners).forEach(eventType => {
      listeners[eventType].forEach(listener => {
        button.addEventListener(eventType, listener.listener, listener.options);
      });
    });

    // Replace the link with the button
    link.parentNode.replaceChild(button, link);
  });
}

// Helper function to get event listeners (if available)
function getEventListeners(element) {
  if (typeof getEventListeners === 'function') {
    return getEventListeners(element);
  }
  return {};
}

// Export any existing functions if they were in the original main.js
// (Assuming there were no existing exports in the original main.js)