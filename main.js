// Accessibility-fixes: main.js
// This file has been updated to address the listed accessibility issues.

// REACT_015 fix: Ensure lang attribute is set on HTML element
document.documentElement.lang = 'en';

// REACT_041 fix: Add accessible names to SVGs (via aria-label attributes)
function renderAccessibleSVG(accessibleName, svgId) {
  return `
    <svg aria-label="${accessibleName}" id="${svgId || ''}">
    </svg>
  `;
}

// REACT_025 fix: Use single <main> landmark with aria-label for unique identification
// This ensures only one <main> landmark exists, using sectioning elements for other regions
function renderLandmarkStructure(content) {
  return `
    <main aria-label="Main content">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
        </nav>
      </header>
      ${content}
      <footer role="contentinfo">
      </footer>
    </main>
  `;
}

// REACT_015 fix: Provide accessible language for root HTML document
// This ensures screen readers pick the correct language for the entire document
function ensureDocumentLanguage() {
  if (document.documentElement.lang !== 'en') {
    document.documentElement.lang = 'en';
  }
}

// Main render function
function renderApp() {
  ensureDocumentLanguage();
  var appContent = document.getElementById('app');
  if (appContent) {
    appContent.innerHTML = renderLandmarkStructure('\
      <h1>Welcome</h1>\
      ' + renderAccessibleSVG('Decorative circle icon', 'icon-1') + '\
      <button type="button" aria-label="Click me">Click me</button>\
    ');
  }
}

// Initialize the application
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', renderApp);
}

// Export functions for testing (preserve existing exports)
export {
  renderAccessibleSVG,
  renderLandmarkStructure,
  renderApp,
  ensureDocumentLanguage
};