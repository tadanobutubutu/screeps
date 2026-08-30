// TODO: Implement this function for adding SVG accessibility props

// main.js - Combined utility and accessibility features

// TODO: Identify and update specific functions that render dependency graphs or

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

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
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
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
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

// TODO: Implement function for addressing accessibility issues from insight report
// Mock implementation of the function to address accessibility issues
// This should be replaced with actual logic based on the insight report structure
// For example, we might log the issues or take some action to fix them
/**
 * Addresses accessibility issues from an insight report
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {string} insightReport.issue - The type of issue (e.g., 'REACT_025')
 * @param {Array} insightReport.elements - Elements related to the issue
 * @param {Object} insightReport.details - Additional details about the issue
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issue) {
    return;
  }

  switch (insightReport.issue) {
    case 'REACT_025': // Ensure unique landmarks
      if (insightReport.elements) {
        const seenIds = new Set();
        insightReport.elements.forEach((element) => {
          if (element.id) {
            if (seenIds.has(element.id)) {
              const newId = `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              element.id = newId;
              seenIds.add(newId);
            } else {
              seenIds.add(element.id);
            }
          }
        });
      }
      break;
    default:
      console.warn(`Unknown accessibility issue type: ${insightReport.issue}`);
  }
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

/**
 * Adds accessibility properties to an SVG element
 * @param {SVGElement} svgElement - The SVG element to add accessibility props to
 * @param {Object} options - Accessibility options for the SVG
 * @param {string} [options.role='img'] - The ARIA role for the SVG
 * @param {string} [options.label] - The aria-label text
 * @param {string} [options.labelledBy] - The ID of an element that labels this SVG
 * @param {string} [options.description] - The aria-describedby text
 * @param {boolean} [options.focusable=true] - Whether the SVG is focusable
 * @param {boolean} [options.keyboardFocusable] - Whether the SVG can be focused via keyboard
 * @returns {SVGElement} - The SVG element with accessibility props applied
 */
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

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).UpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
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
 * @param {string|HTMLElement} container - DOM element or selector to render the graph
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
  const graphControl = {
    svg,
    container: containerEl,
    options: defaultOptions,
    updateData: function(newDependencies) {
      dependencies = newDependencies;
      this.redraw();
    },
    redraw: function() {
      // Clear existing content
      svg.innerHTML = '';
      
      if (!dependencies || !dependencies.nodes || !dependencies.edges) {
        console.warn('Invalid dependency graph structure');
        return;
      }
      
      // Calculate positions (simple circular layout for nodes)
      const nodes = dependencies.nodes;
      const edges = dependencies.edges;
      const centerX = containerEl.clientWidth / 2;
      const centerY = containerEl.clientHeight / 2;
      const radius = Math.min(containerEl.clientWidth, containerEl.clientHeight) / 2 - 50;
      
      // Position nodes
      const nodePositions = {};
      nodes.forEach((node, index) => {
        const angle = (index / nodes.length) * 2 * Math.PI;
        nodePositions[node.id] = {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        };
      });
      
      // Draw edges
      edges.forEach(edge => {
        const start = nodePositions[edge.source];
        const end = nodePositions[edge.target];
        
        if (start && end) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', start.x);
          line.setAttribute('y1', start.y);
          line.setAttribute('x2', end.x);
          line.setAttribute('y2', end.y);
          line.setAttribute('stroke', defaultOptions.edgeColor);
          line.setAttribute('stroke-width', '2');
          
          if (defaultOptions.animated) {
            line.style.animation = 'pulse 2s infinite';
          }
          
          svg.appendChild(line);
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        const pos = nodePositions[node.id];
        if (!pos) return;
        
        // Create node group
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('transform', `translate(${pos.x - defaultOptions.nodeWidth/2}, ${pos.y - defaultOptions.nodeHeight/2})`);
        
        // Node rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', defaultOptions.nodeWidth);
        rect.setAttribute('height', defaultOptions.nodeHeight);
        rect.setAttribute('rx', '5');
        rect.setAttribute('fill', defaultOptions.nodeColor);
        rect.setAttribute('stroke', '#333');
        rect.setAttribute('stroke-width', '1');
        
        // Node text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', defaultOptions.nodeWidth / 2);
        text.setAttribute('y', defaultOptions.nodeHeight / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', defaultOptions.nodeTextColor);
        text.setAttribute('font-size', '12');
        text.textContent = node.label || node.id;
        
        // Add hover interaction
        nodeGroup.appendChild(rect);
        nodeGroup.appendChild(text);
        
        // Add event listeners for accessibility
        nodeGroup.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (node.onClick) node.onClick(node);
          }
        });
        
        nodeGroup.addEventListener('click', () => {
          if (node.onClick) node.onClick(node);
        });
        
        // Set tabindex for keyboard navigation
        nodeGroup.setAttribute('tabindex', '0');
        
        svg.appendChild(nodeGroup);
      });
    }
  };
  
  // Initial render
  graphControl.redraw();
  
  // Add CSS animation for edges if needed
  if (defaultOptions.animated) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
  
  return graphControl;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    addSvgAccessibilityProps,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addressAccessibilityIssues,
    renderDependencyGraph
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}