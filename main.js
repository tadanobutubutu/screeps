// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

function main() {
  // Initialize lang attribute for accessibility
  addLangAttribute('en');
  
  // Existing main functionality
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<h1>Welcome to the Application</h1>';
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', main);
}

module.exports = { addLangAttribute, main };