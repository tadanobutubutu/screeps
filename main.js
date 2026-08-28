/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    const accessibleName = svgElement.querySelector('title')?.textContent?.trim() || 'SVG graphic';
    svgElement.setAttribute('aria-label', accessibleName);
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  const href = link.getAttribute('href');
  const tabIndex = link.getAttribute('tabindex');
  const role = link.getAttribute('role');
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  
  if (href && href !== '#' && href !== '') {
    return true;
  } else if (role === 'button' && (tabIndex === '0' || tabIndex !== null) && (hasAriaLabel || hasAriaLabelledBy)) {
    return true;
  } else if (!href && (tabIndex === '0' || tabIndex !== null) && (hasAriaLabel || hasAriaLabelledBy)) {
    return true;
  }
  return false;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  const tabIndex = button.getAttribute('tabindex');
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
  
  return (tabIndex === '0' || tabIndex !== null) && (hasAriaLabel || hasAriaLabelledBy);
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const links = Array.from(container.querySelectorAll('a')).filter(link => link.getAttribute('href') === '' || link.getAttribute('href') === '#' || !link.hasAttribute('href'));
  const buttons = Array.from(container.querySelectorAll('button'));
  
  const inaccessibleLinks = links.filter(link => !isLinkAccessible(link));
  const inaccessibleButtons = buttons.filter(button => !isButtonAccessible(button));
  
  return {
    links: inaccessibleLinks.length,
    buttons: inaccessibleButtons.length,
    totalInaccessible: inaccessibleLinks.length + inaccessibleButtons.length,
    details: {
      inaccessibleLinks,
      inaccessibleButtons
    }
  };
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  if (!validRoles.includes(role)) {
    console.warn(`Invalid landmark role: ${role}`);
    return false;
  }
  
  const hasRole = element.getAttribute('role') === role;
  const hasAriaLabel = element.hasAttribute('aria-label');
  const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
  
  return hasRole && (hasAriaLabel || hasAriaLabelledBy);
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return null;
  
  let mainElement = document.querySelector('main');
  const body = document.body;
  if (!body) return null;
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    const firstElement = body.firstElementChild;
    if (firstElement) {
      body.insertBefore(mainElement, firstElement);
    } else {
      body.appendChild(mainElement);
    }
  }
  
  while (mainElement.firstChild) {
    mainElement.removeChild(mainElement.firstChild);
  }
  
  Array.from(body.children).forEach(child => {
    if (child !== mainElement) {
      mainElement.appendChild(child);
    }
  });
  
  return mainElement;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const results = {};
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    const validElements = [];
    const invalidElements = [];
    
    elements.forEach(element => {
      if (checkLandmarkElement(role, element)) {
        validElements.push(element);
      } else {
        invalidElements.push(element);
      }
    });
    
    results[role] = {
      elements: validElements.length,
      inaccessible: invalidElements.length,
      inaccessibles: invalidElements
    };
  });
  
  // Ensure main exists
  let hasMain = false;
  container.querySelectorAll('[role="main"]').forEach(el => {
    if (checkLandmarkElement('main', el)) hasMain = true;
  });
  if (!hasMain) {
    container.querySelectorAll(':not([role="main"])').forEach(el => {
      if (el.children.length > 0) {
        wrapPrimaryContentInMain();
      }
    });
  }
  
  return results;
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
  return null;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    const hasCaption = table.querySelector('caption');
    if (!hasCaption) {
      const caption = document.createElement('caption');
      table.insertBefore(caption, table.firstChild);
    }
    
    const rowGroup = table.querySelector('thead') || table.querySelector('tbody') || table.querySelector('tfoot');
    if (!rowGroup) {
      const tbody = document.createElement('tbody');
      while (table.firstChild) {
        tbody.appendChild(table.firstChild);
      }
      table.appendChild(tbody);
    }
  });
  return tables;
}

/**
 * Adds or fixes main landmark element.
 * @returns {HTMLElement|null} The main element
 */
function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

/**
 * Adds accessible names to all SVG elements in the document.
 * @returns {NodeList} NodeList of processed SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => setSvgAccessibilityProps(svg));
  return svgs;
}

/**
 * Ensures landmark elements are unique in the document.
 * Keeps only a single <main> element and ensures other landmarks have unique labels.
 * @returns {Object} An object containing uniqueness information
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  let mainCount = mains.length;
  let removedMains = 0;
  let mergedMain = false;
  
  if (mainCount > 1) {
    const firstMain = mains[0];
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      Array.from(main.children).forEach(child => {
        firstMain.appendChild(child);
      });
      main.remove();
      removedMains++;
      mergedMain = true;
    }
  }
  
  const otherLandmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  let duplicateCount = 0;
  
  otherLandmarks.forEach(landmark => {
    const existing = document.querySelectorAll(`[role="${landmark.getAttribute('role')}"]:not(#${landmark.id})`);
    if (existing.length > 1 && !landmark.hasAttribute('aria-label')) {
      landmark.setAttribute('aria-label', `${landmark.getAttribute('role')} section`);
      duplicateCount++;
    } else if (!landmark.hasAttribute('aria-label')) {
      duplicateCount++;
    }
  });
  
  return {
    totalMains: mains.length,
    mergedMain,
    removedMains,
    duplicates: duplicateCount
  };
}

/**
 * Fixes fake link issues by converting links without href to buttons.
 * @returns {Array} Array of fixed link elements
 */
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  const fixedLinks = [];
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
      fixedLinks.push(link);
    }
  });
  
  return fixedLinks;
}

/**
 * Sets accessible names for all form elements in the document.
 * @returns {NodeList} NodeList of processed form elements
 */
function setFormElementAccessibleNames() {
  const formElements = document.querySelectorAll('form [name], form [id]');
  formElements.forEach(element => {
    if (element.tagName.toLowerCase() === 'form') {
      const ariaLabelledByValue = element.getAttribute('aria-labelledby');
      if (!ariaLabelledByValue) {
        const uniqueLabel = `form-${Date.now()}`;
        const formDescription = element.getAttribute('aria-label') ? element.getAttribute('aria-label') : 'Form';
        element.insertAdjacentHTML('afterbegin', `<span id="${uniqueLabel}">${formDescription}</span>`);
        element.setAttribute('aria-labelledby', uniqueLabel);
      }
    } else {
      if (!element.hasAttribute('aria-label')) {
        const accessibleName = `${element.tagName.toLowerCase()} input: ${element.name || element.id}`;
        element.setAttribute('aria-label', accessibleName);
      }
    }
  });
  return formElements;
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
  return interactiveElements;
}

// Exports for all functions
module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements
};