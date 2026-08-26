// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds the lang attribute to the HTML element for accessibility
 * This helps screen readers and assistive technologies properly interpret the page content
 * @param {string} lang - The language code (e.g., 'en', 'en-US', 'es')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Call the function to set the default language
addLangAttribute('en');

export { addLangAttribute };