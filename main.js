// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks
// - Identify and update specific functions that render dependency graphs or

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
 * Builds a dependency graph from a list of modules and their dependencies.
 * @param {Array<{name: string, dependencies: string[]}>} modules - List of modules with their dependencies.
 * @returns {Object} - An adjacency map representing the dependency graph.
 */
function buildDependencyGraph(modules) {
  const graph = {};
  modules.forEach(module => {
    graph[module.name] = module.dependencies.slice();
  });
  return graph;
}

/**
 * Renders a dependency graph as an SVG element.
 * @param {Object} graph - Adjacency map of the dependency graph.
 * @param {Object} [options] - Rendering options.
 * @param {number} [options.width=400] - Width of the SVG.
 * @param {number} [options.height=300] - Height of the SVG.
 * @returns {SVGElement} - The rendered SVG element.
 */
function renderDependencyGraph(graph, options = {}) {
  const { width = 400, height = 300 } = options;

  const svg = typeof document !== 'undefined'
    ? document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    : null;

  if (!svg) return null;

  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph');

  const nodes = Object.keys(graph);
  const nodeCount = nodes.length;
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;

  // Position nodes in a circle and append them
  const positions = {};
  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(nodeCount, 1);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions[node] = { x, y };

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', '#4a90e2');
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '1.5');
    svg.appendChild(circle);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(x));
    label.setAttribute('y', String(y + 4));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#fff');
    label.setAttribute('font-size', '10');
    label.textContent = node;
    svg.appendChild(label);
  });

  // Draw edges between dependent nodes
  nodes.forEach(node => {
    const deps = graph[node] || [];
    deps.forEach(dep => {
      if (!positions[dep]) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(positions[node].x));
      line.setAttribute('y1', String(positions[node].y));
      line.setAttribute('x2', String(positions[dep].x));
      line.setAttribute('y2', String(positions[dep].y));
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });
  });

  return svg;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    buildDependencyGraph,
    renderDependencyGraph
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}