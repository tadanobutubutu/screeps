// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility.
 * This helps screen readers and assistive technologies understand the page language.
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Export the accessibility function
module.exports = { addLangAttribute };