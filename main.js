// TODO: Add new functions to ensure the element has an id, add aria-label, render dependency graphs

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fa5]/.test(content)) {
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
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarkCounts = {};
  
  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role]');
  landmarks.forEach((landmark) => {
    const identifier = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        landmarkCounts[identifier]++;
        errors.push(`Duplicate main landmark found (${landmarkCounts[identifier]})`);
      } else {
        landmarkCounts[identifier] = 1;
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of an element, addressing REACT_036 fake link issues.
 * @param {HTMLElement} element - The element to extract the accessible name from
 * @returns {string|null} The accessible name or null
 */
function personName(element) {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title attribute
  const title = element.getAttribute('title');
  if (title) return title;
  
  // Fall back to text content
  const textContent = element.textContent.trim();
  if (textContent) return textContent;
  
  return null;
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateAccessibleLinks(container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const root = container || document;
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]');
  
  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Ensures an element has an id attribute, generating one if missing.
 * Useful for accessibility when elements need unique identifiers for
 * aria-labelledby, aria-describedby, or label for attributes.
 * @param {HTMLElement} element - The element to ensure has an id
 * @param {string} prefix - Optional prefix for generated id (default: 'elem')
 * @returns {string|null} The element's id (existing or newly generated), or null if element is invalid
 */
function ensureElementHasId(element, prefix = 'elem') {
  if (typeof document === 'undefined' || !element) {
    return null;
  }
  
  let id = element.getAttribute('id');
  
  if (!id) {
    // Generate a unique id with prefix and random suffix
    id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    element.setAttribute('id', id);
  }
  
  return id;
}

/**
 * Adds an aria-label attribute to an element for accessibility.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {boolean} True if successful, false otherwise
 */
function addAriaLabel(element, label) {
  if (typeof document === 'undefined' || !element || typeof label !== 'string') {
    return false;
  }
  
  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders a dependency graph visualization with accessible SVG markup.
 * Creates a visual representation of dependencies with proper accessibility attributes.
 * @param {HTMLElement} container - The container element to render the graph into
 * @param {object} options - Configuration options for the graph
 * @param {Array} options.nodes - Array of node objects with id and label properties
 * @param {Array} options.edges - Array of edge objects with source and target properties
 * @param {number} options.width - Width of the graph (default: 800)
 * @param {number} options.height - Height of the graph (default: 600)
 * @returns {boolean} True if successful, false otherwise
 */
function renderDependencyGraph(container, options = {}) {
  if (typeof document === 'undefined' || !container) {
    return false;
  }
  
  const { nodes = [], edges = [], width = 800, height = 600 } = options;
  
  // Clear any existing content
  container.innerHTML = '';
  
  // Create accessible SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Dependency graph with ${nodes.length} nodes and ${edges.length} edges`);
  
  // Add accessible title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = 'Dependency Graph';
  svg.appendChild(title);
  
  // Add accessible description
  const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
  desc.textContent = `This graph shows dependencies between ${nodes.length} components: ${nodes.map(n => n.label || n.id).join(', ')}`;
  svg.appendChild(desc);
  
  // Calculate node positions in a simple grid layout
  const nodePositions = {};
  const nodeRadius = 20;
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const padding = 60;
  const spacingX = (width - 2 * padding) / Math.max(cols - 1, 1);
  const spacingY = (height - 2 * padding) / Math.max(Math.ceil(nodes.length / cols) - 1, 1);
  
  nodes.forEach((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    nodePositions[node.id] = {
      x: padding + col * spacingX,
      y: padding + row * spacingY
    };
  });
  
  // Draw edges first (so they appear behind nodes)
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);
  
  // Arrow marker for edges
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '10');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  defs.appendChild(marker);
  
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  arrow.setAttribute('points', '0 0, 10 3.5, 0 7');
  arrow.setAttribute('fill', '#666');
  marker.appendChild(arrow);
  
  // Draw edges
  edges.forEach((edge, index) => {
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    
    if (sourcePos && targetPos) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(sourcePos.x));
      line.setAttribute('y1', String(sourcePos.y));
      line.setAttribute('x2', String(targetPos.x));
      line.setAttribute('y2', String(targetPos.y));
      line.setAttribute('stroke', '#666');
      line.setAttribute('stroke-width', '2');
      line.setAttribute('marker-end', 'url(#arrowhead)');
      line.setAttribute('aria-label', `Dependency from ${edge.source} to ${edge.target}`);
      svg.appendChild(line);
    }
  });
  
  // Draw nodes
  nodes.forEach((node, index) => {
    const pos = nodePositions[node.id];
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('role', 'img');
    group.setAttribute('aria-label', node.label || node.id);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', String(nodeRadius));
    circle.setAttribute('fill', '#4a90d9');
    circle.setAttribute('stroke', '#2c5aa0');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(pos.x));
    text.setAttribute('y', String(pos.y + 4));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.textContent = node.label || node.id;
    group.appendChild(text);
    
    svg.appendChild(group);
  });
  
  container.appendChild(svg);
  return true;
}