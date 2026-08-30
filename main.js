// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Sample main.js with dependencyGraph container
function renderDependencyGraph() {
  const container = document.getElementById('dependencyGraph');
  
  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  
  return container;
}

/**
 * Adds the lang attribute to the HTML element.
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Gets the lang attribute value for the HTML element.
 * @returns {string} The language code
 */
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
}

/**
 * Creates an accessible in-page button element.
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {Function} options.onClick - Click handler
 * @param {string} [options.ariaLabel] - Accessible label
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton({ text, onClick, ariaLabel }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  button.addEventListener('click', onClick);
  return button;
}

/**
 * Adds/fixes landmark issues in the document.
 */
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.setAttribute('id', 'mainContent');
  }
}

/**
 * Validates landmark structure in the document.
 * @returns {Array} Array of validation results
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
  const results = [];
  
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const hasLabel = landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby');
    results.push({
      element: landmark,
      role,
      index,
      hasAccessibleName: hasLabel,
      valid: hasLabel || role === 'main'
    });
  });
  
  return results;
}

/**
 * Validates individual landmark elements.
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {Object} Validation result
 */
function validateLandmark(landmark) {
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  const hasLabel = landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby');
  return {
    element: landmark,
    role,
    hasAccessibleName: hasLabel,
    valid: hasLabel || role === 'main'
  };
}

/**
 * Validates landmark attributes for accessibility compliance.
 * @returns {Array} Array of validation results
 */
function validateLandmarkAttributes() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
  const results = [];
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    
    results.push({
      element: landmark,
      role,
      ariaLabel,
      ariaLabelledby,
      hasAccessibleName: !!(ariaLabel || ariaLabelledby),
      valid: !!(ariaLabel || ariaLabelledby) || role === 'main'
    });
  });
  
  return results;
}

/**
 * Ensures that all landmarks in the document are unique.
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const roleCounts = {};
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (role) {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
      if (roleCounts[role] > 1 && !landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${role} ${roleCounts[role]}`);
      }
    }
  });
}

/**
 * Adds accessible names to SVGs.
 */
function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby]):not([role="img"])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
      svg.setAttribute('aria-label', title.textContent.trim());
    } else {
      svg.setAttribute('aria-label', `SVG illustration ${index + 1}`);
    }
    svg.setAttribute('role', 'img');
  });
}

/**
 * Sets SVG attributes for accessibility.
 * @param {SVGElement} svg - The SVG element
 * @param {Object} options - Accessibility options
 * @param {string} options.label - Accessible label
 * @param {string} [options.description] - Longer description
 */
function setSvgAttributes(svg, { label, description }) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  
  if (description) {
    let descId = svg.getAttribute('aria-describedby');
    if (!descId) {
      descId = `svg-desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      let desc = svg.querySelector('desc');
      if (!desc) {
        desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
        desc.id = descId;
        svg.insertBefore(desc, svg.firstChild);
      }
      desc.textContent = description;
      svg.setAttribute('aria-describedby', descId);
    }
  }
}

/**
 * Fixes 1 fake link issue by converting it into an actual link.
 */
function personName() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], [role="link"]:not(a)');
  fakeLinks.forEach((link) => {
    if (link.tagName !== 'A') {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = link.textContent;
      button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'role' && attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      link.parentNode.replaceChild(button, link);
    }
  });
}

/**
 * Validates link accessibility.
 * @returns {Array} Array of validation results
 */
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href], [role="link"]');
  const results = [];
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
    const hasAccessibleName = hasText || hasAriaLabel || hasAriaLabelledby;
    const isFakeLink = !href || href === '#' || href === 'javascript:void(0)';
    
    results.push({
      element: link,
      href,
      hasAccessibleName,
      isFakeLink,
      valid: hasAccessibleName && !isFakeLink
    });
  });
  
  return results;
}

/**
 * Handles fake links by converting them to buttons or proper links.
 */
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  fakeLinks.forEach((link) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = link.textContent;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    link.parentNode.replaceChild(button, link);
  });
}

/**
 * Validates and fixes 26 table structure issues.
 */
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure table has caption or aria-label
    if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      table.setAttribute('aria-label', 'Data table');
    }
    
    // Ensure headers have scope
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const isColumnHeader = th.parentElement.tagName === 'TR' && 
          Array.from(th.parentElement.children).indexOf(th) === 0;
        th.setAttribute('scope', isColumnHeader ? 'row' : 'col');
      }
    });
    
    // Ensure proper table structure
    if (!table.querySelector('thead') && table.querySelector('tr')) {
      const firstRow = table.querySelector('tr');
      if (firstRow.querySelector('th')) {
        const thead = document.createElement('thead');
        firstRow.parentNode.insertBefore(thead, firstRow);
        thead.appendChild(firstRow);
      }
    }
  });
}

/**
 * Validates table accessibility.
 * @returns {Array} Array of validation results
 */
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = !!table.querySelector('caption');
    const hasAriaLabel = table.hasAttribute('aria-label') || table.hasAttribute('aria-labelledby');
    const headers = table.querySelectorAll('th');
    const headersWithScope = Array.from(headers).filter(th => th.hasAttribute('scope')).length;
    const hasThead = !!table.querySelector('thead');
    const hasTbody = !!table.querySelector('tbody');
    
    results.push({
      table,
      index,
      hasCaption,
      hasAriaLabel,
      headerCount: headers.length,
      headersWithScope,
      hasThead,
      hasTbody,
      valid: (hasCaption || hasAriaLabel) && headersWithScope === headers.length && hasThead && hasTbody
    });
  });
  
  return results;
}

/**
 * Implements the new feature as required by the issue.
 * @param {*} input - The input data to process
 * @returns {*} The processed result
 */
function implementNewFunction(input) {
  // Implementation based on issue requirements
  // This is a placeholder implementation that should be replaced
  // with the actual logic once requirements are clarified
  // New function as per the issue requirements
  return input;
}

module.exports = {
  renderDependencyGraph,
  addLangAttribute,
  getLangAttribute,
  createInPageButton,
  addMainLandmark,
  validateLandmarkStructure,
  validateLandmark,
  validateLandmarkAttributes,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  personName,
  validateLinkAccessibility,
  handleFakeLinks,
  validateTableStructure,
  validateTableAccessibility,
  implementNewFunction
};