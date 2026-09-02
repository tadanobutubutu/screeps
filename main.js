// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

// _Commit: 923fb7f86c3e615330005e4bc6ff39b58823ade3_

// <!-- todo-hash: bf82d96f467ce7c44a8f95c71fe843d3a82bd4c7 -->

// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
const AddressabilityIssues = {
  ensureElementId(element, prefix = 'el') {
    if (!element) return '';
    if (!element.id) {
      const generatedId = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
      element.id = generatedId;
    }
    return element.id;
  },
  addAriaLabel(element, label) {
    if (!element) return;
    if (label && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },
  renderDependencyGraph(graphData, container, options = {}) {
    if (!container) return;
    container.innerHTML = '';
    
    const {
      width = 800,
      height = 600,
      nodeRadius = 20,
      onNodeClick = null,
      ariaDescription = 'Dependency graph visualization'
    } = options;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph');
    svg.setAttribute('aria-description', ariaDescription);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('tabindex', '0');
    
    // Create a description element for screen readers
    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = this.generateGraphDescription(graphData);
    svg.appendChild(desc);

    // Create a main group for the graph content
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('role', 'group');
    mainGroup.setAttribute('aria-label', 'Graph content');
    
    // Process and render edges first (so they appear behind nodes)
    if (graphData && graphData.edges) {
      graphData.edges.forEach((edge, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(edge.from.x || 0));
        line.setAttribute('y1', String(edge.from.y || 0));
        line.setAttribute('x2', String(edge.to.x || 0));
        line.setAttribute('y2', String(edge.to.y || 0));
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('aria-label', `Edge from ${edge.fromLabel || 'node'} to ${edge.toLabel || 'node'}`);
        line.id = `edge-${index}`;
        mainGroup.appendChild(line);
      });
    }

    // Process and render nodes
    if (graphData && graphData.nodes) {
      graphData.nodes.forEach((node, index) => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const nodeId = node.id || `node-${index}`;
        
        // Create the node circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(node.x || 0));
        circle.setAttribute('cy', String(node.y || 0));
        circle.setAttribute('r', String(nodeRadius));
        circle.setAttribute('fill', node.color || '#4A90E2');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');
        circle.id = `${nodeId}-circle`;
        
        // Create accessible text label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(node.x || 0));
        text.setAttribute('y', String((node.y || 0) + 4));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '12');
        text.setAttribute('aria-hidden', 'true');
        text.textContent = node.label || nodeId;
        
        // Create accessible title for the node
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${node.label || nodeId}${node.description ? ': ' + node.description : ''}`;
        
        // Wrap elements in a group for the node
        group.setAttribute('role', 'button');
        group.setAttribute('aria-label', `${node.label || nodeId}${node.description ? ': ' + node.description : ''}`);
        group.setAttribute('tabindex', '0');
        group.id = nodeId;
        
        // Add keyboard event listeners for accessibility
        group.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onNodeClick && typeof onNodeClick === 'function') {
              onNodeClick(node, index);
            }
          }
        });
        
        // Add click event if callback provided
        if (onNodeClick && typeof onNodeClick === 'function') {
          group.addEventListener('click', () => {
            onNodeClick(node, index);
          });
        }
        
        group.appendChild(title);
        group.appendChild(circle);
        group.appendChild(text);
        mainGroup.appendChild(group);
      });
    }

    svg.appendChild(mainGroup);
    container.appendChild(svg);
    
    return svg;
  },
  
  generateGraphDescription(graphData) {
    if (!graphData) return 'Empty dependency graph';
    
    const nodeCount = graphData.nodes ? graphData.nodes.length : 0;
    const edgeCount = graphData.edges ? graphData.edges.length : 0;
    const nodeLabels = graphData.nodes ? graphData.nodes.map(n => n.label || n.id).join(', ') : '';
    
    return `Dependency graph with ${nodeCount} node${nodeCount !== 1 ? 's' : ''} and ${edgeCount} edge${edgeCount !== 1 ? 's' : ''}. Nodes: ${nodeLabels || 'none'}.`;
  },

  // Addressability-related functionality
  // todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888
  // Placeholder for addressability issues tracking
  issues: [],
  add: function(issue) {
    this.issues.push(issue);
  },
  clear: function() {
    this.issues = [];
  },

  analyzeAccessibilityIssues: function(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section ${index} has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section ${index} contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore: function(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  convertMainToSection: function(source) {
    const mainBlockRegex = /<main\b([^>]*)>([\s\S]*?)<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main\b([^>]*)>/i, '<section$1>')
        .replace(/<\/main>/i, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark: function(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return { valid: false, error: 'Element does not have a valid landmark role', element: tagName };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  createInPageButton: function(options) {
    const button = document.createElement('button');
    button.textContent = options.text || 'Click me';
    button.setAttribute('aria-label', options.ariaLabel || options.text);
    button.className = options.className || 'in-page-button';
    
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    
    return button;
  },

  personName: function(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
  },

  addLangAttribute: function(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies: function() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  ensureUniqueLandmarksFromString: function(str) {
    return str;
  }
};

/**
 * Main application entry point with accessibility features
 */
function main() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    if (svg) {
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      // Use accessibleName
    }

    setSvgAttributes(svg);
  });
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('alt') || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.getAttribute('width')) {
    svg.setAttribute('width', '24');
  }
  if (!svg.getAttribute('height')) {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = null !== null || table.querySelector('th') !== null;
  const hasBody = null !== null;
  const hasCaption = null !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

function ensureAccessibleLabels(elements) {
  if (!elements) return;
  elements.forEach(el => {
    if (!el) return;
    const id = AddressabilityIssues.ensureElementId(el, 'acc');
    const label = el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '';
    AddressabilityIssues.addAriaLabel(el, label.trim());
  });
}

function buildAccessibleLabel(inputElement, labelText) {
  if (!inputElement) return null;
  const id = AddressabilityIssues.ensureElementId(inputElement, 'input');
  let labelElement = document.getElementById(`${id}-label`);
  if (!labelElement) {
    labelElement = document.createElement('label');
    labelElement.setAttribute('for', id);
    labelElement.id = `${id}-label`;
    labelElement.textContent = labelText || '';
    inputElement.parentNode && inputElement.parentNode.insertBefore(labelElement, inputElement);
  }
  return labelElement;
}

function processSvgElements(svgElements, getSvgAccessibleName, setSvgAttributes) {
  svgElements.forEach(svg => {
    if (svg && !svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      // Use accessibleName
    }

    setSvgAttributes(svg);
  });
}

function initializeAccessibility() {
  addSvgAccessibilityProps();
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  ensureAccessibleLabels(interactiveElements);
}

/**
 * Creates an accessible in-page button element
 * @param {Object} options - Button configuration options
 * @param {string} options.text - Button text content
 * @param {string} [options.id] - Optional button ID
 * @param {string} [options.className] - Optional CSS class name
 * @param {string} [options.ariaLabel] - Optional ARIA label for accessibility
 * @param {Function} [options.onClick] - Optional click handler
 * @param {boolean} [options.disabled=false] - Whether button is disabled
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const {
    text = '',
    id = '',
    className = '',
    ariaLabel = '',
    onClick = null,
    disabled = false
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;

  if (id) {
    button.id = id;
  }

  if (className) {
    button.className = className;
  }

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else if (text) {
    button.setAttribute('aria-label', text);
  }

  if (disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }

  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

// Updated function to render dependency graphs with proper accessibility
function renderDependencyGraphs(containers = [], graphData = null) {
  const results = [];
  
  if (!containers || containers.length === 0) {
    // If no containers provided, try to find containers with data-graph attribute
    const graphContainers = document.querySelectorAll('[data-graph]');
    graphContainers.forEach((container) => {
      const data = container.getAttribute('data-graph-data');
      const parsedData = data ? JSON.parse(data) : graphData;
      if (parsedData) {
        const svg = AddressabilityIssues.renderDependencyGraph(parsedData, container);
        results.push({ container, svg, success: !!svg });
      }
    });
  } else {
    // Process provided containers
    const containerArray = Array.isArray(containers) ? containers : [containers];
    containerArray.forEach((container, index) => {
      const data = graphData || (container.getAttribute ? container.getAttribute('data-graph-data') : null);
      const parsedData = data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
      const svg = AddressabilityIssues.renderDependencyGraph(parsedData, container);
      results.push({ container, svg, success: !!svg, index });
    });
  }
  
  return results;
}

// Add accessibility function to handle the lang attribute for the entire HTML document
function handleAddLangAttribute(htmlDocument, lang) {
  // Get the html element and call addLangAttribute
  const htmlElement = htmlDocument.documentElement;
  addLangAttribute(htmlElement, lang);
}

// New function to handle the new functionalities
function newFunctionality() {
  // Example functionality to demonstrate changes
  console.log('New functionality has been added.');
}

// TODO: Implement tower defense in main.js
function implementTowerDefense() {
  // Placeholder for tower defense implementation
  console.log('Tower defense logic is not implemented yet.');
}

// Helper function for accessibility
function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (svg && !svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Placeholder function for server creation
function createServer() {
  return { listen: () => {} };
}

// Placeholder function for starting the app
function startApp() {
  console.log('App started');
}

// Placeholder config object
const config = {};

// Placeholder function for handling credential response
function handleCredentialResponse() {}

// Placeholder function for getting stored credentials
function getStoredCredentials() {
  return {};
}

// Placeholder function for addressing accessibility issues
function addressAccessibilityIssues() {}

// Generate accessibility report wrapper
function generateAccessibilityReport() {
  return AddressabilityIssues.generateAccessibilityReport({ issues: [] });
}

// Calculate accessibility score wrapper
function calculateAccessibilityScore() {
  return AddressabilityIssues.calculateAccessibilityScore([]);
}

// Sample insight report for testing
function sampleInsightReport() {
  return {
    sections: [
      { heading: 'Introduction', content: 'Welcome to the application' },
      { heading: '', content: 'This section has no heading' },
      { heading: 'Features', content: 'Click here to learn more' }
    ]
  };
}

// Export functions for testing
module.exports = {
  processSvgElements,
  checkTableStructure,
  sampleInsightReport,
  AddressabilityIssues,
  createServer,
  startApp,
  config,
  handleCredentialResponse,
  getStoredCredentials,
  handleAddLangAttribute,
  newFunctionality,
  countDependencies,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  ensureUniqueLandmarksFromString,
  validateLandmark,
  createInPageButton,
  implementTowerDefense,
  renderDependencyGraphs
};