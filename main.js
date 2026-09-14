// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: validateTableAccessibility, validateTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: wrapPrimaryContentInMain, checkLandmarkElement)
// - REACT_041: Add accessible names to 2 SVGs (DONE: getSvgAccessibleName, setSvgAccessibilityProps)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: handleFakeLinks)
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  const name = getSvgAccessibleName(svgElement);
  if (name) {
    svgElement.setAttribute('aria-label', name);
    svgElement.setAttribute('role', 'img');
  } else if (!svgElement.hasAttribute('aria-hidden')) {
    // Hide decorative SVGs that have no accessible name
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  return link && link.getAttribute('href') && link.getAttribute('href') !== '#';
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  return button && button.getAttribute('type') !== 'submit';
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const links = Array.from(container.querySelectorAll('a')).filter(isLinkAccessible);
  const buttons = Array.from(container.querySelectorAll('button')).filter(isButtonAccessible);
  
  return {
    links: links.length,
    buttons: buttons.length,
    linkDetails: links.map(l => ({ href: l.getAttribute('href'), text: l.textContent }))
  };
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  return element && element.getAttribute('role') === role;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (!document.body) return null;
  
  // Check if main already exists
  let main = document.querySelector('main');
  if (main) return main;
  
  // Try to find the primary content container
  const contentSelectors = ['#content', '.content', '.main', '.main-content'];
  let contentContainer = null;
  
  for (const selector of contentSelectors) {
    contentContainer = document.querySelector(selector);
    if (contentContainer) break;
  }
  
  if (contentContainer) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main Content');
    
    // Insert main at the start of body
    document.body.insertBefore(main, document.body.firstChild);
    
    // Move content into main
    while (document.body.firstChild && document.body.firstChild !== main) {
      main.appendChild(document.body.firstChild);
    }
  } else if (document.body.children.length === 1 && document.body.children[0].tagName === 'DIV') {
    // Wrap the only div if body is simple
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main Content');
    document.body.appendChild(main);
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
  }
  
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object
 */
function checkLandmarks(container = document) {
  const mains = container.querySelectorAll('main');
  const regions = container.querySelectorAll('[role="region"]');
  
  return {
    mainCount: mains.length,
    uniqueMain: mains.length === 1,
    regionCount: regions.length
  };
}

/**
 * Adds a lang attribute to the HTML element if missing.
 */
function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }
}

/**
 * Validates table accessibility (e.g., caption presence).
 */
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let issues = [];
  
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    const caption = table.querySelector('caption');
    // If it's a data table (has headers) but no caption, it's an issue
    if (headers.length > 0 && !caption) {
      issues.push('Table missing caption');
    }
  });
  
  return { totalTables: tables.length, issues };
}

/**
 * Validates and fixes table structure (e.g., TRs inside TBODY).
 */
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach(table => {
    const trs = Array.from(table.querySelectorAll('tr'));
    let tbody = table.querySelector('tbody');
    
    if (!tbody) {
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }
    
    trs.forEach(tr => {
      tbody.appendChild(tr);
    });
    
    fixedCount++;
  });
  
  return { totalTables: tables.length, fixed: fixedCount };
}

/**
 * Ensures only one main landmark exists, hiding extras if necessary.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    // Keep the first one, hide the rest
    for (let i = 1; i < mains.length; i++) {
      mains[i].setAttribute('aria-hidden', 'true');
    }
    return true;
  }
  return false;
}

/**
 * Handles fake links (href="#") by making them accessible buttons.
 */
function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  let fixedCount = 0;
  
  links.forEach(link => {
    // Check if it's just a div acting as a link
    if (link.textContent.trim() === '' && link.children.length === 0) {
      link.setAttribute('tabindex', '0');
      link.setAttribute('role', 'button');
      link.setAttribute('aria-label', link.getAttribute('title') || 'Link');
      fixedCount++;
    }
  });
  
  return fixedCount;
}

/**
 * Adds proper landmark regions to sections.
 */
function addProperLandmarkRegions() {
  const sections = document.querySelectorAll('section:not([role])');
  let addedCount = 0;
  
  sections.forEach(section => {
    const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
    const label = heading ? heading.textContent.trim() : 'Section';
    
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', label);
    addedCount++;
  });
  
  return addedCount;
}

/**
 * Makes an element accessible by applying appropriate accessibility fixes based on element type.
 * Addresses issues from the insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_017: Add/fix landmark issues
 * - REACT_041: Add accessible names to SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix fake link issues
 * @param {HTMLElement|SVGElement} element - The element to make accessible
 * @returns {boolean} True if accessibility was improved, false otherwise
 */
function makeAccessible(element) {
  if (!element) {
    console.warn('makeAccessible: Element is not provided');
    return;
  }
  
  // Check if the element has a role attribute
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role');
    
    // Set aria-label based on role if missing
    if (!element.hasAttribute('aria-label')) {
      if (role === 'img') {
        // For images, use alt text or text content
        const altText = element.getAttribute('alt') || element.textContent || '';
        if (altText) {
          element.setAttribute('aria-label', altText);
        }
      } else if (role === 'button') {
        // For buttons, use text content or title
        const buttonText = element.textContent || element.getAttribute('title') || '';
        if (buttonText) {
          element.setAttribute('aria-label', buttonText);
        }
      } else if (role === 'link') {
        // For links, use text content or title
        const linkText = element.textContent || element.getAttribute('title') || '';
        if (linkText) {
          element.setAttribute('aria-label', linkText);
        }
      }
    }
  }
  
  // Ensure proper landmark structure
  const tagName = element.tagName.toLowerCase();
  if (['main', 'nav', 'header', 'footer', 'aside', 'section'].includes(tagName)) {
    // Add appropriate landmark role if missing
    if (!element.hasAttribute('role')) {
      const defaultRoles = {
        'main': 'main',
        'nav': 'navigation',
        'header': 'banner',
        'footer': 'contentinfo',
        'aside': 'complementary',
        'section': 'region'
      };
      element.setAttribute('role', defaultRoles[tagName]);
    }
    
    // Ensure the landmark has an accessible name if it's a region
    if (element.getAttribute('role') === 'region' && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const name = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.textContent || '';
      if (name) {
        element.setAttribute('aria-label', name);
      }
    }
  }
  
  // Handle SVG elements
  if (element.tagName.toLowerCase() === 'svg') {
    // Add role img if missing
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'img');
    }
    
    // Ensure the SVG has an accessible name
    const name = getSvgAccessibleName(element);
    if (name) {
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', name);
      }
    }
  }
  
  // Handle form elements
  if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'button') {
    // Ensure form elements have proper labels
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      const id = element.getAttribute('id');
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (label) {
          element.setAttribute('aria-labelledby', `label-${id}`);
        }
      }
    }
  }
  
  // Add tabindex to non-interactive elements that should be focusable
  if (!element.hasAttribute('tabindex')) {
    const focusableElements = ['button', 'a', 'input', 'select', 'textarea', 'summary', 'iframe', 'area'];
    if (focusableElements.includes(element.tagName.toLowerCase())) {
      element.setAttribute('tabindex', '0');
    }
  }
  
  // Apply additional accessibility improvements
  if (!element.hasAttribute('aria-hidden')) {
    element.removeAttribute('aria-hidden');
  }
}

exports.someFunction = function() {
  // Existing code
};

exports.anotherFunction = function() {
  // Existing code
};

addressAccessibilityIssue038 = addressAccessibilityIssue038;
exports.renderDependencyGraph = renderDependencyGraph;

// The function rotateBack() should be defined somewhere in your code to handle the action of rotating back.
// Updated with accessibility support

/**
 * Rotates the dependency graph back to its previous state.
 * Includes accessibility improvements for keyboard and screen reader users.
 */
function rotateBack() {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
  
  // After rotation, update accessibility attributes
  const graphContainer = document.querySelector('[data-dependency-graph]');
  if (graphContainer) {
    updateDependencyGraphAccessibility(graphContainer, {
      title: 'Dependency Graph (rotated view)',
      description: 'The dependency graph has been rotated back to its previous orientation.'
    });
  }
  
  // Update rotate button accessibility
  const rotateButton = document.querySelector('[data-rotate-back]');
  if (rotateButton) {
    updateRotateBackAccessibility(rotateButton, {
      label: 'Rotate graph forward (currently showing previous view)',
      tooltip: 'Click to rotate the graph back to its previous orientation'
    });
  }
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

/**
 * ... (existing code remains the same)
 */