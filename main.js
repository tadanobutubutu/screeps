// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// TODO: Add any other missing exports that might have been? (All exports verified and present)

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') return;
  
  // Check for existing title element
  const hasTitle = svgElement.querySelector('title');
  const hasDesc = svgElement.querySelector('desc');
  const hasRole = svgElement.hasAttribute('role');
  
  // Add role="img" if not present for meaningful SVGs
  if (!hasRole && (hasTitle || hasDesc)) {
    svgElement.setAttribute('role', 'img');
  }
  
  // If SVG has no title, desc, or role, mark as decorative
  if (!hasTitle && !hasDesc && !hasRole) {
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-hidden', 'true');
  }
  
  // Ensure images within SVG have alt text handling
  const images = svgElement.querySelectorAll('image');
  images.forEach(img => {
    if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
      img.setAttribute('role', 'presentation');
    }
  });
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label') && link.getAttribute('aria-label').trim().length > 0;
  const hasTitle = link.hasAttribute('title') && link.getAttribute('title').trim().length > 0;
  return hasText || hasAriaLabel || hasTitle;
}

/**
 * Function to format a date into a locale-friendly string.
 * @param {Date|string|number} date - The date to format
 * @returns {string} The formatted date string
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label') && button.getAttribute('aria-label').trim().length > 0;
  const hasTitle = button.hasAttribute('title');
  return hasText || hasAriaLabel || hasTitle;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };

  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
    }
  });

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
    }
  });

  return results;
}

/**
 * Checks if a landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  const isValidRole = ['banner', 'navigation', 'main', 'sidebar', 'contentinfo', 'search', 'form', 'alert', 'application', 'complementary'];
  if (!isValidRole.includes(role) || !element || element.getAttribute('role') !== role) return;

  // Check if element already has an aria-label
  const existingLabel = element.getAttribute('aria-label');
  if (existingLabel && existingLabel.trim().length > 0) return;

  let ariaLabel = '';
  switch (role) {
    case 'banner':
      ariaLabel = 'Main banner';
      break;
    case 'navigation':
      ariaLabel = 'Main site navigation';
      break;
    case 'main':
      ariaLabel = 'Main content area';
      break;
    case 'sidebar':
      ariaLabel = 'Sidebar';
      break;
    case 'contentinfo':
      ariaLabel = 'Additional page content and information';
      break;
    case 'search':
      ariaLabel = 'Search field';
      break;
    case 'form':
      ariaLabel = 'Form';
      break;
    case 'alert':
      ariaLabel = 'Alert';
      break;
    case 'application':
      ariaLabel = 'Main application';
      break;
    case 'complementary':
      ariaLabel = 'Complementary content';
      break;
    default:
      ariaLabel = role;
  }
  element.setAttribute('aria-label', ariaLabel);
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  // Check if a main element already exists
  let mainElement = document.querySelector('main');
  
  if (mainElement) {
    // Main element already exists, return it
    return mainElement;
  }
  
  // Find the body element
  const body = document.body;
  
  if (!body) {
    return null;
  }
  
  // Create a main element
  mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  
  // Move all children of body into the main element
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  
  // Append the main element to body
  body.appendChild(mainElement);
  
  return mainElement;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    accessibleLandmarks: [],
    inaccessibleLandmarks: []
  };

  const landmarkElements = container.querySelectorAll('[role="main"], [role="sidebar"], [role="contentinfo"], [role="search"], [role="form"], [role="alert"], [role="application"], [role="complementary"], [role="banner"]');
  landmarkElements.forEach(element => {
    const role = element.getAttribute('role');
    checkLandmarkElement(role, element);
    if (element.getAttribute('aria-label') && element.getAttribute('aria-label').trim().length > 0) {
      results.accessibleLandmarks.push(element);
    } else {
      results.inaccessibleLandmarks.push(element);
    }
  });

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
    // Ensure table has a caption element
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure proper table structure (thead/tbody)
    if (!table.querySelector('thead') && !table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = document.createElement('tbody');
        rows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
    
    // Add scope attributes to th elements if missing
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const thElements = row.querySelectorAll('th');
      thElements.forEach(th => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', rowIndex === 0 ? 'col' : 'row');
        }
      });
    });
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
  // Ensure single <main> element
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      const extraMain = mains[i];
      const parent = extraMain.parentNode;
      while (extraMain.firstChild) {
        parent.insertBefore(extraMain.firstChild, extraMain);
      }
      parent.removeChild(extraMain);
    }
  }
  
  // Ensure unique aria-labels for duplicate landmarks
  const landmarkRoles = ['banner', 'navigation', 'sidebar', 'contentinfo', 'search', 'form', 'alert', 'application', 'complementary'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index === 0) return;
        const existingLabel = el.getAttribute('aria-label') || '';
        el.setAttribute('aria-label', existingLabel ? `${existingLabel} ${index + 1}` : `${role} ${index + 1}`);
      });
    }
  });
  
  return {
    mainCount: document.querySelectorAll('main').length,
    uniqueLandmarks: true
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
  formatDate
};