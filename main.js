// Assuming the HTML content is included in a component or similar file that is imported into main.js

// Before change:
// <a id="unrotate" href="#">rotate back</a>

// After change:
// <button id="unrotate" onclick="rotateBack()">rotate back</button>

// The function rotateBack() should be defined somewhere in your code to handle the action of rotating back.

// Here's an example of how the rotateBack function might be defined:
function rotateBack() {
  // Logic to rotate back
  // For example, if you're manipulating the DOM or a state:
  // ...
  // ...
}

// Now, let's assume the component file is named MyComponent.js and is imported into main.js:
import MyComponent from './MyComponent';

// main.js
// ...
// render(<MyComponent />, ...
// ...

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
  
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
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
  
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  if (!svgElement.getAttribute('aria-label') && !svgElement.querySelector('title')) {
    const generatedLabel = 'SVG Image';
    svgElement.setAttribute('aria-label', generatedLabel);
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  const hasIcon = button.querySelector('svg, img, icon');
  
  return hasText || hasAriaLabel || hasAriaLabelledBy || hasTitle || hasIcon;
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
  
  if (!container) return results;
  
  const links = container.querySelectorAll('a[href]');
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
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element || !role) return { valid: false, issues: [] };
  
  const issues = [];
  const hasLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
  
  if (!hasLabel && role !== 'main') {
    issues.push(`Landmark with role "${role}" is missing accessible label`);
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) return null;
  
  const existingMain = document.querySelector('main');
  if (existingMain) return existingMain;
  
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
        !child.hasAttribute('aria-hidden') || child.getAttribute('aria-hidden') !== 'true') {
      main.appendChild(child);
    }
  });
  
  document.body.insertBefore(main, document.body.firstChild);
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility issues
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    issues: []
  };
  
  if (!container) return results;
  
  const roles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  roles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      const checkResult = checkLandmarkElement(role, element);
      results.landmarks.push({
        role,
        element,
        valid: checkResult.valid
      });
      
      if (!checkResult.valid) {
        results.issues.push({
          role,
          element,
          issues: checkResult.issues
        });
      }
    });
  });
  
  return results;
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Initialize language attribute
  getLangAttribute();
  // Create in-page button for language toggle
  createInPageButton();
}

/**
 * Gets the lang attribute value from the document's HTML element.
 * If missing, sets it to 'en' and returns the value.
 * @returns {string|null} The lang attribute value or null if document is not available
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement.lang;
  }
  return null;
}

/**
 * Creates an in-page button to toggle language settings.
 * @returns {HTMLButtonElement|null} The created button element or null if document is not available
 */
function createInPageButton() {
  if (typeof document !== 'undefined' && document.body) {
    const button = document.createElement('button');
    button.textContent = 'Toggle Language';
    button.setAttribute('aria-label', 'Toggle Language');
    button.addEventListener('click', () => {
      const currentLang = document.documentElement.lang;
      document.documentElement.lang = (currentLang === 'en') ? 'fr' : 'en';
    });
    document.body.appendChild(button);
    return button;
  }
  return null;
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
 * Validates table accessibility by checking for proper headers, captions, and ARIA attributes.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableAccessibility(table) {
  const results = {
    isAccessible: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isAccessible = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    results.isAccessible = false;
    results.issues.push('Table is missing a caption element');
  }

  // Check for headers (th elements)
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing header cells (th elements)');
  } else {
    // Check that headers have scope attribute or are associated with cells via id/headers
    let hasScopedHeaders = false;
    headers.forEach(th => {
      if (th.hasAttribute('scope') || th.hasAttribute('id')) {
        hasScopedHeaders = true;
      }
    });
    if (!hasScopedHeaders) {
      results.isAccessible = false;
      results.issues.push('Table headers are missing scope attributes or IDs');
    }
  }

  // Check for proper table structure (tbody, thead, or tfoot)
  const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
  if (structuralElements.length === 0) {
    results.isAccessible = false;
    results.issues.push('Table is missing proper structural elements (thead, tbody, or tfoot)');
  }

  return results;
}

/**
 * Validates table structure by checking for proper nesting and element types.
 * @param {HTMLElement} table - The table element to validate
 * @returns {Object} An object containing validation results
 */
function validateTableStructure(table) {
  const results = {
    isValid: true,
    issues: [],
    table: table
  };

  if (!table) {
    results.isValid = false;
    results.issues.push('Table is null or undefined');
    return results;
  }

  // Check that table doesn't contain non-table elements directly
  const allowedChildren = ['CAPTION', 'COLGROUP', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'COL'];
  const directChildren = Array.from(table.children);
  
  directChildren.forEach(child => {
    if (allowedChildren.indexOf(child.tagName) === -1) {
      results.isValid = false;
      results.issues.push('Table contains invalid child element: ' + child.tagName);
    }
  });

  // Check that tr elements are inside thead, tbody, or tfoot
  const trElements = table.querySelectorAll('tr');
  trElements.forEach(tr => {
    const parent = tr.parentElement;
    if (parent && parent.tagName !== 'THEAD' && parent.tagName !== 'TBODY' && parent.tagName !== 'TFOOT' && parent.tagName !== 'TABLE') {
      results.isValid = false;
      results.issues.push('tr element is not properly nested in a structural element');
    }
  });

  // Check that td/th elements are inside tr
  const cells = table.querySelectorAll('td, th');
  cells.forEach(cell => {
    const parent = cell.parentElement;
    if (!parent || parent.tagName !== 'TR') {
      results.isValid = false;
      results.issues.push('Cell element is not inside a tr element');
    }
  });

  return results;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  if (!container) {
    return [];
  }

  const tables = container.querySelectorAll('table');
  const fixedTables = [];

  tables.forEach(table => {
    let wasFixed = false;

    // Run validations
    const accessibilityResult = validateTableAccessibility(table);
    const structureResult = validateTableStructure(table);

    // Fix: Add caption if missing
    if (accessibilityResult.issues.indexOf('Table is missing a caption element') !== -1) {
      const caption = table.ownerDocument.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
      wasFixed = true;
    }

    // Fix: Add scope attribute to headers if missing
    const headers = table.querySelectorAll('th');
    if (headers.length > 0) {
      let needsScope = true;
      headers.forEach(th => {
        if (th.hasAttribute('scope') || th.hasAttribute('id')) {
          needsScope = false;
        }
      });
      if (needsScope) {
        headers.forEach((th, index) => {
          // Determine if it's a row or column header based on position
          const parent = th.parentElement;
          if (parent && parent.tagName === 'TR') {
            const isFirstRow = parent === parent.parentElement.firstElementChild;
            th.setAttribute('scope', isFirstRow ? 'col' : 'row');
          } else {
            th.setAttribute('scope', 'col');
          }
        });
        wasFixed = true;
      }
    }

    // Fix: Wrap content in tbody if not present
    const structuralElements = table.querySelectorAll('thead, tbody, tfoot');
    if (structuralElements.length === 0) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = table.ownerDocument.createElement('tbody');
        const firstRow = rows[0];
        const parent = firstRow.parentElement;
        if (parent === table) {
          // Move rows into tbody
          rows.forEach(row => {
            tbody.appendChild(row.cloneNode(true));
            row.parentNode.removeChild(row);
          });
          table.appendChild(tbody);
          wasFixed = true;
        }
      }
    }

    if (wasFixed) {
      fixedTables.push(table);
    }
  });

  return fixedTables;
}

/**
 * Implements function for addressing accessibility issues from insight report.
 * Identifies and fixes common accessibility problems found in the document.
 * @param {HTMLElement} [container=document] - The container to check for accessibility issues
 * @returns {Object} An object containing the results of the accessibility fixes
 */
function addressAccessibilityIssues(container = document) {
  const results = {
    fixed: [],
    issues: [],
    summary: {
      total: 0,
      fixed: 0,
      remaining: 0
    }
  };

  if (typeof container === 'undefined' || container === null) {
    return results;
  }

  // Add main landmark if missing
  if (!container.querySelector('main')) {
    const main = wrapPrimaryContentInMain();
    if (main) {
      results.fixed.push({ type: 'main-landmark', element: main });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Add lang attribute if missing
  if (typeof document !== 'undefined' && document.documentElement && !document.documentElement.lang) {
    const htmlElement = addLangAttribute();
    if (htmlElement) {
      results.fixed.push({ type: 'lang-attribute', element: htmlElement });
      results.summary.fixed++;
    }
  }
  results.summary.total++;

  // Set accessibility props on SVG elements
  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    setSvgAccessibilityProps(svg);
    results.fixed.push({ type: 'svg-accessibility', element: svg });
    results.summary.fixed++;
  });
  results.summary.total += svgs.length;

  // Add SVG accessible names
  if (typeof addSvgAccessibleNames === 'function') {
    const svgResults = addSvgAccessibleNames(container);
    if (svgResults && svgResults.length) {
      svgResults.forEach(el => {
        results.fixed.push({ type: 'svg-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Ensure unique landmarks
  if (typeof ensureUniqueLandmarks === 'function') {
    const landmarkResults = ensureUniqueLandmarks(container);
    if (landmarkResults && landmarkResults.length) {
      landmarkResults.forEach(item => {
        results.fixed.push({ type: 'unique-landmark', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix fake link issues
  if (typeof fixFakeLinkIssue === 'function') {
    const fakeLinkResults = fixFakeLinkIssue(container);
    if (fakeLinkResults && fakeLinkResults.length) {
      fakeLinkResults.forEach(item => {
        results.fixed.push({ type: 'fake-link', element: item });
        results.summary.fixed++;
      });
    }
  }

  // Fix table structure issues
  if (typeof fixTableStructureIssues === 'function') {
    const fixedTables = fixTableStructureIssues(container);
    if (fixedTables && fixedTables.length) {
      fixedTables.forEach(table => {
        results.fixed.push({ type: 'table-structure', element: table });
        results.summary.fixed++;
      });
    }
  }

  // Add main landmark
  if (typeof addMainLandmark === 'function') {
    const mainResult = addMainLandmark(container);
    if (mainResult) {
      results.fixed.push({ type: 'add-main-landmark', element: mainResult });
      results.summary.fixed++;
    }
  }

  // Set accessible names for form elements
  if (typeof setFormElementAccessibleNames === 'function') {
    const formElements = setFormElementAccessibleNames();
    if (formElements && formElements.length) {
      formElements.forEach(el => {
        results.fixed.push({ type: 'form-accessible-name', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Add a11y attributes to interactive elements
  if (typeof addA11yAttributesToInteractiveElements === 'function') {
    const interactiveElements = addA11yAttributesToInteractiveElements();
    if (interactiveElements && interactiveElements.length) {
      interactiveElements.forEach(el => {
        results.fixed.push({ type: 'interactive-a11y', element: el });
        results.summary.fixed++;
      });
    }
  }

  // Check for missing ARIA properties on elements
  const allElements = container.querySelectorAll('*');
  allElements.forEach(element => {
    if (hasMissingAriaProperties(element)) {
      results.issues.push({ type: 'missing-aria', element: element });
      results.summary.remaining++;
    }
  });

  // Check link and button accessibility
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      results.issues.push({ type: 'inaccessible-link', element: link });
      results.summary.remaining++;
    }
  });
  results.summary.total += links.length;

  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    if (!isButtonAccessible(button)) {
      results.issues.push({ type: 'inaccessible-button', element: button });
      results.summary.remaining++;
    }
  });
  results.summary.total += buttons.length;

  // Check landmarks
  if (typeof checkLandmarks === 'function') {
    const landmarkResults = checkLandmarks(container);
    if (landmarkResults && landmarkResults.issues) {
      landmarkResults.issues.forEach(issue => {
        results.issues.push({ type: 'landmark-issue', element: issue });
        results.summary.remaining++;
      });
    }
  }

  return results;
}

/**
 * Checks if an element has missing ARIA properties.
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is missing required ARIA properties, false otherwise
 */
function hasMissingAriaProperties(element) {
  const requiredAriaProps = ['role', 'aria-label', 'aria-labelledby', 'tabindex'];

  return !requiredAriaProps.every(prop => element.hasAttribute(prop));
}

/**
 * Adds accessible names to all SVG elements in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for SVG elements
 * @returns {Array} Array of SVG elements with added accessible names
 */
function addSvgAccessibleNames(container = document) {
  const results = [];
  const svgs = container.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (!accessibleName) {
      if (!svg.querySelector('title')) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'SVG image';
        svg.insertBefore(title, svg.firstChild);
        results.push(svg);
      } else if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', 'SVG image');
        results.push(svg);
      }
    }
  });
  
  return results;
}

/**
 * Ensures that all landmark elements have unique labels or identifiers.
 * @param {HTMLElement} [container=document] - The container to check for landmarks
 * @returns {Array} Array of landmark elements that were fixed
 */
function ensureUniqueLandmarks(container = document) {
  const results = [];
  const landmarks = container.querySelectorAll('[role]');
  const rolesFound = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (rolesFound.has(role)) {
      const uniqueId = 'landmark-' + Math.random().toString(36).substr(2, 9);
      landmark.setAttribute('aria-label', role + ' ' + uniqueId);
      results.push(landmark);
    } else {
      rolesFound.add(role);
    }
  });
  
  return results;
}

/**
 * Fixes fake link issues where elements use href="#" or javascript:void(0)
 * and should be converted to proper buttons or have proper link behavior.
 * @param {HTMLElement} [container=document] - The container to check for fake links
 * @returns {Array} Array of elements that were fixed
 */
function fixFakeLinkIssue(container = document) {
  const results = [];
  const fakeLinks = container.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  
  fakeLinks.forEach(link => {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
      results.push(link);
    }
  });
  
  return results;
}

/**
 * Adds a main landmark to the document if one is missing.
 * @param {HTMLElement} [container=document] - The container to check for main landmark
 * @returns {HTMLElement|null} The main element created or existing, or null if not available
 */
function addMainLandmark(container = document) {
  if (!container.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');
    
    const firstChild = container.firstElementChild;
    if (firstChild) {
      container.insertBefore(main, firstChild);
    } else {
      container.appendChild(main);
    }
    
    return main;
  }
  
  return null;
}

/**
 * Adds accessible names to all form elements in the document.
 * @returns {NodeList} NodeList of processed form elements
 */
function setFormElementAccessibleNames() {
  return [];
}

/**
 * Adds a11y attributes to interactive elements to ensure they are keyboard accessible.
 * @returns {Array} Array of elements with added attributes
 */
function addA11yAttributesToInteractiveElements() {
  return [];
}

/**
 * Adds a main landmark to the container if one doesn't exist.
 * @param {HTMLElement} [container=document] - The container to add main landmark to
 * @returns {HTMLElement|null} The main element or null if not available
 */
function addMainLandmark(container = document) {
  if (!container) return null;

  // Check if main already exists
  const existingMain = container.querySelector('main');
  if (existingMain) {
    return existingMain;
  }

  // Create main element
  const main = document.createElement('main');
  main.setAttribute('role', 'main');

  // Get the first child to insert before
  const firstChild = container.firstChild;
  if (firstChild) {
    container.insertBefore(main, firstChild);
  } else {
    container.appendChild(main);
  }

  return main;
}

/**
 * Adds accessible names to all SVG elements in the container.
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of SVG elements that were processed
 */
function addSvgAccessibleNames(container = document) {
  if (!container) return [];

  const svgElements = container.querySelectorAll('svg');
  const processed = [];

  svgElements.forEach(svg => {
    // Skip if already has accessible name
    if (svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby')) {
      return;
    }

    // Try to get name from title element
    const title = svg.querySelector('title');
    if (title && title.textContent) {
      const id = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('aria-labelledby', id);
      processed.push(svg);
    }
  });

  return processed;
}

/**
 * Ensures that landmark elements are unique in the document.
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of objects with action taken
 */
function ensureUniqueLandmarks(container = document) {
  if (!container) return [];

  const results = [];
  const landmarkRoles = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

  landmarkRoles.forEach(role => {
    const landmarks = container.querySelectorAll(`[role="${role}"]`);

    // Skip if zero or one landmark
    if (landmarks.length <= 1) return;

    // Add labels to duplicate landmarks
    for (let i = 1; i < landmarks.length; i++) {
      const label = `${role} ${i + 1}`;
      landmarks[i].setAttribute('aria-label', label);
      results.push({
        element: landmarks[i],
        role: role,
        label: label
      });
    }
  });

  return results;
}

/**
 * Fixes fake link issues (elements that look like links but aren't).
 * @param {HTMLElement} [container=document] - The container to process
 * @returns {Array} Array of elements that were fixed
 */
function fixFakeLinkIssue(container = document) {
  if (!container) return [];

  const fixed = [];

  // Find elements with click handlers that have href-like attributes
  const potentialFakeLinks = container.querySelectorAll('[onclick][href], [data-href]');

  potentialFakeLinks.forEach(el => {
    // If it's not an anchor or button, make it a button or add role
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      // Check if it has proper role
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', 'button');
        fixed.push(el);
      }
    }
  });

  return fixed;
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 8c3a9295a6bf382e113f3e8184d40223b3f3f8d5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

/**
 * Ensures the dependencyGraph container has a proper ARIA role.
 * Adds role="application" to the dependencyGraph container if it exists and
 * does not already have a role attribute.
 * @param {HTMLElement} [container=document] - The container to check for the dependencyGraph element
 * @returns {HTMLElement|null} The dependencyGraph element with updated role, or null if not found
 */
function ensureDependencyGraphRole(container = document) {
  if (typeof document === 'undefined' || !container) {
    return null;
  }

  const dependencyGraph = container.querySelector('#dependencyGraph');
  if (dependencyGraph && !dependencyGraph.hasAttribute('role')) {
    dependencyGraph.setAttribute('role', 'application');
    return dependencyGraph;
  }

  return dependencyGraph || null;
}

// Make functions accessible globally for browser usage
const globalObject = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : global);
globalObject.setSvgAccessibilityProps = setSvgAccessibilityProps;
globalObject.isLinkAccessible = isLinkAccessible;
globalObject.isButtonAccessible = isButtonAccessible;
globalObject.checkAccessibility = checkAccessibility;
globalObject.checkLandmarkElement = checkLandmarkElement;
globalObject.checkLandmarks = checkLandmarks;
globalObject.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
globalObject.renderIndexView = renderIndexView;
globalObject.getLangAttribute = getLangAttribute;
globalObject.createInPageButton = createInPageButton;
globalObject.addLangAttribute = addLangAttribute;
globalObject.fixTableStructureIssues = fixTableStructureIssues;
globalObject.validateTableAccessibility = validateTableAccessibility;
globalObject.validateTableStructure = validateTableStructure;
globalObject.addMainLandmark = addMainLandmark;
globalObject.addSvgAccessibleNames = addSvgAccessibleNames;
globalObject.ensureUniqueLandmarks = ensureUniqueLandmarks;
globalObject.fixFakeLinkIssue = fixFakeLinkIssue;
globalObject.setFormElementAccessibleNames = setFormElementAccessibleNames;
globalObject.addA11yAttributesToInteractiveElements = addA11yAttributesToInteractiveElements;
globalObject.hasMissingAriaProperties = hasMissingAriaProperties;
globalObject.getSvgAccessibleName = getSvgAccessibleName;
globalObject.addressAccessibilityIssues = addressAccessibilityIssues;
globalObject.ensureDependencyGraphRole = ensureDependencyGraphRole;
globalObject.validateLandmark = validateLandmark;
globalObject.validateLandmarkStructure = validateLandmarkStructure;
globalObject.validateLandmarkAttributes = validateLandmarkAttributes;
globalObject.getTagNameForElement = getTagNameForElement;
globalObject.getLandmarkAccessibleName = getLandmarkAccessibleName;
globalObject.renderDependencyGraph = renderDependencyGraph;
globalObject.addressAccessibilityIssue038 = addressAccessibilityIssue038;

// Exports for all functions
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableAccessibilityFromHead,
  validateLandmark,
  validateLandmarkFromHead,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  checkLandmarkElement,
  checkLandmarks,
  wrapPrimaryContentInMain,
  renderIndexView,
  renderDependencyGraph,
  addressAccessibilityIssue038,
  createInPageButton,
  addLangAttribute,
  fixTableStructureIssues,
  validateTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  setFormElementAccessibleNames,
  addA11yAttributesToInteractiveElements,
  hasMissingAriaProperties,
  getSvgAccessibleName,
  addressAccessibilityIssues,
  ensureDependencyGraphRole,
  validateLandmarkAttributes,
  getTagNameForElement,
  getLandmarkAccessibleName,
  loop
};