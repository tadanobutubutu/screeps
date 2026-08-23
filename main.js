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
          <!-- Navigation content -->
        </nav>
      </header>
      ${content}
      <footer role="contentinfo">
        <!-- Footer content -->
      </footer>
    </main>
  `;
}

// REACT_036 fix: Replace fake link (<a href="#">) with a <button> for in-page actions
// This ensures proper keyboard interaction and correct screen reader announcement
function renderInPageAction(label, actionId) {
  return `
    <button type="button" id="${actionId || ''}" aria-label="${label}">
      ${label}
    </button>
  `;
}

// Main render function
function renderApp() {
  var appContent = document.getElementById('app');
  if (appContent) {
    appContent.innerHTML = renderLandmarkStructure('\
      <h1>Welcome</h1>\
      ' + renderAccessibleSVG('Decorative circle icon', 'icon-1') + '\
      <button type="button" aria-label="Click me">Click me</button>\
      <p>' + renderInPageAction('rotate back', 'unrotate') + '</p>\
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
  renderInPageAction
};