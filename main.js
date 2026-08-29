// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * Function to replace `my-button` with actual button id
 */
function replaceMyButtonId() {
  // Find the element with the `my-button` class and replace the class with the actual id.
  // Assuming you have already set the id on the button element in your code
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';
  
  // Create navigation landmark
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';
  
  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';
  
  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';
  
  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-controls]');
  collapsibles.forEach(element => {
    if (!element.hasAttribute('aria-expanded')) {
      element.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add aria-labels to form inputs that don't have labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('button, input, select, textarea');
  
  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }
    
    // Mark required fields appropriately
    if (control.hasAttribute('required') && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Ensures the element has an ID. If it doesn't, generates a unique one using the baseName.
 * 
 * @param {HTMLElement} element - The DOM element to assign an ID to.
 * @param {string} [baseName='element'] - The base name for the generated ID.
 * @returns {string} The ID of the element, either existing or newly generated.
 */
function ensureElementHasId(element, baseName = 'element') {
  if (!element.id) {
    element.id = ensureUniqueLandmarkId(baseName);
  }
  return element.id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * 
 * @param {HTMLElement} element - The DOM element to add the aria-label to.
 * @param {string} label - The aria-label text to add.
 * @returns {void}
 */
function ensureAriaLabel(element, label) {
  if (!element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Renders a dependency graph based on provided data.
 * This function visualizes dependencies by creating a container element
 * and populating it with nodes and connections based on the input data structure.
 * 
 * @param {Object[]} data - Array of dependency objects with 'id', 'name', and 'dependsOn' properties.
 * @returns {HTMLElement} The container element containing the rendered dependency graph.
 */
function renderDependencyGraphs(data) {
  const container = document.createElement('div');
  container.id = 'dependency-graph-container';
  container.className = 'dependency-graph';
  
  const title = document.createElement('h3');
  title.textContent = 'Dependency Graph';
  container.appendChild(title);
  
  const graph = document.createElement('div');
  graph.className = 'graph-visualization';
  container.appendChild(graph);
  
  data.forEach(node => {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'dependency-node';
    nodeElement.id = `node-${node.id}`;
    nodeElement.setAttribute('aria-label', `Dependency: ${node.name}`);
    nodeElement.textContent = node.name;
    
    if (node.dependsOn && node.dependsOn.length > 0) {
      const links = document.createElement('div');
      links.className = 'dependency-links';
      node.dependsOn.forEach(dep => {
        const link = document.createElement('span');
        link.className = 'dependency-link';
        link.textContent = `depends on ${dep}`;
        links.appendChild(link);
      });
      nodeElement.appendChild(links);
    }
    
    graph.appendChild(nodeElement);
  });
  
  document.body.appendChild(container);
  return container;
}

// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  ensureElementHasId,
  ensureAriaLabel,
  renderDependencyGraphs
};