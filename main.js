// TODO: Identify and update specific functions that render dependency graphs or

// (This comment remains as-is)

const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

const main = require('./utilities');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// Render dependency graphs in the container
function renderDependencyGraphs(container) {
  if (!container) {
    return false;
  }
  
  const graphContent = dependencyGraphContent;
  if (!graphContent) {
    log('No dependency graph content available', 'warn');
    return false;
  }
  
  // Find or create a container for the dependency graph
  let graphContainer = container.querySelector('[data-dependency-graph]');
  if (!graphContainer) {
    graphContainer = document.createElement('div');
    graphContainer.setAttribute('data-dependency-graph', 'true');
    graphContainer.setAttribute('role', 'img');
    graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
    container.appendChild(graphContainer);
  }
  
  // Render the dependency graph content
  if (graphContent.nodes && graphContent.edges) {
    graphContainer.innerHTML = renderGraphSVG(graphContent);
    return true;
  } else if (typeof graphContent === 'string') {
    graphContainer.innerHTML = graphContent;
    return true;
  }
  
  return false;
}

// Render SVG representation of the dependency graph
function renderGraphSVG(content) {
  const nodes = content.nodes || [];
  const edges = content.edges || [];
  const width = content.width || 800;
  const height = content.height || 600;
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += '<style>';
  svg += '.node { fill: #4A90E2; stroke: #333; stroke-width: 2px; cursor: pointer; }';
  svg += '.node:hover { fill: #357ABD; }';
  svg += '.edge { stroke: #999; stroke-width: 2px; fill: none; marker-end: url(#arrowhead); }';
  svg += '.label { fill: #333; font-size: 12px; font-family: Arial, sans-serif; text-anchor: middle; }';
  svg += '</style>';
  svg += '<defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#999"/></marker></defs>';
  
  // Render edges
  edges.forEach((edge, index) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    if (fromNode && toNode) {
      svg += `<line class="edge" x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}" data-edge-index="${index}"/>`;
    }
  });
  
  // Render nodes
  nodes.forEach((node, index) => {
    const radius = node.radius || 20;
    svg += `<circle class="node" cx="${node.x}" cy="${node.y}" r="${radius}" data-node-index="${index}" aria-label="${node.label || node.id}"/>`;
    if (node.label) {
      svg += `<text class="label" x="${node.x}" y="${node.y + radius + 15}">${node.label}</text>`;
    }
  });
  
  svg += '</svg>';
  return svg;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (!report || !report.issues) {
    return fixes
  }

  // Add lang attribute to HTML element if missing
  const htmlEl = container.ownerDocument?.querySelector('[lang]') || null;
  if (htmlEl) {
    htmlEl.setAttribute('lang', 'en');
    fixes.langAdded = true;
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main');
  if (!mainElement) {
    const body = container.querySelector('body');
    if (body) {
      const newMain = document.createElement('main');
      newMain.setAttribute('id', 'main-content');
      newMain.appendChild(body.firstChild);
      mainElement = newMain;
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container);
  fixButtonIdentifiers(container);
  addMainLandmark(container);

  // Fix landmark issues
  validateLandmark(container);

  // Fix SVG accessible names
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      const existingName = svg.getAttribute('aria-label');
      if (!existingName) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    }
  });

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = document.querySelectorAll('[href]:not(a)');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'link');
    link.setAttribute('tabindex', '0');
    link.setAttribute('data-interactive', 'true');
  });

  // Validate accessibility report
  const accessibilityReport = report;
  if (accessibilityReport && accessibilityReport.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.length} issues`, 'warn');
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container);

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container);
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.length}`, 'error');
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0;
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  if (!content) {
    return '';
  }
  
  const indexContentData = indexContent;
  if (!indexContentData) {
    return content;
  }
  
  // Create a container for the index
  let indexContainer = document.createElement('div');
  indexContainer.setAttribute('data-graph-index', 'true');
  indexContainer.setAttribute('role', 'navigation');
  indexContainer.setAttribute('aria-label', 'Dependency graph index');
  
  // Build the index from content
  if (content.nodes && Array.isArray(content.nodes)) {
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');
    
    content.nodes.forEach((node, index) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.setAttribute('href', `#node-${index}`);
      link.setAttribute('data-node-id', node.id);
      link.textContent = node.label || node.id;
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    
    indexContainer.appendChild(list);
  }
  
  return indexContainer.outerHTML;
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  return function(e) {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement) {
          lastElement.focus();
        }
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement) {
          firstElement.focus();
        }
      }
    }
  };
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement;
  if (!htmlElement) {
    return null;
  }
  if (htmlElement.hasAttribute('lang')) {
    return htmlElement;
  }
  htmlElement.setAttribute('lang', lang);
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  const headers = tableElement.querySelectorAll('thead tr > th');
  headers.forEach((th, index) => {
    th.setAttribute('scope', index === 0 ? 'row' : 'column');
  });
  
  const existingCaption = tableElement.querySelector('caption');
  if (!existingCaption) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    tableElement.appendChild(caption);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    const body = document.body;
    if (body && body.firstChild) {
      body.firstChild.appendChild(mainElement);
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null;
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ];
  
  landmarks.forEach(landmark => {
    let element = container.querySelector(landmark.selector);
    if (!element) {
      element = document.createElement(landmark.selector);
      element.setAttribute('role', landmark.role);
      container.appendChild(element);
    }
    
    if (!element.getAttribute('aria-label') && !element.getAttribute('role')) {
      element.setAttribute('aria-label', landmark.label);
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarksHelper(container) {
  if (!container) return;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
}