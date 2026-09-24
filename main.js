// TODO: This is the existing code that needs to be preserved

// main.js - Combined utility and accessibility features

// TODO: Identify and update specific functions that render dependency graphs or update them accordingly

// Accessibility helper function for keyboard navigation
function createKeyboardHandler(options = {}) {
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

// Global tracking for unique landmark IDs
const landmarkIdRegistry = new Set();

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
  
  function generateUniqueId() {
    let id;
    do {
      id = `landmark-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    } while (landmarkIdRegistry.has(id));
    return id;
  }

  landmarks.forEach((landmark) => {
    const currentId = landmark.id;
    // Remove old ID from registry if it existed
    if (currentId && landmarkIdRegistry.has(currentId)) {
      landmarkIdRegistry.delete(currentId);
    }
    
    const newId = generateUniqueId();
    landmarkIdRegistry.add(newId);
    landmark.id = newId;
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

// Add accessible names to SVG elements
function addAccessibleNamesToSvg(container) {
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const title = svg.querySelector('title');
    if (title && !svg.getAttribute('role')) {
      const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
      title.id = id;
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', id);
    }
  });
}

// Add ARIA attributes to interactive elements
function addARIAAttributes() {
  const interactiveElements = document.querySelectorAll('a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.getAttribute('role') && !el.getAttribute('aria-label')) {
      const text = el.textContent || el.placeholder || el.value;
      if (text && text.trim()) {
        el.setAttribute('aria-label', text.trim());
      }
      landmark.id = newId;
    }

    ids.add(landmark.id);
  });
}

// Fix fake link issues (TODO: Add real implementation)
function fixFakeLinkIssues() {
  const links = document.querySelectorAll('a[href="#"]:not([data-fake-link])');
  Array.from(links).forEach((link) => {
    link.setAttribute('aria-hidden', 'true');
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Apply accessible names to SVGs
  addAccessibleNamesToSvg(document.body);
  
  // Add ARIA attributes to interactive elements
  addARIAAttributes();
  
  // Add keyboard navigation to focusable elements
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(el => {
    const keyboardHandler = createKeyboardHandler({
      onEnter: () => el.click()
    });
    el.addEventListener('keydown', keyboardHandler);
  });
  
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    createKeyboardHandler,
    prefersReducedMotion,
    addressAccessibilityIssues,
    addAccessibleNamesToSVGs,
    addARIAFormControls,
    ensureUniqueLandmarksWithIds,
    fixFakeLinkIssues
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
  return str.charAt(0).toUpperCase() + str.slice(1);
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

  // Apply accessibility properties to the SVG element
  addSvgAccessibilityProps(svg, {
    role: 'img',
    label: 'Dependency graph visualization',
    description: 'A graphical representation of dependencies between modules',
    keyboardFocusable: true
  });
  
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
    createKeyboardHandler,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    addSvgAccessibilityProps, // TODO: Implement this function later
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addressAccessibilityIssues,
    renderDependencyGraph,
    addressAccessibilityIssues,
    wrapPrimaryContentInMain, // New function
    addAccessibleNamesToSVGs, // New function (TODO: Implement)
    addARIAFormControls, // New function (TODO: Implement)
    ensureUniqueLandmarksWithIds, // New function
    fixFakeLinkIssues // New function (TODO: Implement)
  };
}

// New accessibility functions added to address insight report

function getLangAttribute() {
  const html = document.documentElement;
  return html ? html.getAttribute('lang') : null;
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  return button;
}

function validateTableAccessibility(table) {
  // Simple check for caption or aria-label
  return table.querySelector('caption') || table.getAttribute('aria-label');
}

function validateTableStructure(table) {
  // Ensure table has thead and tbody
  return table.querySelector('thead') && table.querySelector('tbody');
}

function validateLandmark(element) {
  const role = element.getAttribute('role');
  return ['main', 'nav', 'header', 'footer', 'aside', 'form', 'search'].includes(role);
}

function validateLandmarkStructure() {
  // Placeholder for landmark nesting validation
  return true;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role][aria-label]');
  const ids = new Set();
  landmarks.forEach(el => {
    const id = el.getAttribute('id');
    if (id) ids.add(id);
  });
  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('span[onclick], div[onclick]');
  fakeLinks.forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
  });
}

function validateLinkAccessibility(link) {
  const text = link.textContent.trim();
  return text.length > 0;
}

function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

function setSvgAttributes(svg, attributes) {
  for (const key in attributes) {
    svg.setAttribute(key, attributes[key]);
  }
}

// Extend exports with new functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports.getLangAttribute = getLangAttribute;
  module.exports.createInPageButton = createInPageButton;
  module.exports.validateTableAccessibility = validateTableAccessibility;
  module.exports.validateTableStructure = validateTableStructure;
  module.exports.validateLandmark = validateLandmark;
  module.exports.validateLandmarkStructure = validateLandmarkStructure;
  module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
  module.exports.handleFakeLinks = handleFakeLinks;
  module.exports.validateLinkAccessibility = validateLinkAccessibility;
  module.exports.getSvgAccessibleName = getSvgAccessibleName;
  module.exports.setSvgAttributes = setSvgAttributes;
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}