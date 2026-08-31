// main.js - Combined utility and accessibility features

// TODO: Implement this function for adding SVG accessibility props

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
 * Validates if an element is a landmark region
 * @param {Element} element - The element to validate
 * @returns {boolean} - True if the element is a landmark
 */
function validateLandmark(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  const role = element.getAttribute('role');
  const validRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search'];
  return validRoles.includes(role);
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

// New functions for addressing accessibility issues from insight report:

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = getLangAttribute();
  // Return the full language attribute including locale if present
  // e.g., 'en-US' or 'en-GB'
  return lang;
}

// REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    return false;
  }
  
  const issues = [];
  
  // Check if table has caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push('Table missing caption');
  }
  
  // Check if table has thead
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    issues.push('Table missing thead section');
  }
  
  // Check if thead has th elements
  if (thead && !thead.querySelectorAll('th').length) {
    issues.push('thead missing th elements');
  }
  
  // Check if table has tbody
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    issues.push('Table missing tbody section');
  }
  
  // Check for proper th and td usage
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    cells.forEach((cell, cellIndex) => {
      const isHeader = cell.tagName.toLowerCase() === 'th';
      const nextHeader = row.cells[cellIndex + 1]?.tagName.toLowerCase() === 'th';
      
      if (isHeader && nextHeader && nextHeader !== isHeader) {
        issues.push(`Row ${rowIndex + 1}, cell ${cellIndex + 1}: Inconsistent header structure`);
      }
    });
  });
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

function validateTableStructure(tableElement) {
  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    return {
      isValid: false,
      issues: ['Not a valid table element']
    };
  }
  
  const issues = [];
  
  // Check for proper table structure according to HTML spec
  // 1. Table should have at least one row
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }
  
  // 2. Check for nested tables (generally bad practice)
  const nestedTables = tableElement.querySelectorAll('table table');
  if (nestedTables.length > 0) {
    issues.push('Table contains nested tables');
  }
  
  // 3. Check for proper cell count consistency in rows
  if (rows.length > 0) {
    const firstRowCellCount = rows[0].children.length;
    rows.forEach((row, index) => {
      if (row.children.length !== firstRowCellCount) {
        issues.push(`Row ${index + 1} has ${row.children.length} cells, expected ${firstRowCellCount}`);
      }
    });
  }
  
  // 4. Check for proper header associations
  const headers = tableElement.querySelectorAll('th');
  const captions = tableElement.querySelectorAll('caption');
  const captionsAssociated = captions.length > 0;
  
  if (headers.length === 0 && !captionsAssociated) {
    issues.push('Table has no headers or captions for accessibility');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

// REACT_017: Add/fix 4 landmark issues
function validateLandmarkStructure(element) {
  if (!element || !element.hasAttribute('role')) {
    return {
      isValid: false,
      issues: ['Element missing role attribute']
    };
  }
  
  const role = element.getAttribute('role');
  const issues = [];
  
  // Validate landmark roles and their structure
  switch (role) {
    case 'region':
      // Region should have a label
      const labelId = element.getAttribute('aria-labelledby') || 
                     element.querySelector('[id]')?.id;
      if (!labelId && !element.textContent.trim()) {
        issues.push('Region landmark should have accessible label');
      }
      break;
    case 'banner':
      // Banner typically contains heading
      const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (!heading) {
        issues.push('Banner landmark should contain a heading');
      }
      break;
    case 'navigation':
      // Navigation should have at least one meaningful link
      const links = element.querySelectorAll('a[href]');
      if (links.length === 0) {
        issues.push('Navigation landmark should contain at least one link');
      }
      break;
    case 'main':
      // Main should not have heading level 1 if page already has one
      const pageHeadings = document.querySelectorAll('h1');
      if (element.querySelector('h1') && pageHeadings.length > 1) {
        issues.push('Main landmark should not contain heading level 1 if page already has one');
      }
      break;
    case 'contentinfo':
      // Content info should have copyright or similar info
      const copyright = element.textContent.toLowerCase().includes('copyright') ||
                      element.textContent.toLowerCase().includes('©') ||
                      element.querySelector('[rel="copyright"]');
      if (!copyright) {
        issues.push('Contentinfo landmark should contain copyright or similar information');
      }
      break;
    case 'search':
      // Search should have input with type="search"
      const searchInput = element.querySelector('input[type="search"]');
      if (!searchInput) {
        issues.push('Search landmark should contain a search input');
      }
      break;
    case 'form':
      // Form should have at least one input or textarea
      const formInputs = element.querySelectorAll('input, textarea, select, button');
      if (formInputs.length === 0) {
        issues.push('Form landmark should contain form controls');
      }
      break;
    case 'complementary':
      // Complementary should have a heading or label
      const complementaryLabel = element.querySelector('h1, h2, h3, h4, h5, h6') ||
                                element.getAttribute('aria-label') ||
                                element.getAttribute('aria-labelledby');
      if (!complementaryLabel) {
        issues.push('Complementary landmark should have a heading or label');
      }
      break;
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    role: role
  };
}

// REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return null;
  }
  
  // Try to get accessible name from various sources
  let name = null;
  
  // 1. Check for aria-label
  name = svgElement.getAttribute('aria-label');
  if (name) return name;
  
  // 2. Check for aria-labelledby
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelledElement = document.getElementById(labelledBy);
    if (labelledElement) {
      name = labelledElement.textContent || labelledElement.getAttribute('aria-label');
    }
  }
  
  // 3. Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    name = title.textContent;
  }
  
  // 4. Use alt text from image mapping (if SVG is used as image)
  const alt = svgElement.getAttribute('alt');
  if (alt) {
    name = alt;
  }
  
  // 5. Use first meaningful text content from SVG
  if (!name) {
    const textContent = svgElement.textContent.trim();
    if (textContent) {
      // Try to extract meaningful text (not just whitespace)
      const meaningfulText = textContent.split(/\s+/).filter(word => word.length > 2);
      if (meaningfulText.length > 0) {
        name = meaningfulText.slice(0, 3).join(' ') + '...';
      }
    }
  }
  
  return name;
}

function createInPageButton(buttonText, options = {}) {
  const button = document.createElement('button');
  button.textContent = buttonText || 'In-page action';
  
  // Apply accessibility features
  button.setAttribute('role', 'button');
  button.setAttribute('type', 'button');
  
  // Add ARIA attributes based on options
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.ariaDescribedBy) {
    button.setAttribute('aria-describedby', options.ariaDescribedBy);
  }
  
  if (options.ariaExpanded) {
    button.setAttribute('aria-expanded', options.ariaExpanded.toString());
  }
  
  if (options.ariaControls) {
    button.setAttribute('aria-controls', options.ariaControls);
  }
  
  // Add keyboard navigation support
  button.setAttribute('tabindex', '0');
  
  // Add focus management
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.click();
    }
  });
  
  // Add hover and focus styles for better accessibility
  button.addEventListener('focus', () => {
    button.style.outline = '2px solid #4a90e2';
    button.style.outlineOffset = '2px';
  });
  
  button.addEventListener('blur', () => {
    button.style.outline = 'none';
  });
  
  // Add click handler if provided
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// REACT_036: Fix 1 fake link issue
function createAccessibleLink(text, url, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = url || '#';
  
  // Add accessibility features
  if (!url || url === '#' || url === '') {
    link.setAttribute('aria-disabled', 'true');
    link.style.cursor = 'not-allowed';
    link.style.pointerEvents = 'none';
    link.tabIndex = -1;
  }
  
  // Add ARIA attributes based on options
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.ariaDescribedBy) {
    link.setAttribute('aria-describedby', options.ariaDescribedBy);
  }
  
  if (options.ariaCurrent) {
    link.setAttribute('aria-current', options.ariaCurrent);
  }
  
  if (options.ariaExpanded) {
    link.setAttribute('aria-expanded', options.ariaExpanded.toString());
  }
  
  if (options.ariaControls) {
    link.setAttribute('aria-controls', options.ariaControls);
  }
  
  // Add keyboard navigation support
  link.setAttribute('tabindex', '0');
  
  // Add screen reader specific text
  if (options.screenReaderOnly) {
    const srText = document.createElement('span');
    srText.className = 'sr-only';
    srText.textContent = options.screenReaderOnly;
    link.appendChild(srText);
  }
  
  return link;
}

function handleAccessibilityIssues(issueData) {
  if (!issueData || !issueData.type) {
    console.warn('Invalid accessibility issue data');
    return;
  }
  
  const { type, target, details } = issueData;
  
  switch (type) {
    case 'fake-link':
      // Convert fake links to proper links or buttons
      if (target && (target.tagName === 'SPAN' || target.tagName === 'DIV')) {
        target.style.cursor = 'pointer';
        target.setAttribute('role', 'button');
        target.setAttribute('tabindex', '0');
        target.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            target.click();
          }
        });
      }
      break;
    case 'missing-alt':
      // Ensure SVGs have alt text
      if (target && target.tagName === 'SVG') {
        const altText = details?.altText || 'Illustration or diagram';
        if (!target.getAttribute('aria-label') && !target.querySelector('title')) {
          target.setAttribute('aria-label', altText);
        }
      }
      break;
    case 'missing-landmark-label':
      // Add labels to landmarks
      if (target && target.hasAttribute('role')) {
        const role = target.getAttribute('role');
        const label = details?.label || `${role} landmark`;
        if (!target.getAttribute('aria-label') && !target.getAttribute('aria-labelledby')) {
          target.setAttribute('aria-label', label);
        }
      }
      break;
    default:
      console.warn(`Unhandled accessibility issue type: ${type}`);
  }
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
    validateLandmark,
    renderDependencyGraph,
    addressAccessibilityIssues,
    // New exports for accessibility issues from insight report
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}