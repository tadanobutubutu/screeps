const img = document.getElementById('target'); let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Add a new function for addressing accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      // Assume we can generate a label based on the button's text content
      const label = button.textContent.trim() || 'Button';
      addAriaLabel(button, label);
    }
  });
}

// Add a new function for adding `aria-label` to elements
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Add the new function to address table structure issues
function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach(table => {
    // Ensure thead exists; move the first row (assumed header) into it
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.rows[0];
      thead.appendChild(firstRow);
      const tbody = table.querySelector('tbody');
      if (tbody) {
        table.insertBefore(thead, tbody);
      } else {
        table.appendChild(thead);
      }
    }
    // Set scope='col' and role='colheader' on all th elements
    table.querySelectorAll('th').forEach(th => {
      th.setAttribute('scope', 'col');
      th.setAttribute('role', 'colheader');
    });
  });
}

// Add the new function to add proper landmark regions
function addProperLandmarkRegions() {
  // Handle main content region
  const mainContent = document.querySelector('[role="main"], main');
  if (mainContent && !isWithinLandmark(mainContent, ['main'])) {
    wrapInLandmark(mainContent, 'main');
  }

  // Add the new function to create in-page navigation (assuming that other functions for handling previous landmark issues are present)
  function createInPageNavigation() {
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-labelledby', 'in-page-nav-label'); // Assuming a label exists in the document with 'in-page-nav-label' ID
    const anchorLinks = [];

    document.querySelectorAll('[id].landmark').forEach(landmark => {
      const landmarkAnchor = document.createElement('a');
      landmarkAnchor.href = `#${landmark.id}`;
      landmarkAnchor.textContent = landmark.textContent;
      nav.appendChild(landmarkAnchor);
      anchorLinks.push(landmarkAnchor);
    });

    document.body.appendChild(nav);

    // On document ready, focus the first link of the in-page navigation
    document.addEventListener('DOMContentLoaded', () => {
      if (anchorLinks.length > 0) {
        const firstLink = anchorLinks[0];
        firstLink.focus();
      }
    });
  }

  // Call the new functions to address accessibility issues
  addressAccessibilityIssuesFromInsightReport();
  fixTableStructureIssues();
  fixSvgAccessibilityIssues();
  createInPageNavigation();
}

// Add the new function: wrapPrimaryContentInMain
function wrapPrimaryContentInMain(primaryContent) {
  if (!primaryContent || !primaryContent.parentNode || primaryContent.parentNode.getAttribute('role') === 'main') {
    return;
  }

  const mainElement = document.querySelector('[role="main"], main');
  if (!mainElement) {
    throw new Error('No main element found');
  }

  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-labelledby', 'primary-content-label'); // Assuming a label exists in the document with 'primary-content-label' ID
  primaryContent.parentNode.insertBefore(wrapper, primaryContent);
  wrapper.appendChild(primaryContent);

  mainElement.appendChild(wrapper);
}

// Add the new function to check if an element is within a landmark
function isWithinLandmark(elem, landmarks) {
  let current = elem;
  const landmarkParents = [];

  while (current) {
    if (landmarks.includes(current.nodeName.toLowerCase())) {
      landmarkParents.unshift(current);
    }

    current = current.parentNode;
  }

  return landmarkParents.length > 0;
}

// Add the new function to wrap an element in a landmark
function wrapInLandmark(elem, landmarkRole) {
  if (!elem) {
    return;
  }

  const landmark = document.createElement(landmarkRole);
  landmark.setAttribute('role', landmarkRole);
  elem.parentNode.insertBefore(landmark, elem);
  landmark.appendChild(elem);
}

// Add the new function to fix SVG accessible name issues
function fixSvgAccessibilityIssues() {
  document.querySelectorAll('svg').forEach(svg => {
    const hasAccessibleName = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.querySelector('title');
    if (!hasAccessibleName && !svg.hasAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Add the new function to address REACT_017 React Landmarks issue
function fixReactLandmarkIssue() {
  if (!document.querySelector('main')) {
    const content = document.querySelector('.container') || document.querySelector('#table-rotated');
    if (content) {
      const main = document.createElement('main');
      content.parentNode.insertBefore(main, content);
      main.appendChild(content);
    }
  }
}

module.exports = {
  rotate,
  rotateBack,
  add,
  subtract,
  multiply,
  divide,
  addressAccessibilityIssuesFromInsightReport,
  addAriaLabel,
  fixTableStructureIssues,
  addProperLandmarkRegions,
  wrapPrimaryContentInMain,
  isWithinLandmark,
  wrapInLandmark,
  fixSvgAccessibilityIssues,
  fixReactLandmarkIssue,
  someFunction // Assuming 'someFunction' is already imported and defined somewhere
};