const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// TODO: Identify and update specific functions that render dependency graphs or
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

// Accessibility helper function for keyboard navigation
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return (event) => {
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
  };
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElementsString = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableElementsString);
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = function(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  // Add event listener to container
  container.addEventListener('keydown', handleKeyDown);

  // Return control object
  return {
    disable: function() {
      container.removeEventListener('keydown', handleKeyDown);
    },
    enable: function() {
      container.addEventListener('keydown', handleKeyDown);
    }
  };
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return 'landmark-' + Math.random().toString(36).substring(2, 9) + Math.floor(Math.random() * 1.000);
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(id)) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
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
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Function to address accessibility issues from insight report
// Mock implementation of the function to address accessibility issues
// This should be replaced with actual logic based on the insight report structure
// For example, we might log the issues or take some action to fix them
/**
 * Addresses accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {string} insightReport.issue - The type of issue (e. g., 'REACT_025')
 * @param {Array} insightReport.elements - Elements related to the issue
 * @param {Object} insightReport.details - Additional details about the issue
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport) return;
  
  const issueType = insightReport.issue;
  
  switch (issueType) {
    case 'REACT_026': // Ensure SVG elements have accessibility attributes
      if (insightReport.elements) {
        insightReport.elements.forEach((element) => {
          if (element.id) {
            if (seenIds.has(element.id)) {
              const newId = element.id + '-' + Math.floor(Math.random() * 1.000);
              element.id = newId;
              seenIds.add(newId);
            } else {
              seenIds.add(element.id);
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
    initializeAccessibility,
    trapFocus,
    prefersReducedMotion
  };
}

/**
 * Adds accessibility properties to an SVG element
 * @param {SVGElement} svgElement - The SVG element to add accessibility props to
 * @param {Object} options - Accessibility options for the SVG
 * @param {string} [options.role='img'] - The ARIA role for the SVG
 * @param {string} [options.label] - The aria-label text
 * @param {string} [options.labelledBy] - The ID of an element that labels this SVG
 * @param {string} [options.description] - The aria-describedby text
 * @param {boolean} options.focusable - Whether the SVG is focusable
 * @param {boolean} options.keyboardFocusable - Whether the SVG can be focused via keyboard
 * @returns {SVGElement} - The SVG element with accessibility props applied
 */
function addSvgAccessibilityProps(svgElement, options = {}) {
  // Return null/undefined as- is if not a valid SVG element
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

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - Graph data structure with nodes and edges
 * @param {HTMLElement|string} container - DOM element or selector to render the graph
 * @param {Object} options - Visualization options
 * @returns {Object} - Graph visualization control object
 */
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
  
  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  
  containerEl.style.position = 'relative';
  containerEl.appendChild(svg);
  
  // Store graph data and control object