// ADD THE NEW FUNCTION HERE
function createInPageButton(buttonText, targetId, options = {}) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'Navigate';
  button.type = 'button';
  
  if (targetId) {
    button.setAttribute('data-target-id', targetId);
    button.addEventListener('click', () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: options.smooth ? 'smooth' : 'auto' });
      }
    });
  }
  
  if (options.className) {
    button.className = options.className;
  }
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  
  return button;
}

/**
 * Create an accessible link element
 * @param { string } href - The URL the link points to
 * @param { string } linkText - The text content of the link
 * @param { Object } options - Optional configuration
 * @returns { HTMLAnchorElement } The created link element
 */
function createAccessibleLink(href, linkText, options = {}) {
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = linkText || '';
  
  if (options.id) {
    link.id = options.id;
  }
  
  if (options.className) {
    link.className = options.className;
  }
  
  if (options.target) {
    link.target = options.target;
    if (options.target === '_blank') {
      link.rel = 'noopener noreferrer';
    }
  }
  
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.title) {
    link.title = options.title;
  }
  
  if (options.role) {
    link.setAttribute('role', options.role);
  }
  
  if (options.tabIndex !== undefined) {
    link.tabIndex = options.tabIndex;
  }
  
  return link;
}

/**
 * Ensure landmarks are unique by adding incrementing suffixes to duplicates
 * @param { Array } landmarks - Array of landmark elements
 * @returns { Array } Array of landmarks with unique identifiers
 */
function ensureUniqueLandmarks(landmarks) {
  const landmarkCounts = {};
  
  return landmarks.map(landmark => {
    const role = landmark.getAttribute('role') || 'section';
    
    if (!landmarkCounts[role]) {
      landmarkCounts[role] = 1;
      return landmark;
    }
    
    landmarkCounts[role]++;
    const newLabel = `${role}-${landmarkCounts[role]}`;
    landmark.setAttribute('aria-label', newLabel);
    landmark.id = landmark.id || newLabel;
    
    return landmark;
  });
}

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"], article, #content, .content');
  if (!primaryContent) {
    return;
  }
  
  const main = doc.createElement('main');
  main.className = 'main';
  
  if (primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Add proper landmark regions to the document
 * @param { Document } doc - The document object to operate on
 */
function addProperLandmarkRegions(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, footer, aside, section, article');
  return ensureUniqueLandmarks(Array.from(landmarks));
}

/**
 * Add ARIA attributes to form controls
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = input.id ? doc.querySelector(`label[for="${input.id}"]`) : null;
      if (label) {
        input.setAttribute('aria-labelledby', label.id || `label-${index}`);
      }
    }
  });
}

/**
 * Replace button IDs with accessible alternatives
 * @param { Document } doc - The document object to operate on
 */
function replaceMyButtonId(doc) {
  const buttons = doc.querySelectorAll('button[id="myButton"]');
  buttons.forEach((button, index) => {
    button.id = `accessible-button-${index}`;
  });
}

/**
 * Get the lang attribute from the document
 * @param { Document } doc - The document object to operate on
 * @returns { string } The language code
 */
function getLangAttribute(doc) {
  return doc.documentElement.lang || 'en';
}

/**
 * Get the full lang attribute including region
 * @param { Document } doc - The document object to operate on
 * @returns { string } The full language code
 */
function getFullLangAttribute(doc) {
  return doc.documentElement.lang || 'en-US';
}

/**
 * Validate landmark structure
 * @param { Element } element - The element to validate
 * @returns { boolean } Whether the landmark is valid
 */
function validateLandmark(element) {
  const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const role = element.getAttribute('role');
  return role && validRoles.includes(role);
}

/**
 * Validate landmark structure in document
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateLandmarkStructure(doc) {
  const landmarks = doc.querySelectorAll('[role]');
  return Array.from(landmarks).map(el => ({
    element: el,
    valid: validateLandmark(el),
    role: el.getAttribute('role')
  }));
}

/**
 * Validate table accessibility
 * @param { HTMLTableElement } table - The table to validate
 * @returns { boolean } Whether the table is accessible
 */
function validateTableAccessibility(table) {
  const hasCaption = table.querySelector('caption');
  const hasHeaders = table.querySelector('th');
  return hasCaption && hasHeaders;
}

/**
 * Validate table structure
 * @param { Document } doc - The document object to validate
 * @returns { Array } Array of validation results
 */
function validateTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  return Array.from(tables).map(table => ({
    table,
    accessible: validateTableAccessibility(table)
  }));
}

/**
 * Get accessible name for SVG elements
 * @param { SVGElement } svg - The SVG element
 * @returns { string } The accessible name
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const describedBy = svg.getAttribute('aria-describedby');
  
  if (ariaLabel) {
    return ariaLabel;
  }
  
  if (title) {
    return title.textContent;
  }
  
  if (describedBy) {
    const describedElement = document.getElementById(describedBy);
    return describedElement ? describedElement.textContent : '';
  }
  
  return '';
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = require('./utils');

module.exports = {
  addProperLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  createInPageButton,
  createAccessibleLink,
  getSvgAccessibleName
};