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
  // Example implementation, should be replaced with actual logic based on the insight report
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      // Assume we can generate a label based on the button's text content
      const label = button.textContent.trim() || 'Button';
      addAriaLabel(button, label);
    }
  });
}

// Add a new function for adding `aria-label` to buttons
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Modify the event listeners to include `aria-label`
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');

// Fix table structure issues: ensure tables have a thead and header cells have scope='col'
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

/**
 * Adds proper landmark regions to elements with specific roles.
 * Ensures that elements are wrapped in appropriate landmark containers
 * for better accessibility support.
 */
function addProperLandmarkRegions() {
  // Handle main content region
  const mainContent = document.querySelector('[role="main"], main');
  if (mainContent && !isWithinLandmark(mainContent, ['main'])) {
    wrapInLandmark(mainContent, 'main');
  }

  // Handle navigation regions
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach(nav => {
    if (!isWithinLandmark(nav, ['navigation'])) {
      wrapInLandmark(nav, 'navigation');
    }
  });

  // Handle banner regions (headers)
  const headerElements = document.querySelectorAll('header, [role="banner"]');
  headerElements.forEach(header => {
    if (!isWithinLandmark(header, ['banner'])) {
      wrapInLandmark(header, 'banner');
    }
  });

  // Handle complementary regions (asides)
  const asideElements = document.querySelectorAll('aside, [role="complementary"]');
  asideElements.forEach(aside => {
    if (!isWithinLandmark(aside, ['complementary'])) {
      wrapInLandmark(aside, 'complementary');
    }
  });

  // Handle content info (footers)
  const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
  footerElements.forEach(footer => {
    if (!isWithinLandmark(footer, ['contentinfo'])) {
      wrapInLandmark(footer, 'contentinfo');
    }
  });

  // Handle search regions
  const searchElements = document.querySelectorAll('[role="search"]');
  searchElements.forEach(search => {
    if (!isWithinLandmark(search, ['search'])) {
      wrapInLandmark(search, 'search');
    }
  });
}

/**
 * Wraps an element in a landmark container with the specified role.
 * @param {HTMLElement} element - The element to wrap
 * @param {string} role - The ARIA role for the landmark container
 */
function wrapInLandmark(element, role) {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', role);
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
}

/**
 * Checks whether an element is already contained within a landmark
 * of one of the specified roles.
 * @param {HTMLElement} element - The element to check
 * @param {string[]} roles - Array of landmark roles to check for
 * @returns {boolean} True if the element is within one of the specified landmarks
 */
function isWithinLandmark(element, roles) {
  let node = element.parentNode;
  while (node && node !== document.body) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const roleAttr = node.getAttribute('role');
      if (roles.includes(roleAttr)) {
        return true;
      }
    }
    node = node.parentNode;
  }
  return false;
}

myNewFunction = function() { /* Custom game loop logic */ }; // Move myNewFunction to original position below exports

module.exports = {
  loop: function() {
    myNewFunction(); // Call the custom game loop logic within the loop
    // ...
  },
  myNewFunction, // Include the new function in the exports
  add,
  subtract,
  multiply,
  divide,
  addAriaLabel, // Include the new function in the exports
  addressAccessibilityIssuesFromInsightReport, // Include the new function in the exports
  fixTableStructureIssues, // Include the new function in the exports
  addProperLandmarkRegions, // Add the new function to the exports
  updateTableHeaders: function() {
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(header => {
      header.setAttribute('scope', 'col');
    });
  }
};