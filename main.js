// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

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
  
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label').trim();
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
  
  // Set role="img" if not already set
  if (!svgElement.hasAttribute('role') && !svgElement.getAttribute('aria-label') && !svgElement.querySelector('title')) {
    svgElement.setAttribute('role', 'img');
  }
  
  // Ensure SVGs are focusable if interactive
  if (svgElement.hasAttribute('onclick') || svgElement.getAttribute('role') === 'button') {
    if (!svgElement.hasAttribute('tabindex')) {
      svgElement.setAttribute('tabindex', '0');
    }
    if (!svgElement.hasAttribute('role')) {
      svgElement.setAttribute('role', 'button');
    }
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  // Check if link has meaningful content
  const hasText = link.textContent && link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  // Check if href is valid (not empty or just "#")
  const href = link.getAttribute('href');
  const hasValidHref = href && href !== '#' && href !== '';
  
  // Link is accessible if it has content and valid href
  return (hasText || hasAriaLabel || hasAriaLabelledby || hasTitle) && hasValidHref;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  // Check if button has meaningful content
  const hasText = button.textContent && button.textContent.trim().length > 0;
  const hasAriaLabel = button.hasAttribute('aria-label');
  const hasAriaLabelledby = button.hasAttribute('aria-labelledby');
  const hasTitle = button.hasAttribute('title');
  
  // Check for aria-hidden content issues
  const hasAccessibleContent = hasText || hasAriaLabel || hasAriaLabelledby || hasTitle;
  
  return hasAccessibleContent;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: { total: 0, accessible: 0, issues: [] },
    buttons: { total: 0, accessible: 0, issues: [] }
  };
  
  if (typeof container === 'undefined' || container === null) {
    return results;
  }
  
  // Check links
  const links = container.querySelectorAll('a');
  links.forEach(link => {
    results.links.total++;
    if (isLinkAccessible(link)) {
      results.links.accessible++;
    } else {
      results.links.issues.push(link);
    }
  });
  
  // Check buttons
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    results.buttons.total++;
    if (isButtonAccessible(button)) {
      results.buttons.accessible++;
    } else {
      results.buttons.issues.push(button);
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
  const issues = [];
  
  if (!element) {
    issues.push({ role, issue: 'Element is null or undefined' });
    return issues;
  }
  
  // Check if element has the correct role
  const elementRole = element.getAttribute('role');
  if (elementRole !== role) {
    issues.push({ role, issue: `Expected role "${role}" but found "${elementRole}"` });
  }
  
  // Check for accessible name
  const hasLabel = element.hasAttribute('aria-label') || 
                   element.hasAttribute('aria-labelledby') ||
                   (element.textContent && element.textContent.trim().length > 0);
  
  if (!hasLabel) {
    issues.push({ role, issue: 'Landmark missing accessible name' });
  }
  
  return issues;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }
  
  // Check if main already exists
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }
  
  // Find the body content and wrap it
  const body = document.body;
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  // Move all body children into main
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }
  
  body.appendChild(main);
  
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  const results = {
    landmarks: [],
    issues: []
  };
  
  if (typeof container === 'undefined' || container === null) {
    return results;
  }
  
  // Define landmark roles to check
  const landmarkRoles = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'form', 'search'];
  
  landmarkRoles.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"], ${role}`);
    elements.forEach(element => {
      const elementRole = element.getAttribute('role') || element.tagName.toLowerCase();
      results.landmarks.push({ role: elementRole, element });
      
      const issues = checkLandmarkElement(role, element);
      results.issues.push(...issues);
    });
  });
  
  return results;
}

/**
 * Adds a main landmark to the container if one doesn't exist.
 * @param {HTMLElement} [container=document] - The container to add main landmark to
 * @returns {HTMLElement|null} The main element created or existing
 */
function addMainLandmark(container = document) {
  if (typeof container === 'undefined' || container === null) {
    return null;
  }
  
  // Check if main already exists
  let main = container.querySelector('main') || container.querySelector('[role="main"]');
  
  if (main) {
    return main;
  }
  
  // Create main element
  main = document.createElement('main');
  main.setAttribute('role', 'main');
  
  // If container is document or body, wrap content
  if (container === document || container === document.body || container.tagName === 'BODY') {
    // Find first non-script/style child
    let firstContent = null;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i];
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && child.tagName !== 'LINK' && child.tagName !== 'META') {
        firstContent = child;
        break;
      }
    }
    
    if (firstContent) {
      container.insertBefore(main, firstContent);
    } else {
      container.appendChild(main);
    }
  } else {
    container.insertBefore(main, container.firstChild);
  }
  
  return main;
}

/**
 * Adds accessible names to SVG elements in the document.
 * @param {HTMLElement} [container=document] - The container to check for SVGs
 * @returns {Array} Array of SVG elements that were updated
 */
function addSvgAccessibleNames(container = document) {
  const updated = [];
  
  if (typeof container === 'undefined' || container === null) {
    return updated;
  }
  
  const svgs = container.querySelectorAll('svg');
  svgs.forEach(svg => {
    const currentName = getSvgAccessibleName(svg);
    
    if (!currentName) {
      // Try to get name from adjacent or parent element
      const parent = svg.parentElement;
      if (parent) {
        const previousSibling = svg.previousElementSibling;
        if (previousSibling && previousSibling.textContent) {
          svg.setAttribute('aria-label', previousSibling.textContent.trim());
          updated.push(svg);
        } else if (parent.textContent && parent.textContent.trim()) {
          svg.setAttribute('aria-label', parent.textContent.trim());
          updated.push(svg);
        }
      }
    }
  });
  
  return updated;
}

/**
 * Ensures that all landmarks in the document are unique.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Array} Array of duplicate landmarks that were fixed
 */
function ensureUniqueLandmarks(container = document) {
  const fixed = [];
  
  if (typeof container === 'undefined' || container === null) {
    return fixed;
  }
  
  const landmarkRoles = ['navigation', 'banner', 'contentinfo', 'complementary'];
  const role