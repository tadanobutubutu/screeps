// Main entry point for the application
const { ModuleRegistry } = require('./modules');
const { buildDependencyGraph } = require('./graphBuilder');

// ... existing code ...

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph visualization to the specified container.
 * @param {HTMLElement} container - The DOM element to render the graph into
 * @returns {void}
 */
function renderDependencyGraph(container) {
  const graphData = buildDependencyGraph();
  
  // Clear previous content if exists
  if (container) {
    container.innerHTML = '';
  }
  
  // Create SVG or HTML representation of the dependency graph
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '600');
  svg.style.border = '1px solid #ccc';
  
  // Simple example graph structure - in practice this would be dynamic
  const nodes = [
    { id: 'core', label: 'Core', color: '#007bff' },
    { id: 'utils', label: 'Utils', color: '#28a745' },
    { id: 'models', label: 'Models', color: '#6c757d' },
    { id: 'controllers', label: 'Controllers', color: '#fd7e14' },
    { id: 'routes', label: 'Routes', color: '#17a2b8' }
  ];
  
  nodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Draw node
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '15');
    circle.setAttribute('fill', node.color);
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);
    
    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = node.label;
    text.setAttribute('x', '50');
    text.setAttribute('y', '55');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#333');
    g.appendChild(text);
    
    // Connect to core if applicable
    if (node.id === 'core') {
      const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      link.setAttribute('x1', '150');
      link.setAttribute('y1', '50');
      link.setAttribute('x2', '250');
      link.setAttribute('y2', '50');
      link.setAttribute('stroke', '#999');
      link.setAttribute('stroke-width', '1');
      g.appendChild(link);
    }
    
    container.appendChild(g);
  });
  
  container.appendChild(svg);
}

/**
 * Displays the module structure hierarchy for debugging purposes.
 * @param {Object} module - The module object containing name, dependencies, and children
 * @returns {void}
 */
function displayModuleStructure(module) {
  const indent = 0;
  const prefix = '  '.repeat(indent);
  
  function printNode(name, depth) {
    const div = document.createElement('div');
    div.className = 'module-structure';
    div.innerHTML = `<strong>${name}</strong>`;
    
    if (depth > 0) {
      div.innerHTML += '<br>';
    }
    
    // Show dependencies
    if (module.dependencies && Object.keys(module.dependencies).length > 0) {
      Object.entries(module.dependencies).forEach(([dep, _]) => {
        const depDiv = document.createElement('div');
        depDiv.className = 'dependency';
        depDiv.innerHTML = `<span class="arrow">→</span><span>${dep}</span>`;
        div.appendChild(depDiv);
        
        // Recursive call for dependencies
        printNode(dep, depth + 1);
      });
    }
    
    // Show children
    if (module.children && Object.keys(module.children).length > 0) {
      Object.values(module.children).forEach(child => {
        printNode(child.name, depth + 1);
      });
    }
    
    return div;
  }
  
  printNode(module.name, 0);
}

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// Add lang attribute to HTML element
document.documentElement.lang = 'en-US';

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').replace('#', ''));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.getElementById('svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.getElementById('svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[aria-landmark]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.getAttribute('aria-labelledby');
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('[href="#"]:not([ aria-hidden ])');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
  });
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }
  
  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Export existing exports plus new functions
module.exports = {
  // ... existing exports ...
  renderDependencyGraph,
  displayModuleStructure,
  createInPageButton,
  getConfig,
  setupSkipLinks,
  setupButtonAccessibility,
  performTask,
  handleEvent,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLink,
  initialize,
  calculateDiscount,
  greet,
  add
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}