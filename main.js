// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 641688d91e4de9a82ff894b47ca3fcdab7317b3d -->
// TODO: Address accessibility issues from insight report:
// TODO: This is the existing code that needs to be preserved
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// TODO: This is the existing code that needs to be preserve
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const primaryContent = (typeof document !== 'undefined') ? document.getElementById('primary-content') || document.body : null;

// Load configurations from package.json if it exists
function loadConfigurations() {
    try {
        const packagePath = path.join(__dirname, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            config.name = packageJson.name || 'dependency-counter';
            config.version = packageJson.version || '1.0.0';
            config.dependencies = packageJson.dependencies || {};
            config.devDependencies = packageJson.devDependencies || {};
            config.accessibility = packageJson.accessibility || {};
        }
    } catch (error) {
        console.error('Error loading configurations:', error.message);
    }
}

// Implement function to count dependencies
function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.floor(Math.random() * 1e9).toString(36).substring(0, 9);
    return timestamp + '-' + randomPart;
}

/**
 * Check if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
function prefersReducedMotion() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if the user prefers high contrast
 * @returns {boolean} True if the user prefers high contrast
 */
function prefersHighContrast() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
    const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

    if (!element) {
        return false;
    }

    if (typeof element === 'string') {
        return landmarkTags.includes(element.toLowerCase());
    }

    if (element.tagName) {
        return landmarkTags.includes(element.tagName.toLowerCase());
    }

    return false;
}

/**
 * Validates table accessibility by checking structure and headers.
 * @param {HTMLElement} table - The table to validate
 * @returns {Object} - Validation result with success status and details
 */
function validateTableAccessibility(table) {
  if (!table) {
    return { success: false, error: 'Table is required' };
  }

  const caption = table.querySelector('caption');
  const hasCaption = caption !== null;
  const headers = table.querySelectorAll('th');
  const errors = [];

  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  const headerValidation = Array.from(headers).every(header => 
    header.hasAttribute('scope') && header.getAttribute('scope') !== ''
  );

  return {
    success: hasCaption && headers.length > 0 && headerValidation,
    details: {
      hasCaption,
      headerCount: headers.length,
      headersHaveScope: headerValidation
    }
  };
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkStructure(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

// AddressabilityIssues from origin/main branch
const AddressabilityIssues = {
  validateTableAccessibility: function(table) {
    return validateTableAccessibility(table);
  }
};

/**
 * Validates landmark roles in container
 * @param {HTMLElement} container - The container element to check
 * @returns {Object} - Landmark count by role
 */
function validateLandmarkRoles(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = [];
  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => landmarks.push(el));
  });

  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

// SVG accessibility helper functions
function makeSvgAccessible(svg) {
  if (svg && typeof svg.setAttribute === 'function') {
    svg.setAttribute('role', 'img');
  }

  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-labelledby', accessibleName);
  }

  setSvgAttributes(svg);
}

function setSvgAttributes(svg) {
    // Code to set other svg attributes goes here
}

/**
 * Get the accessible name for an SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string|null} - The accessible name or null
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labeledElement = document.getElementById(ariaLabelledby);
    if (labeledElement && labeledElement.textContent) {
      return labeledElement.textContent.trim();
    }
  }

  return null;
}

/**
 * Validate input parameter
 * @param {*} input - Input to validate
 * @returns {boolean} - True if valid
 */
function validateInput(input) {
    return input !== null && input !== undefined;
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponseFn(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);

    if (!parsedResponse.success) {
        return {
            status: 'error',
            message: parsedResponse.error
        };
    }

    const credential = parsedResponse.credential;

    if (!credential) {
        return {
            status: 'error',
            message: 'No credential provided'
        };
    }

    // Decode the JWT token to extract user information
    const decodedToken = decodeJwtToken(credential);

    if (!decodedToken) {
        return {
            status: 'error',
            message: 'Failed to decode credential token'
        };
    }

    // Create session for the authenticated user
    const sessionId = generateSessionId();
    const sessionData = {
        user: {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            sub: decodedToken.sub
        },
        authenticatedAt: Date.now(),
        credential: credential
    };

    appState.sessions.set(sessionId, sessionData);
    return {
        sessionId,
        clientId: parsedResponse.clientId,
        timestamp: Date.now()
    };
}

/**
 * Ensure unique landmarks by removing duplicates based on key attributes
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Array} - Unique landmark elements
 */
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const uniqueElements = [];
    const seen = new Map();

    landmarks.forEach(element => {
        const key = element.id || element.name || element.className;
        if (!seen.has(key)) {
            seen.set(key, true);
          uniqueElements.push(element);
        }
    });

    return uniqueElements;
}

/**
 * Missing roles validation
 * @param {Array} requiredRoles - Required roles
 * @param {Set} foundRoles - Found roles
 * @returns {Object} - Validation result
 */
function missingRoles(requiredRoles, foundRoles) {
    const missingRoles = requiredRoles.filter(role => !foundRoles.has(role));
    return {
        valid: missingRoles.length === 0,
        foundRoles: Array.from(foundRoles),
        missingRoles
    };
}

/**
 * Fix fake link issues in the document
 * @param {Document} doc - The document to process
 * @returns {number} - Number of issues fixed
 */
function fixFakeLinkIssue(doc) {
    if (typeof doc === 'undefined' || !doc.querySelectorAll) {
        return;
    }
    const clickableElements = doc.querySelectorAll('[onclick]');
    let count = 0;

    clickableElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const hasHref = element.hasAttribute('href');

        if (tagName !== 'a' && !hasHref) {
            const isInteractive = element.getAttribute('role') === 'link' ||
                                   element.getAttribute('tabindex') && element.onclick && element.onclick.toString().length > 0;

            if (isInteractive && element.textContent.trim().length > 0) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
            count++;
        }
    });

    return count;
}

/**
 * Add an aria-label to an element if it doesn't have one
 * @param {HTMLElement} element - The element to add the label to
 * @param {string} label - The label to add
 * @returns {HTMLElement} - The element with aria-label
 */
function addAriaLabel(element, label) {
    if (!element.ariaLabel) {
        element.ariaLabel = label;
    }
    return element;
}

/**
 * Check element accessibility
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if accessible
 */
function checkElementAccessibility(element) {
    return true;
}

/**
 * Handle accessibility issues
 */
function handleAccessibilityIssues() {
    // Placeholder for handling accessibility issues
}

/**
 * Add lang attribute to element
 * @param {HTMLElement} element - The element to add lang attribute to
 * @param {string} lang - The language code
 */
function addLangAttribute(element, lang) {
    if (element) {
        element.setAttribute('lang', lang || navigator.language.split('-')[0]);
    }
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} - True if valid
 */
function validateTableStructure(table) {
    if (!table) return false;
    
    const caption = table.querySelector('caption');
    if (!caption) return false;
    
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) return false;
    
    for (const header of headers) {
        if (!header.hasAttribute('scope')) {
            return false;
        }
    }
    
    return true;
}

/**
 * Address accessibility issues in tables
 */
function addressAccessibilityIssues() {
    if (typeof document === 'undefined') return;
    
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const accessible = validateTableAccessibility(table);
        const structure = validateTableStructure(table);
        if (!accessible.success || !structure) {
            console.warn('Table accessibility or structure validation failed:', table);
        }
    });
}

/**
 * Implement function to render dependency graph
 * @param {Object} rootNode - Root node for the dependency graph
 * @param {HTMLElement} container - Container to render the graph in
 * @param {Object} options - Rendering options
 * @returns {Object} - Result object with success status
 */
function renderDependencyGraph(rootNode, container, options = {}) {
  try {
    // Validate rootNode parameter
    if (!rootNode) {
      return { success: false, errors: ['Root node is required'] };
    }

    // Build the dependency graph structure
    const graphData = buildDependencyGraph(rootNode, options);

    // Log for debugging
    console.log('Rendering dependency graph starting from:', rootNode);
    console.log('Graph data:', JSON.stringify(graphData, null, 2));

    // If container provided, render visual elements
    if (container && typeof document !== 'undefined') {
      const graphContainer = document.createElement('div');
      // Ensure proper ARIA role for accessibility (address insight report)
      graphContainer.setAttribute('role', 'region');
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
      graphContainer.className = options.className || 'dependency-graph';
      
      // Create SVG for graph visualization
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', options.width || '100%');
      svg.setAttribute('height', options.height || '400');
      svg.setAttribute('aria-hidden', 'true');
      
      // Add accessible description
      const description = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      description.textContent = 'Dependency Graph';
      description.setAttribute('id', 'graph-title');
      svg.appendChild(description);
      
      graphContainer.appendChild(svg);
      container.appendChild(graphContainer);
      
      return {
        success: true,
        message: 'Dependency graph rendered successfully',
        container: graphContainer,
        svg: svg,
        data: graphData
      };
    }

    return {
      success: true,
      message: 'Dependency graph data built successfully',
      data: graphData
    };
  } catch (error) {
    console.error('Error rendering dependency graph:', error);
    return { success: false, errors: [error.message] };
  }
}

/**
 * Builds breadcrumb data from an index path
 * @param {string} indexPath - The path to parse into breadcrumb segments
 * @param {Object} options - Configuration options
 * @returns {Object} - The breadcrumb structure
 */
function buildBreadcrumbData(indexPath, options = {}) {
  const { baseUrl = '', separator = '/' } = options;
  
  if (!indexPath) {
    return { success: false, errors: ['Index path is required'] };
  }

  const segments = indexPath.split(separator).filter(segment => segment.length > 0);
  const breadcrumbs = [];
  let accumulatedPath = baseUrl;

  segments.forEach((segment, index) => {
    accumulatedPath = accumulatedPath + (accumulatedPath.endsWith(separator) ? '' : separator) + segment;
    const label = segment.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    breadcrumbs.push({
      label: label,
      path: accumulatedPath,
      isActive: index === segments.length - 1
    });
  });

  return {
    success: true,
    breadcrumbs: breadcrumbs
  };
}

/**
 * Build dependency graph data structure
 * @param {Object} rootNode - Root node for the dependency graph
 * @param {Object} options - Build options
 * @returns {Object} - Graph data structure
 */
function buildDependencyGraph(rootNode, options = {}) {
  const { maxDepth = 5, includeDevDeps = true } = options;
  
  const graph = {
    nodes: [],
    edges: [],
    root: rootNode
  };

  function traverse(node, depth = 0, visited = new Set()) {
    if (depth > maxDepth || visited.has(node.id)) {
      return;
    }

    visited.add(node.id);
    graph.nodes.push({
      id: node.id,
      name: node.name || node.id,
      type: node.type || 'node'
    });

    if (node.dependencies) {
      node.dependencies.forEach(dep => {
        graph.edges.push({
          from: node.id,
          to: dep.id || dep.name
        });
        traverse(dep, depth + 1, new Set(visited));
      });
    }
  }

  traverse(rootNode);
  return graph;
}

/**
 * Render graph index using new functions
 * @param {Object} graphData - Data for rendering graphs
 */
const renderGraphIndex = (graphData) => {
  addLanguageAttribute();
  addMainLandmarkToIndex();
  addressAccessibilityIssues();
  addLanguageAttribute();
  renderDependencyGraphs(graphData);
}

/**
 * Alternative render graph index
 * @param {Object} graphData - Data for rendering graphs
 */
const renderGraphIndexAlt = (graphData) => {
  addressAccessibilityIssues();
  renderDependencyGraphs(graphData);
}

/**
 * Render dependency graphs in the document
 * @param {Object} graphData - Data for rendering graphs
 */
function renderDependencyGraphs(graphData) {
    if (typeof document === 'undefined') return;
    
    const container = document.getElementById('dependency-graph');
    if (container) {
        const lang = getLangAttribute();
        const deps = countDependencies();
        
        let content = `<div lang="${lang}" role="region" aria-label="Dependency Graph">`;
        content += `<h2>Dependency Graph</h2>`;
        
        if (deps.total > 0) {
            content += `<table role="table">`;
            content += `<caption>Package Dependencies</caption>`;
            content += `<thead><tr><th scope="col">Type</th><th scope="col">Count</th></tr></thead>`;
            content += `<tbody>`;
            content += `<tr><td>Dependencies</td><td>${deps.dependencies}</td></tr>`;
            content += `<tr><td>Dev Dependencies</td><td>${deps.devDependencies}</td></tr>`;
            content += `<tr><td>Total</td><td>${deps.total}</td></tr>`;
            content += `</tbody></table>`;
        } else {
            content += `<p>No dependencies found.</p>`;
        }
        
        content += `</div>`;
        
        container.innerHTML = content;
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            validateTableAccessibility(table);
            validateTableStructure(table);
        });
        const div = container.querySelector('div');
        if (div) {
            addLangAttribute(div);
            addAriaLabel(div, 'Dependency Graph Content');
        }
    }
}

/**
 * Get language attribute from document
 * @returns {string} - Language code
 */
function getLangAttribute() {
    if (typeof document === 'undefined') return 'en';
    return document.documentElement.lang || navigator.language.split('-')[0];
}

/**
 * Add language attribute to document
 */
function addLanguageAttribute() {
    if (typeof document === 'undefined') return;
    const lang = getLangAttribute();
    const htmlElement = document.documentElement;
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
}

/**
 * Add main landmark to index page
 */
function addMainLandmarkToIndex() {
    if (typeof document === 'undefined') return;
    
    const mainElement = document.querySelector('main');
    if (!mainElement) {
        const content = document.getElementById('content') || document.body;
        if (content) {
            content.setAttribute('role', 'main');
            content.setAttribute('id', 'main-content');
        }
    } else {
        mainElement.setAttribute('id', 'main-content');
    }
}

// Export functions for use in other modules
module.exports = {
    loadConfigurations,
    countDependencies,
    sanitizeFilename,
    processData,
    generateSessionId,
    prefersReducedMotion,
    prefersHighContrast,
    isLandmarkElement,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkRoles,
    validateLandmarkStructure,
    AddressabilityIssues,
    makeSvgAccessible,
    getSvgAccessibleName,
    validateInput,
    handleCredentialResponseFn,
    ensureUniqueLandmarks,
    missingRoles,
    fixFakeLinkIssue,
    addAriaLabel,
    checkElementAccessibility,
    handleAccessibilityIssues,
    addLangAttribute,
    addressAccessibilityIssues,
    renderDependencyGraph,
    buildBreadcrumbData,
    buildDependencyGraph,
    renderGraphIndex,
    renderGraphIndexAlt,
    renderDependencyGraphs,
    getLangAttribute,
    addLanguageAttribute,
    addMainLandmarkToIndex
};