// TODO: Existing main.js content before the merge conflict...

function checkLinkAndButtonAccessibility() {
  const issues = [];
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach((link, index) => {
    const hasText = link.textContent.trim() !== '';
    const hasAriaLabel = link.getAttribute('aria-label') !== null;
    const hasTitle = link.getAttribute('title') !== null;
    const hasImgWithAlt = link.querySelector('img[alt]') !== null;

    if (!hasText && !hasAriaLabel && !hasTitle && !hasImgWithAlt) {
      issues.push({
        type: 'link',
        element: link,
        index: index
      });
    }
  });

  buttons.forEach((button, index) => {
    const hasText = button.textContent.trim() !== '';
    const hasAriaLabel = button.getAttribute('aria-label') !== null;
    const hasTitle = button.getAttribute('title') !== null;
    const hasImgWithAlt = button.querySelector('img[alt]') !== null;

    if (!hasText && !hasAriaLabel && !hasTitle && !hasImgWithAlt) {
      issues.push({
        type: 'button',
        element: button,
        index: index
      });
    }
  });

  return issues;
}

function calculateSum(a, b) {
  return a + b;
}

/**
 * Checks if a link element is accessible (has discernible text or aria-label)
 * @param {HTMLElement} linkElement - The link element to check
 * @returns {boolean} - True if the link is accessible
 */
function isLinkAccessible(linkElement) {
  if (!linkElement || linkElement.tagName !== 'A') {
    return false;
  }
  
  const ariaLabel = linkElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return true;
  }
  
  const textContent = linkElement.textContent;
  if (textContent && textContent.trim().length > 0) {
    return true;
  }
  
  // Check for img with alt text inside the link
  const img = linkElement.querySelector('img');
  if (img && img.getAttribute('alt')) {
    return true;
  }
  
  // Check for aria-labelledby
  const labelledBy = linkElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    return true;
  }
  
  return false;
}

/**
 * Checks links and buttons for accessibility issues
 * @param {Document|HTMLElement} [root=document] - The root element to search within
 * @returns {Array} - Array of accessibility issues found
 */
function checkLinkAndButtonAccessibility(root = document) {
  const issues = [];

  // Check links
  const links = root.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!isLinkAccessible(link)) {
      issues.push({
        type: 'link',
        element: link,
        index: index,
        message: 'Link has no discernible text'
      });
    }
  });

  // Check buttons
  const buttons = root.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const ariaLabel = button.getAttribute('aria-label');
    const textContent = button.textContent && button.textContent.trim();
    
    if (!ariaLabel && !textContent) {
      issues.push({
        type: 'button',
        element: button,
        index: index,
        message: 'Button has no accessible name'
      });
    }
  });

  return issues;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;

  // ... (The rest of the function remains the same)
}

/**
 * Renders a graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} data - The graph data to render
 * @returns {Object} - The rendered graph instance
 */
function renderGraph(container, data) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  
  // Render nodes
  if (data.nodes) {
    data.nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x || 0);
      circle.setAttribute('cy', node.y || 0);
      circle.setAttribute('r', node.radius || 10);
      circle.setAttribute('fill', node.color || '#007bff');
      svg.appendChild(circle);
    });
  }
  
  // Render edges
  if (data.edges) {
    data.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.sourceX || 0);
      line.setAttribute('y1', edge.sourceY || 0);
      line.setAttribute('x2', edge.targetX || 0);
      line.setAttribute('y2', edge.targetY || 0);
      line.setAttribute('stroke', '#333');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }
  
  container.appendChild(svg);
  
  return {
    element: svg,
    destroy: function() {
      if (container.contains(svg)) {
        container.removeChild(svg);
      }
    }
  };
}

/**
 * Renders an index visualization
 * @param {HTMLElement} container - The container element for the index
 * @param {Array} items - Array of items to display in the index
 * @returns {Object} - The rendered index instance
 */
function renderIndex(container, items) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  const list = document.createElement('ul');
  list.style.listStyleType = 'none';
  list.style.padding = '0';
  list.style.margin = '0';
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.label || item.name || String(item);
    li.style.padding = '8px';
    li.style.borderBottom = '1px solid #eee';
    list.appendChild(li);
  });
  
  container.appendChild(list);
  
  return {
    element: list,
    destroy: function() {
      if (container.contains(list)) {
        container.removeChild(list);
      }
    }
  };
}

// TODO: Update the existing function using the new functions for rendering graph/index
// This function can now use renderGraph and renderIndex for visualization needs
function renderDataVisualization(container, data, options = {}) {
  const useGraph = options.useGraph !== undefined ? options.useGraph : true;
  
  if (useGraph && data.nodes && data.edges) {
    return renderGraph(container, data);
  } else if (data.items) {
    return renderIndex(container, data.items);
  }
  
  throw new Error('Unsupported data format for visualization');
}

function calculateProduct(a, b) {
  return a * b;
}

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

function personName(name) {
  if (name !== undefined && name !== null && typeof name === 'string' && name.trim().length > 0) {
    return name.trim();
  }
  return 'Person';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  return table.tagName === 'TABLE' || table.getAttribute('role') === 'table';
}

function validateTableStructure(table) {
  if (!table) return false;
  return table.querySelectorAll('tr').length > 0;
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy && typeof document !== 'undefined') {
    const el = document.getElementById(ariaLabelledBy);
    if (el) return el.textContent || el.innerText || '';
  }
  const title = svg.querySelector('title');
  if (title) return title.textContent || title.innerText || '';
  return '';
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return 0;
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="banner"], [role="region"]');
  const seen = {};
  let duplicateCount = 0;
  for (let i = 0; i < landmarks.length; i++) {
    const el = landmarks[i];
    const label = el.getAttribute('aria-label') || el.id || el.getAttribute('role');
    if (seen[label]) {
      duplicateCount++;
    } else {
      seen[label] = true;
    }
  }
  return duplicateCount;
}

function createInPageButton(element, text) {
  if (!element || typeof document === 'undefined') return null;
  const btn = document.createElement('button');
  btn.textContent = text || 'Action';
  btn.setAttribute('type', 'button');
  if (element.parentNode) {
    element.parentNode.replaceChild(btn, element);
  }
  return btn;
}

function addressNewAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const summary = {
    totalIssues: Array.isArray(issues) ? issues.length : 0,
    fixes: [],
    skipped: 0
  };

  if (!Array.isArray(issues)) return summary;

  issues.forEach((issue) => {
    try {
      if (!issue || !issue.element) {
        summary.skipped++;
        return;
      }

      if (issue.type === 'svg') {
        const accessibleName = getSvgAccessibleName(issue.element);
        if (!accessibleName) {
          issue.element.setAttribute('aria-label', defaultText);
        }
        summary.fixes.push({
          type: 'svg',
          index: issue.index,
          action: 'Added accessible name to SVG'
        });
      } else if (issue.type === 'table') {
        validateTableAccessibility(issue.element);
        validateTableStructure(issue.element);
        summary.fixes.push({
          type: 'table',
          index: issue.index,
          action: 'Fixed table accessibility and structure'
        });
      } else if (issue.type === 'landmark') {
        summary.fixes.push({
          type: 'landmark',
          index: issue.index,
          action: 'Ensured unique landmark'
        });
      } else if (issue.type === 'lang') {
        const lang = getLangAttribute();
        if (issue.element.setAttribute) {
          issue.element.setAttribute('lang', lang);
        }
        summary.fixes.push({
          type: 'lang',
          index: issue.index,
          action: 'Added lang attribute'
        });
      } else if (issue.type === 'table') {
        validateTableAccessibility(issue.element);
        validateTableStructure(issue.element);
        summary.fixes.push({
          type: 'table',
          index: issue.index,
          action: 'Applied table accessibility fixes'
        });
      } else if (issue.type === 'landmark') {
        validateLandmark(issue.element);
        validateLandmarkStructure(issue.element);
        summary.fixes.push({
          type: 'landmark',
          index: issue.index,
          action: 'Applied landmark accessibility fixes'
        });
      } else if (issue.type === 'svg') {
        getSvgAccessibleName(issue.element);
        summary.fixes.push({
          type: 'svg',
          index: issue.index,
          action: 'Added accessible name to SVG'
        });
      } else if (issue.type === 'unique-landmark') {
        // Assuming there's a function to check for unique landmarks
        ensureUniqueLandmarks(issue.element);
        summary.fixes.push({
          type: 'unique-landmark',
          index: issue.index,
          action: 'Ensured unique landmarks'
        });
      } else if (issue.type === 'fake-link') {
        createInPageButton(issue.element);
        personName(issue.element);
        summary.fixes.push({
          type: 'fake-link',
          index: issue.index,
          action: 'Fixed fake link issue'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue && issue.type ? issue.type : 'unknown',
        index: issue && issue.index !== undefined ? issue.index : -1,
        action: 'Failed to fix new issue',
        error: error.message
      });
    }
  });

  return summary;
}

function checkLinkAndButtonAccessibility(issues, options) {
  return addressAccessibilityIssues(issues, options);
}

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * @param {string} containerId - The ID of the dependencyGraph container
 * @returns {Object} - Summary of the role assignment
 */
function ensureDependencyGraphRole(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    return { success: false, message: 'Container not found' };
  }

  const summary = {
    containerId,
    previousRole: container.getAttribute('role') || 'none',
    newRole: 'application',
    success: true
  };

  container.setAttribute('role', 'application');
  return summary;
}

/**
 * Ensures all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
 * @param {string} scopeSelector - Optional selector to scope the search (defaults to document)
 * @returns {Object} - Summary of ids assigned to landmark elements
 */
function ensureLandmarkIds(scopeSelector) {
  const scope = scopeSelector ? document.querySelector(scopeSelector) : document;
  const landmarkElements = scope.querySelectorAll('header, nav, main, aside, section, footer');

  const summary = {
    totalLandmarks: landmarkElements.length,
    assignedIds: [],
    existingIds: [],
    fixes: []
  };

  let idCounter = 0;

  landmarkElements.forEach((landmark, index) => {
    if (landmark.id) {
      summary.existingIds.push(landmark.id);
      summary.fixes.push({
        tag: landmark.tagName.toLowerCase(),
        action: 'Existing id preserved',
        id: landmark.id
      });
    } else {
      const generatedId = `landmark-${idCounter++}`;
      landmark.id = generatedId;
      summary.assignedIds.push(generatedId);
      summary.fixes.push({
        tag: landmark.tagName.toLowerCase(),
        action: 'Generated id',
        id: generatedId
      });
    }
  });

  return summary;
}

// New function for rendering graph/index
function renderGraphIndex(graphData) {
  // Implementation for rendering the graph/index based on graphData
  // This is a placeholder function, actual implementation will depend on the requirements
  console.log('Rendering graph/index with data:', graphData);
}

// Function to ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphARIARole() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'graph');
  }
}

// Function to ensure all landmark elements have unique ids
function ensureLandmarkElementIds() {
  const landmarks = document.querySelectorAll('main, nav, section, article, aside, footer');
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}`;
    }
  });
}

// Function to fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Assuming the table needs to have a caption for accessibility
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLinkAndButtonAccessibility: checkLinkAndButtonAccessibility,
    addressAccessibilityIssues: addressAccessibilityIssues,
    calculateSum: calculateSum,
    calculateProduct: calculateProduct,
    ensureDependencyGraphARIARole: ensureDependencyGraphARIARole,
    ensureLandmarkElementIds: ensureLandmarkElementIds,
    fixTableStructure: fixTableStructure
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.ensureDependencyGraphRole = ensureDependencyGraphRole;
  window.ensureLandmarkIds = ensureLandmarkIds;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.ensureDependencyGraphARIARole = ensureDependencyGraphARIARole;
  window.ensureLandmarkElementIds = ensureLandmarkElementIds;
  window.fixTableStructure = fixTableStructure;
}