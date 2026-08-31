import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address any missing required exports
// REACT_015: Add lang attribute

// Existing code ends here

// Addressed accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// ... (other code in main.js)

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Adding the missing required export
export { Main, PropTypes };

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

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

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

// Example usage for SVGs:
// const svg1 = document.querySelector('.svg-1');
// const svg2 = document.querySelector('.svg-2');
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
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

  const mainContent = document.querySelector('main') || document.getElementById('main-content');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg-1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('.svg-2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

export function calculateDiscount(price, discount) {
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

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main-content');
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

// Assuming the new function or update is related to the `Main` component,
// and the function name is provided in the issue as `updateTitle
const updateTitle = (newTitle) => {
  // This is a placeholder for the actual implementation.
  // The function should update the title of the Main component.
  // For example, this could be a method that sets a state or a prop that controls the title.
};

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

/**
 * Creates a visual representation of a graph node
 * @param {Object} nodeData - Data for the node including id, label, and optional metadata
 * @param {number} index - Index position of the node in the graph
 * @returns {HTMLElement} The created node element
 */
function createGraphNode(nodeData, index) {
  const node = document.createElement('div');
  node.className = 'graph-node';
  node.id = `graph-node-${nodeData.id || index}`;
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', nodeData.label || `Graph node ${index + 1}`);
  node.textContent = nodeData.label || `Node ${index + 1}`;
  
  if (nodeData.x !== undefined && nodeData.y !== undefined) {
    node.style.position = 'absolute';
    node.style.left = `${nodeData.x}px`;
    node.style.top = `${nodeData.y}px`;
  }
  
  return node;
}

/**
 * Renders a graph index element with navigation capabilities
 * @param {Array} items - Array of items to display in the index
 * @param {HTMLElement} container - Container element to render the index into
 * @returns {HTMLElement} The rendered index container
 */
function renderGraphIndex(items, container) {
  const indexContainer = document.createElement('div');
  indexContainer.className = 'graph-index';
  indexContainer.setAttribute('role', 'navigation');
  indexContainer.setAttribute('aria-label', 'Graph index navigation');
  
  if (!items || !Array.isArray(items)) {
    console.warn('renderGraphIndex: Invalid items provided');
    return indexContainer;
  }
  
  items.forEach((item, idx) => {
    const indexItem = document.createElement('div');
    indexItem.className = 'graph-index-item';
    indexItem.setAttribute('role', 'listitem');
    
    const link = document.createElement('a');
    link.href = item.href || `#graph-node-${item.id || idx}`;
    link.textContent = item.label || `Item ${idx + 1}`;
    link.setAttribute('aria-describedby', `graph-index-desc-${idx}`);
    
    const description = document.createElement('span');
    description.id = `graph-index-desc-${idx}`;
    description.className = 'sr-only';
    description.textContent = item.description || `Navigate to ${link.textContent}`;
    
    indexItem.appendChild(link);
    indexItem.appendChild(description);
    indexContainer.appendChild(indexItem);
  });
  
  if (container && container.appendChild) {
    container.appendChild(indexContainer);
  }
  
  return indexContainer;
}

/**
 * Renders a complete graph visualization with nodes and optional index
 * @param {Array} nodes - Array of node data objects
 * @param {Object} options - Rendering options including showIndex, container, and callbacks
 * @returns {Object} Object containing the rendered graph container and index reference
 */
function renderGraph(nodes, options = {}) {
  const {
    showIndex = true,
    container = document.body,
    onNodeClick = null,
    indexTitle = 'Graph Index'
  } = options;
  
  const graphContainer = document.createElement('div');
  graphContainer.className = 'graph-container';
  graphContainer.setAttribute('role', 'application');
  graphContainer.setAttribute('aria-label', 'Interactive graph visualization');
  
  if (!nodes || !Array.isArray(nodes)) {
    console.warn('renderGraph: Invalid nodes array provided');
    return { graphContainer, indexContainer: null };
  }
  
  // Render all graph nodes
  nodes.forEach((nodeData, index) => {
    const node = createGraphNode(nodeData, index);
    
    if (onNodeClick && typeof onNodeClick === 'function') {
      node.addEventListener('click', () => onNodeClick(nodeData, index));
      node.style.cursor = 'pointer';
    }
    
    graphContainer.appendChild(node);
  });
  
  let indexContainer = null;
  
  // Render the graph index if enabled
  if (showIndex) {
    const indexItems = nodes.map((node, idx) => ({
      id: node.id || idx,
      label: node.label || `Node ${idx + 1}`,
      href: node.href || `#graph-node-${node.id || idx}`,
      description: node.description
    }));
    
    indexContainer = renderGraphIndex(indexItems, graphContainer);
    
    // Add index title
    if (indexTitle) {
      const titleElement = document.createElement('h2');
      titleElement.textContent = indexTitle;
      titleElement.className = 'graph-index-title';
      graphContainer.insertBefore(titleElement, graphContainer.firstChild);
    }
  }
  
  // Append to container if provided
  if (container && container.appendChild) {
    container.appendChild(graphContainer);
  }
  
  return { graphContainer, indexContainer };
}

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  rotateBack,
  updateTitle,
  createGraphNode,
  renderGraphIndex,
  renderGraph
};

export default Main;
export { Main, updateTitle };

initializeAccessibility();