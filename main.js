// main.js

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)

// Function to add lang attribute to HTML element for accessibility
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Initialize the application
function init() {
  addLangAttribute();
  // Other initialization code can go here
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
module.exports = { addLangAttribute, init };