// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

document.querySelectorAll("a").forEach(a => {
  const id = a.id;
  const button = document.createElement("button");
  button.id = id;
  button.role = "button";
  button.ariaLabel = a.innerHTML;
  button.onclick = function () {
    a.addEventListener("click", this.dispatchEvent.bind(this));
    a.dispatchEvent(new MouseEvent("click"));
  };
  button.innerHTML = a.innerHTML;
  a.parentNode.replaceChild(button, a);
});

// Added: The requested function
function rotateBack() {
  // Function to rotate back - implementation placeholder
  console.log("Rotate back functionality executed");
}

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
function addLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
  }
}

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

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibility(svgElement, label) {
  if (svgElement) {
    svgElement.setAttribute('aria-label', label);
    svgElement.removeAttribute('aria-hidden');
  }
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.icon-svg-1');
// const svg2 = document.querySelector('.icon-svg-2');
// addSvgAccessibility(svg1, 'Description of first icon');
// addSvgAccessibility(svg2, 'Description of second icon');

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

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('[role="main"]');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.insertBefore(mainElement, rootElement.firstChild);
  }

  return rootElement;
}

function ensureUniqueLandmarks() {
  // Ensure unique landmarks in the entire application
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0 && el.id) {
          el.id = `${el.id}-${index}`;
        }
      });
    }
  });
}

function addSvgAccessibleNames(svgElement) {
  // Add accessible names to the provided svgElement
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return svgElement;
  }

  const title = svgElement.querySelector('title');
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.textContent = 'Decorative graphic';
    svgElement.insertBefore(newTitle, svgElement.firstChild);
  }

  const desc = svgElement.querySelector('desc');
  if (!desc) {
    const newDesc = document.createElement('desc');
    newDesc.textContent = '';
    svgElement.appendChild(newDesc);
  }
  
  return svgElement;
}

function fixFakeLinkIssue(link) {
  // Fix fake link issues in the provided link
  if (!link) {
    return link;
  }

  if (link.href === '#' || link.href === '' || !link.href) {
    const parent = link.parentElement;
    if (parent && parent.tagName === 'A') {
      const hasClickHandler = parent.onclick || parent.getAttribute('onclick');
      if (!hasClickHandler) {
        parent.setAttribute('role', 'button');
      }
    }
  }

  return link;
}

// Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues() {
  // Replace <a id="unrotate" href="#">rotate back</a> with accessible button
  const rotateLink = document.getElementById('unrotate');
  
  if (rotateLink && rotateLink.tagName === 'A') {
    // Create a button element to replace the anchor tag
    const rotateButton = document.createElement('button');
    rotateButton.id = 'unrotate';
    rotateButton.setAttribute('role', 'button');
    rotateButton.setAttribute('aria-label', 'rotate back');
    rotateButton.textContent = rotateLink.textContent;
    
    // Copy any additional attributes if needed
    if (rotateLink.className) {
      rotateButton.className = rotateLink.className;
    }
    
    // Add click event listener
    rotateButton.addEventListener('click', function(event) {
      event.preventDefault();
      rotateBack();
    });
    
    // Add keyboard support (Enter and Space keys)
    rotateButton.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        rotateBack();
      }
    });
    
    // Replace the anchor with the button
    rotateLink.parentNode.replaceChild(rotateButton, rotateLink);
  }
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
  
  // Ensure table headers have proper scope
  ensureThScope();
  
  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
  
  addressAccessibilityIssues();
}

// Run accessibility improvements when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute(rootElement, 'en');
}

ensureUniqueLandmarks();

addMainLandmark(rootElement);

// Example usage for SVG accessibility:
// const svg1 = document.querySelector('.icon-svg-1');
// const svg2 = document.querySelector('.icon-svg-2');
// svg1 && addSvgAccessibleNames(svg1);
// svg2 && addSvgAccessibleNames(svg2);

// Run addressAccessibilityIssues as well
addressAccessibilityIssues();

// --- NEW FUNCTIONS ADDED ---

/**
 * Ensures that an element has an id attribute.
 * If the element doesn't have an id, generates a unique one based on the tag name and a random suffix.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string|null} - The element's id (existing or newly generated) or null if element is invalid
 */
function ensureElementHasId(element, prefix) {
  if (!element) {
    return null;
  }
  
  if (element.id && element.id.trim() !== '') {
    return element.id;
  }
  
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'element';
  const basePrefix = prefix || tagName;
  const uniqueId = `${basePrefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  element.id = uniqueId;
  return uniqueId;
}

/**
 * Ensures that multiple elements have id attributes.
 * @param {HTMLElement[]} elements - Array of elements to process
 * @param {string} [prefix] - Optional prefix for generated ids
 * @returns {string[]} - Array of id strings
 */
function ensureElementsHaveIds(elements, prefix) {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  return elements.map((el, index) => {
    const elementPrefix = prefix || `element-${index}`;
    return ensureElementHasId(el, elementPrefix);
  });
}

/**
 * Adds or updates an aria-label attribute on an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement|null} - The element with the aria-label set, or null if element is invalid
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }
  
  if (label && typeof label === 'string') {
    element.setAttribute('aria-label', label);
  }
  
  return element;
}

/**
 * Adds aria-label to multiple elements.
 * @param {HTMLElement[]} elements - Array of elements
 * @param {string} label - The label text to set
 * @returns {HTMLElement[]} - Array of elements with aria-label set
 */
function addAriaLabels(elements, label) {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  return elements.map(el => addAriaLabel(el, label));
}

/**
 * Renders a dependency graph visualization in a container element.
 * @param {string|HTMLElement} container - The container element or its id
 * @param {Object} dependencies - The dependency data object
 * @param {Array} dependencies.nodes - Array of node objects with id and label properties
 * @param {Array} dependencies.edges - Array of edge objects with source and target properties
 * @param {Object} [options] - Optional rendering options
 * @returns {HTMLElement|null} - The SVG element containing the graph, or null on error
 */
function renderDependencyGraph(container, dependencies, options) {
  // Get container element
  let containerElement;
  if (typeof container === 'string') {
    containerElement = document.getElementById(container);
  } else if (container && container.tagName) {
    containerElement = container;
  }
  
  if (!containerElement || !dependencies) {
    console.error('Invalid container or dependencies data provided');
    return null;
  }
  
  const nodes = dependencies.nodes || [];
  const edges = dependencies.edges || [];
  
  // Default options
  const renderOptions = {
    width: options?.width || 600,
    height: options?.height || 400,
    nodeRadius: options?.nodeRadius || 25,
    nodeColor: options?.nodeColor || '#4a90e2',
    edgeColor: options?.edgeColor || '#888',
    labelColor: options?.labelColor || '#fff',
    fontSize: options?.fontSize || 12
  };
  
  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', renderOptions.width);
  svg.setAttribute('height', renderOptions.height);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency graph visualization');
  
  // Define arrow marker for directed edges
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="${renderOptions.edgeColor}"/>
    </marker>
  `;
  svg.appendChild(defs);
  
  // Calculate node positions in a circular layout if no positions provided
  const nodePositions = {};
  const centerX = renderOptions.width / 2;
  const centerY = renderOptions.height / 2;
  const radius = Math.min(centerX, centerY) - renderOptions.nodeRadius - 50;
  
  nodes.forEach((node, index) => {
    if (node.x !== undefined && node.y !== undefined) {
      nodePositions[node.id] = { x: node.x, y: node.y };
    } else {
      const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
      nodePositions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  });
  
  // Draw edges
  edges.forEach(edge => {
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    
    if (sourcePos && targetPos) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', sourcePos.x);
      line.setAttribute('y1', sourcePos.y);
      line.setAttribute('x2', targetPos.x);
      line.setAttribute('y2', targetPos.y);
      line.setAttribute('stroke', renderOptions.edgeColor);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      svg.appendChild(line);
    }
  });
  
  // Draw nodes
  nodes.forEach(node => {
    const pos = nodePositions[node.id];
    if (!pos) return;
    
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', node.label || `Node ${node.id}`);
    
    // Node circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', renderOptions.nodeRadius);
    circle.setAttribute('fill', node.color || renderOptions.nodeColor);
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);
    
    // Node label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y + renderOptions.fontSize / 3);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', renderOptions.labelColor);
    text.setAttribute('font-size', renderOptions.fontSize);
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.textContent = node.label || node.id;
    group.appendChild(text);
    
    svg.appendChild(group);
  });
  
  // Clear container and append SVG
  containerElement.innerHTML = '';
  containerElement.appendChild(svg);
  
  return svg;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateBack,
    createUnrotateButton,
    addSvgAccessibility,
    ensureThScope,
    initializeAccessibility,
    addMainLandmark,
    ensureUniqueLandmarks,
    addSvgAccessibleNames,
    fixFakeLinkIssue,
    addLangAttribute,
    addressAccessibilityIssues,
    ensureElementHasId,
    ensureElementsHaveIds,
    addAriaLabel,
    addAriaLabels,
    renderDependencyGraph
  };
}