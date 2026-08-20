// Main application entry point

// Resolve merge conflicts in dependencies section
const dependencies = {
  react: '^18.2.0',
  'react-dom': '^18.2.0'
};

// Accessibility fix for REACT_015: Add lang attribute to HTML element
function renderDocument() {
  const htmlElement = document.createElement('html');
  htmlElement.setAttribute('lang', 'en');  // ✅ Accessibility improvement
  
  const headElement = document.createElement('head');
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Dependency Graph';
  
  headElement.appendChild(titleElement);
  htmlElement.appendChild(headElement);
  
  // Rest of document structure...
  return htmlElement;
}

// Initialize application
function init() {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const documentFragment = renderDocument();
    appContainer.appendChild(documentFragment);
  }
}

document.addEventListener('DOMContentLoaded', init);

// Export for testing
module.exports = { dependencies, renderDocument, init };