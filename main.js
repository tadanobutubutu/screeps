// main.js - Combined utility and accessibility features

// TODO: Identify and update specific functions that render dependency graphs or
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Function to address accessibility issues from insight report
// Mock implementation of the function to address accessibility issues
// This should be replaced with actual logic based on the insight report structure
// For example, we might log the issues or take some action to fix them
function addressAccessibilityIssues(insightReport) {
  if (!insightReport) return;
  
  const issueType = insightReport.issue;
  
  switch (issueType) {
    case 'REACT_026': // Ensure SVG elements have accessibility attributes
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          if (element.tagName && element.tagName.toLowerCase() === 'svg') {
            // Apply accessibility props to SVG elements
            const options = insightReport.details || {};
            addSvgAccessibilityProps(element, options);
          }
        });
      }
      break;
    case 'REACT_027': // Ensure interactive elements are keyboard accessible
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          if (!element.hasAttribute('tabindex') && !element.hasAttribute('role')) {
            // Add default tabindex for interactive elements without proper roles
            const tagName = element.tagName ? element.tagName.toLowerCase() : '';
            const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
            if (interactiveTags.includes(tagName)) {
              element.setAttribute('tabindex', '0');
            }
          }
        });
      }
      break;
    case 'REACT_028': // Ensure color contrast is sufficient
      if (insightReport.details && insightReport.details.suggestions) {
        insightReport.details.suggestions.forEach((suggestion) => {
          if (suggestion.element && suggestion.newColor) {
            suggestion.element.style.color = suggestion.newColor;
          }
        });
      }
      break;
    case 'REACT_029': // Ensure form inputs have labels
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          const tagName = element.tagName ? element.tagName.toLowerCase() : '';
          if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
            if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
              // Check for associated label element
              const labels = document.querySelectorAll(`label[for="${element.id}"]`);
              if (labels.length === 0 && element.id) {
                // Create a label element if none exists
                const label = document.createElement('label');
                label.setAttribute('for', element.id);
                label.textContent = insightReport.details?.defaultLabel || 'Field';
                element.parentNode.insertBefore(label, element);
              }
            }
          }
        });
      }
      break;
    case 'REACT_030': // Ensure images have alt text
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          const tagName = element.tagName ? element.tagName.toLowerCase() : '';
          if (tagName === 'img') {
            if (!element.hasAttribute('alt')) {
              element.setAttribute('alt', insightReport.details?.defaultAlt || 'Image');
            }
          }
        });
      }
      break;
    case 'REACT_031': // Ensure focus indicators are visible
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          element.addEventListener('focus', () => {
            element.style.outline = '2px solid #005fcc';
            element.style.outlineOffset = '2px';
          });
          element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
          });
        });
      }
      break;
    case 'REACT_032': // Ensure dynamic content has live regions
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          if (!element.hasAttribute('aria-live')) {
            const politeness = insightReport.details?.politeness || 'polite';
            element.setAttribute('aria-live', politeness);
            element.setAttribute('aria-atomic', 'true');
          }
        });
      }
      break;
    default:
      console.warn(`Unknown accessibility issue type: ${insightReport.issue}`);
  }
}

/**
 * Processes an insight report and addresses all accessibility issues within it
 * @param {Object} insightReport - The insight report containing an array of issues
 * @param {Array} insightReport.issues - List of issue objects to be addressed
 */
function processInsightReport(insightReport) {
  if (!insightReport || !Array.isArray(insightReport.issues)) {
    return;
  }
  insightReport.issues.forEach(issue => {
    addressAccessibilityIssues(issue);
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

// Adds accessibility properties to an SVG element
// @param {SVGElement} svgElement - The SVG element to add accessibility props to
// @param {Object} options - Accessibility options for the SVG
// @param {string} [options.role='img'] - The ARIA role for the SVG
// @param {string} [options.label] - The aria-label text
// @param {string} [options.labelledBy] - The ID of an element that labels this SVG
// @param {string} [options.description] - The aria-describedby text
// @param {boolean} [options.focusable=true] - Whether the SVG is focusable
// @param {boolean} [options.keyboardFocusable=false] - Whether the SVG can be focused via keyboard
// @returns {SVGElement} - The SVG element with accessibility props applied
function addSvgAccessibilityProps(svgElement, options = {}) {
  // Return null/undefined as-is if not a valid SVG element
  if (!svgElement) {
    return svgElement;
  }

  // Validate that we have an SVG element (check for tagName property)
  const tagName = svgElement.tagName;
  if (!tagName || tagName.toLowerCase() !== 'svg') {
    return svgElement;
  }

  const {
    role = 'img',
    label,
    labelledBy,
    description,
    focusable = true,
    keyboardFocusable = false
  } = options;

  // Set the role attribute
  if (role) {
    svgElement.setAttribute('role', role);
  }

  // Set aria-label if provided
  if (label && typeof label === 'string') {
    svgElement.setAttribute('aria-label', label);
  }

  // Set aria-labelledby if provided
  if (labelledBy && typeof labelledBy === 'string') {
    svgElement.setAttribute('aria-labelledby', labelledBy);
  }

  // Set aria-describedby if provided
  if (description && typeof description === 'string') {
    svgElement.setAttribute('aria-describedby', description);
  }

  // Set focusable attribute (important for IE/older browsers)
  if (typeof svgElement.setAttribute === 'function') {
    svgElement.setAttribute('focusable', focusable ? 'true' : 'false');
  }

  // Add tabindex for keyboard focus if requested
  if (keyboardFocusable && typeof svgElement.setAttribute === 'function') {
    svgElement.setAttribute('tabindex', '0');
  }

  return svgElement;
}

// Checks if a value is an empty string, null, or undefined
// @param {*} value - The value to check
// @returns {boolean} - True if the value is empty
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

// Capitalizes the first letter of a string
// @param {string} str - The string to capitalize
// @returns {string} - The capitalized string
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generates a random integer between min and max (inclusive)
// @param {number} min - Minimum value
// @param {number} max - Maximum value
// @returns {number} - Random integer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamps a number between min and max values
// @param {number} num - Number to clamp
// @param {number} min - Minimum value
// @param {number} max - Maximum value
// @returns {number} - Clamped number
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Deep clones an object
// @param {*} obj - Object to clone
// @returns {*} - Cloned object
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// Renders a dependency graph visualization
// @param {Object} dependencies - Graph data structure with nodes and edges
// @param {string|HTMLElement} container - DOM element or selector to render the graph
// @param {Object} options - Visualization options
// @returns {Object} - Graph visualization control object
function renderDependencyGraph(dependencies, container, options = {}) {
  const defaultOptions = {
    nodeWidth: 100,
    nodeHeight: 40,
    nodeColor: '#4a90e2',
    nodeTextColor: '#ffffff',
    edgeColor: '#999999',
    animated: true,
    ...options
  };
  
  const containerEl = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
  
  if (!containerEl) {
    throw new Error('Container element not found for dependency graph rendering');
  }
}

/**
 * Revoke a session
 * @param {string} sessionId - The session ID to revoke
 * @returns {boolean} - True if session was revoked
 */
function revokeSession(sessionId) {
    return appState.sessions.delete(sessionId);
}

/**
 * Focus trap handler to keep focus within a container.
 * @param {Element} element - Element to monitor for focus events
 */
function handleFocusTrap(element) {
  if (!element || typeof element.querySelectorAll !== 'function') {
    return;
  }

  const focusableElements = Array.from(element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ));

  if (focusableElements.length === 0) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  
  // Set to track used ID suffixes for quick lookup
  const usedSuffixes = new Set();
  const landmarkIds = [];

  // Collect existing ID suffixes from landmarks that have IDs
  landmarks.forEach(landmark => {
    if (landmark.id) {
      const suffix = landmark.id.split('-')[1];
      if (suffix) {
        usedSuffixes.add(suffix);
        landmarkIds.push(landmark.id);
      }
    }
  });

  // Generate unique IDs for landmarks that don't have proper IDs
  landmarks.forEach((landmark, index) => {
    if (!landmark.id || !landmark.id.startsWith('landmark-')) {
      let uniqueId;
      let attempts = 0;
      
      do {
        uniqueId = `landmark-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;
        attempts++;
        if (attempts > 100) {
          uniqueId = `landmark-${Date.now()}-${Math.random()}`;
          break;
        }
      } while (usedSuffixes.has(uniqueId.split('-')[1]));
      
      usedSuffixes.add(uniqueId.split('-')[1]);
      landmark.id = uniqueId;
    } else {
      const suffix = landmark.id.split('-')[1];
      if (suffix && usedSuffixes.has(suffix)) {
        let uniqueId;
        let attempts = 0;
        
        do {
          uniqueId = `landmark-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;
          attempts++;
          if (attempts > 100) {
            uniqueId = `landmark-${Date.now()}-${Math.random()}`;
            break;
          }
        } while (usedSuffixes.has(uniqueId.split('-')[1]));
        
        usedSuffixes.add(uniqueId.split('-')[1]);
        landmark.id = uniqueId;
      } else if (suffix) {
        usedSuffixes.add(suffix);
      }
    }
  });
}

// Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph && !dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'graph');
  }
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if a link is accessible
function isLinkAccessible(linkElement) {
  if (!linkElement || linkElement.tagName !== 'A' && linkElement.tagName.toLowerCase() !== 'a') {
    return false;
  }

  // Check if link has href attribute
  const href = linkElement.getAttribute('href');
  if (!href || href === '' || href === '#' ) {
    return false;
  }

  // Check if link is not disabled or hidden
  if (linkElement.hasAttribute('disabled') && linkElement.disabled) {
    return false;
  }

  // Check if link is visible
  const style = window.getComputedStyle(linkElement);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }

  // Check if link has been clicked or is reachable
  try {
    const rect = linkElement.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }
  } catch (e) {
    // Element might not be in DOM
    return false;
  }

  return true;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Set language attribute (REACT_015)
  setDocumentLang();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Add main landmark if not present
  const mainLandmark = document.querySelector('main, [role="main"], #main-content');
  if (!mainLandmark) {
    const mainElement = document.querySelector('body > *:first-child');
    if (mainElement) {
      mainElement.setAttribute('role', 'main');
      mainElement.id = 'main-content';
    }
  }
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion,
    addSvgAccessibilityProps,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addressAccessibilityIssues,
    processInsightReport,
    renderDependencyGraph
  };
}

/**
 * Generates a report based on accessibility issues
 * @returns {Object} - Report containing accessibility issues found
 */
module.exports = {
  renderDependencyGraph,
  renderIndex,
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  initializeAccessibility,
  prefersReducedMotion,
  addSvgAccessibilityProps,
  isEmpty,
  capitalize,
  getRandomInt,
  clamp,
  deepClone,
  addressAccessibilityIssues
};