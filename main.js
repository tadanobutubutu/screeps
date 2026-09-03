// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const primaryContent = (typeof document !== 'undefined') ? document.getElementById('main') || document.querySelector('main') || document.body : null;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const a11yStore = {
  makeSvgAccessible,
  configureSvgAccessibility,
  setSvgAttributes
};

const AddressabilityIssues = {
  validateTableAccessibility,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel
};

// TODO: This is the existing code that needs to be preserved
// _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
// <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: c7a2c98be5bf45c7b763675b95fe8c30ac1d2f8f_

// <!-- todo-hash: 469dfeab59b4116886abe058392a60b81da4857c -->

/**
 * Similar to existing function, with changes to preserve both the existing and the new
 * function implementation. This helps maintain backward compatibility while implementing the new.
 */
function accessibility() {
  if (typeof document === 'undefined') return;

  // Handle initial accessibility setup on page load
  handleInitialAccessibility();

  // Check and fix landmark elements
  if (typeof checkLandmarkElements === 'function') {
    checkLandmarkElements();
  }

  // Add SVG accessibility props
  a11yStore.addSVGAccessibilityProps();

  // Fix fake links
  a11yStore.fixFakeLinks();

  // Ensure interactive elements have proper roles
  a11yStore.ensureInteractiveRoles();

  // Add form control labels
  a11yStore.addFormControlLabels();

  // Ensure images have alt text
  a11yStore.ensureImageAccessibility();

  // More accessibility improvements can be added here as needed
}

<<<<<<< HEAD
// TODO: Implement the new function as per the issue requirements
const AnotherExport = (input) => {
  // Placeholder implementation, replace with actual functionality
  return input;
}

module.exports = {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  addressAccessibilityIssues,
  renderGraphIndex,
  AnotherExport
}
=======
function ensureInteractiveElementsAccessible() {
  // This covers both existing and new accessibility improvements for interactive elements
  accessibility();
}

function handleInitialAccessibility() {
  if (!document) return;
  addLanguageAttribute();
  addMainLandmarkToIndex();
}

/**
 * Add language attribute to document
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  // TODO: Extract the accessible name for an SVG from its content
  // Extract text content from SVG text elements as fallback
  const textElements = svg.querySelectorAll('text, tspan, textPath');
  const textContent = Array.from(textElements)
    .map(el => el.textContent || '')
    .filter(text => text.trim())
    .join(' ')
    .trim();

  if (textContent) {
    return textContent;
  }

  // Check for desc element as fallback
  const desc = svg.querySelector('desc');
  if (desc) {
    return desc.textContent || '';
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Builds a hierarchical representation of dependencies from a root node
 * @param {HTMLElement} node - The DOM node to analyze for dependencies
 * @param {Object} options - Configuration options
 * @param {string} options.dependencyAttribute - Data attribute to look for dependencies (default: 'data-dependency')
 * @param {string} options.idAttribute - Attribute to use as node identifier (default: 'id')
 * @returns {Object} The dependency graph structure
 */
function buildDependencyGraph(node, options = {}) {
  const { dependencyAttribute = 'data-dependency', idAttribute = 'id' } = options;
  
  if (!node) {
    return { success: false, errors: ['Node is required'] };
  }

  function processNode(domNode) {
    if (!domNode) return null;
    
    const nodeData = {
      id: domNode.getAttribute ? domNode.getAttribute(idAttribute) || domNode.id || 'anonymous' : 'anonymous',
      tagName: domNode.tagName ? domNode.tagName.toLowerCase() : 'unknown',
      dependencies: [],
      children: []
    };

    // Find dependencies
    const depElements = domNode.querySelectorAll ? domNode.querySelectorAll(`[${dependencyAttribute}]`) : [];
    depElements.forEach(dep => {
      const depId = dep.getAttribute(dependencyAttribute);
      nodeData.dependencies.push({
        id: depId,
        name: dep.getAttribute(idAttribute) || depId,
        element: dep
      });
    });

    // Process child nodes recursively
    if (domNode.children) {
      Array.from(domNode.children).forEach(child => {
        const childData = processNode(child);
        if (childData) {
          nodeData.children.push(childData);
        }
      });
    }

    return nodeData;
  }

  return {
    success: true,
    root: processNode(node)
  };
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} rootNode - The root DOM node to render the graph from
 * @param {HTMLElement} container - Optional container element to render into
 * @param {Object} options - Rendering options
 * @returns {Object} Result with success status and rendered graph data
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
      graphContainer.setAttribute('role', 'img');
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
=======
function addLanguageAttribute() {
  if (typeof document !== 'undefined') {
    addLangAttribute(document.documentElement);
  }
}

/**
 * Add main landmark to index page
 */
function addMainLandmarkToIndex() {
  if (typeof document !== 'undefined') {
    const main = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main');
    if (main) {
      main.setAttribute('role', 'main');
    }
  }
}

// Main entry point function (implementation added)
function main() {
  // Main application logic can be added here
  console.log("Main function executed");
  // Example: initialize accessibility features
  accessibility();
  // Additional setup can be added as needed
}

// TODO: Add new functions below this line

module.exports = {
    config,
    a11yStore,
    addressabilityIssues: AddressabilityIssues,
    accessibility,
    ensureInteractiveElementsAccessible,
    handleInitialAccessibility,
    addLanguageAttribute,
    addMainLandmarkToIndex,
    main
};
>>>>>>> origin/main

// Merge the two files, keeping all unique functions and fixing inconsistencies

// Keep the original accessibility() function from HEAD
function accessibility() {
  if (typeof document === 'undefined') return;

  // Handle initial accessibility setup on page load
  handleInitialAccessibility();

  // Check and fix landmark elements
  if (typeof checkLandmarkElements === 'function') {
    checkLandmarkElements();
  }

  // Add SVG accessibility props
  a11yStore.addSVGAccessibilityProps();

  // Fix fake links
  a11yStore.fixFakeLinks();

  // Ensure interactive elements have proper roles
  a11yStore.ensureInteractiveRoles();

  // Add form control labels
  a11yStore.addFormControlLabels();

  // Ensure images have alt text
  a11yStore.ensureImageAccessibility();

  // More accessibility improvements can be added here as needed
}

// Keep the new functions from HEAD that were not in origin/main
// These include: AnotherExport, detectAndSetLang, getLangAttribute, personName, 
// validateTableAccessibility, validateTableStructure, validateLandmark, 
// ensureUniqueLandmarks, createAccessibleLink, isLinkAccessible, createInPageButton, 
// buildDependencyGraph, renderDependencyGraph

// Also keep the functions that existed in origin/main but were modified or removed
// Specifically: addLanguageAttribute, addMainLandmarkToIndex, main

// Combine all modules.exports from both versions, avoiding duplicates
// The final module.exports should contain:
// - config
// - a11yStore
// - addressabilityIssues
// - accessibility
// - ensureInteractiveElementsAccessible
// - handleInitialAccessibility
// - addLanguageAttribute
// - addMainLandmarkToIndex
// - AnotherExport (from HEAD)
// - main (from origin/main)
// - createInPageButton
// - buildDependencyGraph
// - renderDependencyGraph

// Note: Some functions had slight signature differences between versions.
// We will standardize them to match the HEAD version where possible, 
// but keep the new functions from HEAD that provide additional capabilities.

// Let me construct the final file by combining everything:

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const primaryContent = (typeof document !== 'undefined') ? document.getElementById('main') || document.querySelector('main') || document.body : null;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const a11yStore = {
  makeSvgAccessible,
  configureSvgAccessibility,
  setSvgAttributes
};

const AddressabilityIssues = {
  validateTableAccessibility,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Original accessibility function from HEAD
function accessibility() {
  if (typeof document === 'undefined') return;

  // Handle initial accessibility setup on page load
  handleInitialAccessibility();

  // Check and fix landmark elements
  if (typeof checkLandmarkElements === 'function') {
    checkLandmarkElements();
  }

  // Add SVG accessibility props
  a11yStore.addSVGAccessibilityProps();

  // Fix fake links
  a11yStore.fixFakeLinks();

  // Ensure interactive elements have proper roles
  a11yStore.ensureInteractiveRoles();

  // Add form control labels
  a11yStore.addFormControlLabels();

  // Ensure images have alt text
  a11yStore.ensureImageAccessibility();

  // More accessibility improvements can be added here as needed
}

// New functions from HEAD that were not in origin/main
function AnotherExport(input) {
  // Placeholder implementation, replace with actual functionality
  return input;
}

// Functions from HEAD that were also in origin/main but need to be included
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document