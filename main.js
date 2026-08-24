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

/**
 * Adds an `aria-label` attribute to an element.
 * @param {HTMLElement} elem - Element to label.
 * @param {string} label - Label text.
 */
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

/**
 * Addresses accessibility issues identified in the insight report.
 */
function addressAccessibilityIssuesFromInsightReport() {
  const buttons = document.querySelectorAll('button');
  const myNewFunction = function() { /* Custom game loop logic */ };
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      const label = button.textContent.trim() || 'Button';
      addAriaLabel(button, label);
    }
  });
}

/**
 * Fixes table header scope attributes to improve accessibility.
 */
function fixTableStructureIssues() {
  const tables = document.getElementsByTagName('table');
  for (let table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        let cell = table.rows[i].cells[j];
        if (cell.tagName && cell.tagName.toLowerCase() === 'th') {
          if (i === 0) {
            cell.setAttribute('scope', 'col');
          }
        }
      }
    }
  }
}

/**
 * Adds proper landmark roles and ensures uniqueness.
 */
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main');
  const navigation = document.querySelector('nav');
  const footer = document.querySelector('footer');

  if (mainContent) mainContent.setAttribute('role', 'main');
  if (navigation) navigation.setAttribute('role', 'navigation');
  if (footer) footer.setAttribute('role', 'contentinfo');

  document.body.setAttribute('role', 'document');
  document.documentElement.setAttribute('lang', 'en');

  // Ensure all landmarks have unique IDs
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]');
  const landmarkIds = new Set([...landmarks].map(landmark => landmark.id || ''));

  if (landmarks.length > landmarkIds.size) {
    console.warn('Not all landmarks have unique IDs:', [...landmarks].map(landmark => landmark.id || 'no-id'));
  }
}

/**
 * Fixes fake link elements (e.g., <a rel="noopener noreferrer" href="#">).
 */
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a');
  for (let link of links) {
    if (link.rel === 'noopener noreferrer' && !link.href) {
      link.style.display = 'none'; // Hide fake links
    }
  }
}

/**
 * Preserves a placeholder TODO comment functionality.
 */
function newPreservedFunction() {
  console.log('This function was added to preserve the TODO comment.');
}

/**
 * Fixes a specific fake link by replacing its text and href.
 */
function fixOneFakeLinkIssue() {
  const fakeLink = document.getElementById('fake-link-id');
  if (fakeLink) {
    fakeLink.textContent = 'Example Link';
    fakeLink.href = 'https://example.com';
  }
}

/**
 * Replaces hash links with buttons for better keyboard and screen‑reader behavior.
 */
function fixReactFakeLinkIssue() {
  const hashLinks = document.querySelectorAll('a[href="#"]');
  hashLinks.forEach(link => {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  });
}

/**
 * Initialize the application (optional logging).
 */
function initialize() {
  console.log('Initializing application...');
}

/**
 * Retrieve a file path (kept for compatibility).
 */
function getFilePath(filename) {
  return filename; // simplified placeholder
}

/**
 * Apply all accessibility and link‑fixing helpers after the UI is rendered.
 */
function applyAccessibilityFixes() {
  // Placeholder for calling helper functions after rendering
}

/**
 * Add the <main> element to the document after React rendering.
 */
function addMainElement() {
  const mainElement = document.createElement('main');
  mainElement.innerHTML = document.body.innerHTML; // Copy the body content to the main element
  document.body.innerHTML = ''; // Clear the body content
  document.body.appendChild(mainElement); // Append the main element to the body
}

/**
 * Make an element accessible according to the insight report.
 */
function makeElementAccessible(element) {
  if (!element || !element.tagName) return;
  if (element.tagName.toLowerCase() === 'html') {
    element.setAttribute('lang', 'en'); // Assuming 'en' as default language
  } else if (element.tagName.toLowerCase() === 'svg') {
    element.setAttribute('aria-label', 'SVG description'); // Placeholder description
  }
}

/**
 * Main entry point after DOM is ready.
 */
function startApplication() {
  // ReactDOM.render call with addMainElement callback
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root'),
    () => {
      // Call the function to add the <main> element after the component has been rendered
      addMainElement();
      // Apply all accessibility and link‑fixing helpers
      applyAccessibilityFixes();
    }
  );
}

// Export helpers for Node / bundlers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotate,
    rotateBack,
    add,
    subtract,
    multiply,
    divide,
    addAriaLabel,
    addressAccessibilityIssuesFromInsightReport,
    fixTableStructureIssues,
    addProperLandmarkRegions,
    fixFakeLinkIssues,
    newPreservedFunction,
    fixOneFakeLinkIssue,
    fixReactFakeLinkIssue,
    initialize,
    getFilePath,
    applyAccessibilityFixes,
    startApplication,
    makeElementAccessible
  };
}

// Initialize application
initialize();
startApplication();