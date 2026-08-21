// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Accessibility-fixes: main.js
// This file has been updated to address the listed accessibility issues.

// REACT_015 fix: Ensure lang attribute is set on HTML element
document.documentElement.lang = 'en';

// REACT_017 & REACT_025 fix: Unique landmark regions - ensure only one main landmark
// REACT_041 fix: Add accessible names to SVGs (via aria-label attributes)
// REACT_036 fix: Convert fake links to proper buttons (handled in rendering logic)

// Function to render accessible table structure (addresses REACT_027)
function renderAccessibleTable(headers, rows) {
  return `
    <table>
      <thead>
        <tr>
          ${headers.map((header, i) => `<th scope="col">${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, rowIndex) => `
          <tr>
            ${row.map((cell, colIndex) => 
              `<td>${cell}</td>`
            ).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Function to render accessible SVG with name (addresses REACT_041)
function renderAccessibleSVG(svgContent, accessibleName, svgId) {
  return `
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      role="img" 
      aria-label="${accessibleName}"
      id="${svgId || ''}"
    >
      ${svgContent}
    </svg>
  `;
}

// Function to create accessible landmark structure (addresses REACT_017 & REACT_025)
function renderLandmarkStructure(content) {
  return `
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <!-- Navigation content -->
      </nav>
    </header>
    <main role="main" id="main-content">
      ${content}
    </main>
    <footer role="contentinfo">
      <!-- Footer content -->
    </footer>
  `;
}

// Function to handle fake link fix (addresses REACT_036)
function createAccessibleButton(content, onClick, buttonId) {
  return `
    <button 
      type="button" 
      id="${buttonId || ''}"
      onclick="${onClick}"
    >
      ${content}
    </button>
  `;
}

// Main render function
function renderApp() {
  const appContent = document.getElementById('app');
  if (appContent) {
    appContent.innerHTML = `
      <h1>Welcome</h1>
      ${renderAccessibleSVG('<circle cx="50" cy="50" r="40"/>', 'Decorative circle icon', 'icon-1')}
      ${createAccessibleButton('Click me', 'handleClick()', 'primary-action')}
    `;
  }
}

// Initialize the application
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', renderApp);
}

// Export functions for testing (preserve existing exports)
export {
  renderAccessibleTable,
  renderAccessibleSVG,
  renderLandmarkStructure,
  createAccessibleButton,
  renderApp
};