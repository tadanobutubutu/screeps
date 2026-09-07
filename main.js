// TODO: This is the existing code that needs to be preserved

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
function addLangAttribute(element, lang) {
  if (element) {
    element.classList.remove('rotated');
  }
}

// Added: The requested function
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;
  return button;
}

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibleNames(svgElement, label) {
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return;
  }
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', label);
}

// Example usage for SVGs:
// const svg1 = document.querySelector('svg.icon1');
// const svg2 = document.querySelector('svg.icon2');
// addSvgAccessibleNames(svg1, 'Description of first icon');
// addSvgAccessibleNames(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink) {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Run accessibility initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute('en');
}

ensureUniqueLandmarks();

// Function to check link and button accessibility
function checkLinkButtonAccessibility(rootElement = document) {
  const issues = [];
  const nodes = rootElement.querySelectorAll('a, button');

  nodes.forEach(node => {
    const tag = node.tagName.toLowerCase();
    if (tag === 'a') {
      // Check for fake links
      if (node.href === '#' || node.href === '' || !node.href) {
        if (!node.hasAttribute('role') || node.getAttribute('role') !== 'button') {
          issues.push(`${node.id || 'Unnamed'} <a> with href="${node.href}" should be a button`);
        }
        const name = (node.innerText || node.textContent).trim();
        if (!name) {
          issues.push(`${node.id || 'Unnamed'} <a> missing accessible name`);
        }
      } else {
        const name = (node.innerText || node.textContent).trim();
        if (!name) {
          issues.push(`${node.id || 'Unnamed'} <a> missing accessible name`);
        }
      }
    } else if (tag === 'button') {
      // Ensure proper role
      if (!node.hasAttribute('role') || node.getAttribute('role') !== 'button') {
        node.setAttribute('role', 'button');
      }
      // Ensure focusability
      const tabindex = node.getAttribute('tabindex');
      const isFocusable = tabindex !== null && (tabindex !== '-1' && !isNaN(parseInt(tabindex, 10)));
      if (!isFocusable) {
        issues.push(`${node.id || 'Unnamed'} <button> is not focusable`);
      }
      // Ensure accessible name
      const name = (node.innerText || node.textContent).trim();
      if (!name) {
        issues.push(`${node.id || 'Unnamed'} <button> missing accessible name`);
      }
    }
  });

  return issues;
}

module.exports = {
  rotateBack,
  createUnrotateButton,
  addSvgAccessibility,
  ensureThScope,
  initializeAccessibility,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  checkLinkButtonAccessibility
};