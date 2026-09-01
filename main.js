// Existing code from main.js

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

const fs = require('fs')
const path = require('path')

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Import dependency graph and index content modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

// Import a11y store configuration
const a11yStore = require('./a11yStore');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

// Assuming 'addLangAttribute' is a function that has already been implemented
function addLangAttribute () {
  if (typeof document !== 'undefined' && document.documentElement) {
    getLangAttribute()
  }
}
addLangAttribute()

function getLangAttribute () {
  const htmlElement = document.documentElement
  let lang = htmlElement.getAttribute('lang')

  if (!lang) {
    lang = htmlElement.getAttribute('xml:lang')
  }

  if (!lang) {
    lang = 'en'
    htmlElement.setAttribute('lang', lang)
  }

  return lang
}

function isLinkAccessible (link) {
  if (!link) {
    return false
  }

  const tagName = link.tagName ? link.tagName.toUpperCase() : ''
  const role = link.getAttribute ? link.getAttribute('role') : null
  const href = link.getAttribute ? link.getAttribute('href') : null
  const text = link.textContent || ''
  const ariaLabel = link.getAttribute ? link.getAttribute('aria-label') : null

  // Must be an anchor or have a link role
  if (tagName !== 'A' && role !== 'link') {
    return false
  }

  // Must have a valid href (not missing, empty, or just a hash)
  if (!href || typeof href !== 'string' || href.trim() === '' || href.trim() === '#') {
    return false
  }

  // Must not be a button disguised as a link
  if (role === 'button') {
    return false
  }

  // Must have an accessible name
  const hasText = text.trim().length > 0
  const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0
  const hasAriaLabelledby = link.getAttribute ? link.getAttribute('aria-labelledby') : false

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false
  }

  return true
}

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  // Validate input
  if (typeof htmlContent !== 'string') {
    throw new Error('HTML content must be a string');
  }

  const warnings = [];
  const foundLandmarks = {};

  // Check for each landmark element in the HTML content
  LANDMARK_ELEMENTS.forEach(landmark => {
    // Use case-insensitive regex to find landmark elements
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  // Check for required main landmark
  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  // Check for duplicate landmarks (potential issue)
  LANDMARK_ELEMENTS.forEach(landmark => {
    if (foundLandmarks[landmark] > 1) {
      warnings.push(`Multiple ${landmark} elements found`);
    }
  });

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { id, text, onClick, title, className = 'in-page-button', ariaLabel, lang } = options || {};

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Attach DOM properties when document is available
  if (typeof document !== 'undefined') {
    const domButton = document.createElement('button');
    domButton.id = button.id;
    domButton.type = 'button';
    domButton.className = button.className;
    domButton.textContent = button.text;

    if (ariaLabel) {
      domButton.setAttribute('aria-label', ariaLabel);
    } else {
      domButton.setAttribute('aria-label', button.text);
    }

    if (lang) {
      domButton.setAttribute('lang', lang);
    }

    if (typeof onClick === 'function') {
      domButton.addEventListener('click', onClick);
    }

    button.element = domButton;
  }

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

function ensureElementHasId (element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required')
  }

  if (element.id) {
    return element.id
  }

  const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  element.id = generatedId
  return generatedId
}

/**
 * Adds an aria-label to an element if one doesn't exist
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The modified element
 */
function addAriaLabel (element, label) {
  if (!element) {
    throw new Error('Element is required')
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label)
  }

  return element
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph (container, dependencies = {}) {
  if (!container) {
    throw new Error('Container element is required')
  }

  const graphElement = document.createElement('div')
  graphElement.className = 'dependency-graph'
  const img = document.createElement('img')
  img.setAttribute('alt', 'Dependency graph visualization')

  const nodes = dependencies.nodes || []
  const edges = dependencies.edges || []

  // Create SVG for graph rendering
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Render edges
  edges.forEach((edge, index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', edge.source?.x || 0)
    line.setAttribute('y1', edge.source?.y || 0)
    line.setAttribute('x2', edge.target?.x || 0)
    line.setAttribute('y2', edge.target?.y || 0)
    line.setAttribute('stroke', '#666')
    line.setAttribute('stroke-width', '2')
    line.setAttribute('id', `edge-${index}`)
    svg.appendChild(line)
  })

  // Render nodes
  nodes.forEach((node, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', node.x || 0)
    circle.setAttribute('cy', node.y || 0)
    circle.setAttribute('r', node.size || 20)
    circle.setAttribute('fill', node.color || '#4A90E2')
    circle.setAttribute('id', `node-${index}`)

    const nodeId = ensureElementHasId(circle, 'graph-node')
    if (node.label) {
      addAriaLabel(circle, node.label)
    }

    svg.appendChild(circle)
  })

  graphElement.appendChild(img)
  graphElement.appendChild(svg)
  container.appendChild(graphElement)
  return graphElement
}

// Original content from main.js
function existingFunction () {
  // existing code
}

// New function implementation as per the issue requirements
function personName () {
  // Implementation details go here
  // For example:
  return 'New function result'
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation

  // New implementation to count dependencies using dependencyGraphContent and regex
  const importCommentRegExp = /\/\/\s*require\s*\(\)|import\s+.*\s+from\s+['"`]/;
  const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Render index view content using indexContent
function renderIndexView() {
  return indexContent;
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
  const landmarks = {
    main: true,
    nav: false,
    aside: false
  };

  return {
    landmarks,
    regions: Object.keys(landmarks).filter(key => landmarks[key])
  };
}

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Get person name for accessible labeling
function personNameLocal() {
  return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibility() {
  a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructure() {
  a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
  a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructure() {
  a11yStore.validateLandmarkStructure();
}

// Get accessible name for SVG
function getSvgAccessibleName(svg) {
  return a11yStore.getSvgAccessibleName(svg);
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
  a11yStore.ensureUniqueLandmarks();
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
  a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements in the DOM
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

// Preserve existing code functionality
function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

// New function to address new accessibility issues from insight report
function newFunction() {
  // Placeholder for new accessibility issue fixes
  // Implement specific fixes based on insight report when available
}

/**
 * Generates a comprehensive report based on accessibility issues
 * @param {Object} [htmlContent] - Optional HTML content to analyze. If not provided, uses DOM checks.
 * @returns {Object} - Report object containing accessibility findings and recommendations
 */
function generateAccessibilityReport(htmlContent) {
  const report = {
    timestamp: new Date().toISOString(),
    issues: [],
    warnings: [],
    recommendations: [],
    summary: {
      totalIssues: 0,
      criticalIssues: 0,
      landmarkIssues: 0,
      tableIssues: 0
    }
  };

  try {
    // Check landmark elements if HTML content is provided
    if (htmlContent && typeof htmlContent === 'string') {
      try {
        const landmarkResults = checkLandmarkElements(htmlContent);
        report.landmarkAnalysis = landmarkResults;
        
        // Add landmark warnings to report
        if (landmarkResults.warnings && landmarkResults.warnings.length > 0) {
          report.warnings.push(...landmarkResults.warnings);
          report.summary.landmarkIssues = landmarkResults.warnings.length;
        }
        
        // Add recommendations based on landmark findings
        landmarkResults.warnings.forEach(warning => {
          if (warning.includes('main landmark')) {
            report.recommendations.push({
              type: 'landmark',
              severity: 'critical',
              message: 'Add a <main> landmark element to identify the primary content region',
              code: '<main>...</main>'
            });
          } else if (warning.includes('Multiple')) {
            report.recommendations.push({
              type: 'landmark',
              severity: 'warning',
              message: `Ensure only one ${warning.split(' ')[1]} landmark for proper navigation`,
            });
          }
        });
      } catch (landmarkError) {
        report.issues.push({
          type: 'landmark-analysis-error',
          severity: 'error',
          message: landmarkError.message
        });
      }
    }

    // Add general accessibility recommendations
    report.recommendations.push(
      {
        type: 'general',
        severity: 'info',
        message: 'Ensure all images have appropriate alt text',
        code: '<img src="..." alt="description">'
      },
      {
        type: 'general',
        severity: 'info',
        message: 'Use semantic HTML elements where appropriate',
        code: '<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>'
      },
      {
        type: 'general',
        severity: 'info',
        message: 'Ensure sufficient color contrast for text elements',
        code: 'Contrast ratio should be at least 4.5:1 for normal text'
      }
    );

    // Calculate summary statistics
    report.summary.totalIssues = 
      report.issues.length + 
      report.warnings.length + 
      (report.landmarkAnalysis ? report.landmarkAnalysis.warnings.length : 0);
    
    report.summary.criticalIssues = report.issues.filter(i => i.severity === 'critical').length;

  } catch (error) {
    report.issues.push({
      type: 'report-generation-error',
      severity: 'error',
      message: error.message
    });
  }

  return report;
}

module.exports = {
  checkLandmarkElements,
  createInPageButton,
  addLangAttribute,
  isLinkAccessible,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  existingFunction,
  personName,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  updateLiveRegion,
  addSVGAccessibilityProps,
  preserveExistingCode,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom,
  renderIndexView,
  generateAccessibilityReport
};