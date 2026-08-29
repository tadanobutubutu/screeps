import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

/**
 * Checks accessibility of links and buttons in the document.
 * Validates that each link and button has an accessible name.
 * @returns {Object} Object containing array of accessibility issues for links and buttons
 */
function checkLinkAndButtonAccessibility() {
  const accessibilityIssues = {
    links: [],
    buttons: []
  };

  // Check links for accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    const hasTextContent = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label') && link.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = link.hasAttribute('aria-labelledby') && link.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = link.hasAttribute('title') && link.getAttribute('title').trim() !== '';

    if (!hasTextContent && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      accessibilityIssues.links.push({
        element: link,
        index: index,
        message: 'Link missing accessible name. Provide text content, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });

  // Check buttons for accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasTextContent = button.textContent.trim().length > 0;
    const hasAriaLabel = button.hasAttribute('aria-label') && button.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby') && button.getAttribute('aria-labelledby').trim() !== '';
    const hasTitle = button.hasAttribute('title') && button.getAttribute('title').trim() !== '';

    if (!hasTextContent && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      accessibilityIssues.buttons.push({
        element: button,
        index: index,
        message: 'Button missing accessible name. Provide text content, aria-label, aria-labelledby, or title attribute.'
      });
    }
  });

  return accessibilityIssues;
}

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - Object containing dependency data
 * @returns {JSX.Element} Rendered dependency graph
 */
export function renderDependencyGraph(dependencies) {
  return (
    <div className="dependency-graph">
      <h2>Dependency Graph</h2>
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        {Object.entries(dependencies).map(([name, deps], index) => {
          const x = 100 + (index % 4) * 180;
          const y = 100 + Math.floor(index / 4) * 150;
          return (
            <g key={name} transform={`translate(${x}, ${y})`}>
              <rect width="150" height="80" rx="5" fill="#e1e4e8" stroke="#0366d6" />
              <text x="75" y="35" textAnchor="middle" fontSize="14" fontWeight="bold">
                {name}
              </text>
              <text x="75" y="55" textAnchor="middle" fontSize="12" fill="#586069">
                {deps && deps.length > 0 ? `${deps.length} dependencies` : 'No dependencies'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Renders an index view for browsing dependencies
 * @param {Array} items - Array of items to display in the index
 * @returns {JSX.Element} Rendered index view
 */
export function renderIndexView(items) {
  return (
    <div className="index-view">
      <h2>Index View</h2>
      <div className="index-list">
        {items.map((item, index) => (
          <div key={index} className="index-item">
            <a href={`/${item.path || item.name}`} className="index-link">
              {item.name}
            </a>
            {item.description && <p className="index-description">{item.description}</p>}
            {item.type && <span className="index-badge">{item.type}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Export MyComponent
export default MyComponent;

// Export the accessibility check function
export { checkLinkAndButtonAccessibility };