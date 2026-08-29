// TODO: This is the existing code that needs to be preserved

// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

document.querySelectorAll('button').forEach(a => {
  const id = a.id;
  const button = document.createElement("button");
  button.id = id;
  button.role = "button";
  button.ariaLabel = a.innerHTML;
  button.onclick = function () {
    // Preserve existing behavior by dispatching the original click event
    a.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  };
  button.innerHTML = a.innerHTML;
  a.parentNode.replaceChild(button, a);
});

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:

// Added: The requested function
function rotateBack() {
  // Rotate the element back to its original position
  const element = document.querySelector('.rotated');
  if (element) {
    element.classList.remove('rotated');
  }
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
  button.onclick = rotateBack;
  return button;
}

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibleNames(svgElement, label) {
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return;
  }
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', label);
}

// Example usage for SVGs:
// const svg1 = document.querySelector('svg.icon1');
// const svg2 = document.querySelector('svg.icon2');
// addSvgAccessibleNames(svg1, 'Description of first icon');
// addSvgAccessibleNames(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && parent.children[0] === th;
      
      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink) {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
  
  // Ensure table headers have proper scope
  ensureThScope();
  
  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Run accessibility initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Additional functions for module structure and dependency graph (new)
/**
 * Renders a dependency graph as an SVG.
 * @param {Object} graph - The graph data with nodes and edges.
 * @returns {SVGElement} The SVG element representing the graph.
 */
function renderDependencyGraph(graph) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "800");
  svg.setAttribute("height", "600");
  svg.setAttribute("viewBox", "0 0 800 600");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Dependency graph");

  // Define arrowhead marker
  const defs = document.createElementNS(svgNS, "defs");
  const marker = document.createElementNS(svgNS, "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("markerWidth", "10");
  marker.setAttribute("markerHeight", "7");
  marker.setAttribute("refX", "10");
  marker.setAttribute("refY", "3.5");
  marker.setAttribute("orient", "auto");
  const polygon = document.createElementNS(svgNS, "polygon");
  polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
  polygon.setAttribute("fill", "#333");
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw edges
  if (graph.edges && Array.isArray(graph.edges)) {
    graph.edges.forEach(edge => {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", edge.from.x);
      line.setAttribute("y1", edge.from.y);
      line.setAttribute("x2", edge.to.x);
      line.setAttribute("y2", edge.to.y);
      line.setAttribute("stroke", "#333");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");
      svg.appendChild(line);
    });
  }

  // Draw nodes
  if (graph.nodes && Array.isArray(graph.nodes)) {
    graph.nodes.forEach(node => {
      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", node.x);
      circle.setAttribute("cy", node.y);
      circle.setAttribute("r", "20");
      circle.setAttribute("fill", node.color || "#4CAF50");
      circle.setAttribute("stroke", "#333");
      circle.setAttribute("stroke-width", "2");
      svg.appendChild(circle);
      const text = document.createElementNS(svgNS, "text");
      text.setAttribute("x", node.x);
      text.setAttribute("y", node.y + 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12");
      text.textContent = node.label;
      svg.appendChild(text);
    });
  }

  return svg;
}

/**
 * Displays module structure as a tree in a DOM element.
 * @param {Object} modules - The module hierarchy data (tree structure).
 * @returns {HTMLElement} The DOM element containing the structure.
 */
function displayModuleStructure(modules) {
  const container = document.createElement("div");
  container.className = "module-structure";
  container.setAttribute("role", "tree");

  function buildTree(module, level) {
    const item = document.createElement("div");
    item.setAttribute("role", "treeitem");
    item.setAttribute("aria-level", level);
    item.style.marginLeft = (level * 20) + "px";
    item.textContent = module.name;
    container.appendChild(item);
    if (module.children && module.children.length) {
      module.children.forEach(child => buildTree(child, level + 1));
    }
  }

  buildTree(modules, 0);
  return container;
}

// ... (rest of existing code)

function addMainLandmark(rootElement) {
  // Add main landmark to the provided rootElement
  if (!rootElement) {
    return null;
  }

  const existingMain = rootElement.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    while (rootElement.firstChild) {
      mainElement.appendChild(rootElement.firstChild);
    }
    rootElement.appendChild(mainElement);
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

function addSvgAccessibility(svgElement, label) {
  // Backward-compatible wrapper (used for addSvgAccessibleNames)
  addSvgAccessibleNames(svgElement, label);
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

function addLangAttribute(lang) {
  // Add lang attribute to the root HTML element
  const root = document.documentElement;
  if (root && !root.hasAttribute('lang')) {
    root.setAttribute('lang', lang || 'en');
  }
}

function fixTableStructure() {
  // Ensure table headers have correct scope (already done by ensureThScope)
  // Additional fix: move any stray table elements into a proper <table>
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Simple validation; production code would be more comprehensive
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      // Assume first row is header
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    ensureThScope();
  });
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute('en');
}

ensureUniqueLandmarks();

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
  fixTableStructure,
  renderDependencyGraph,
  displayModuleStructure
};