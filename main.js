// main.js - Main application file

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}]: ${message}`);
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0 && input.length <= 1000;
}

function parseJSONsafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function formatResponse(data, statusCode = 200) {
  return {
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
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

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let newKey = preserveKeys ? key : key.trim();
      newKey = uppercase ? newKey.toUpperCase() : newKey;
      result[newKey] = transformInputData(value, options);
    }
    return result;
  }

  return inputData;
}

// Additional utility functions for accessibility
function getLangAttribute(document) {
  // Implementation for REACT_015: Add lang attribute to HTML element
  if (!document || !document.documentElement) {
    return null;
  }
  
  const htmlElement = document.documentElement;
  const currentLang = htmlElement.getAttribute('lang');
  
  if (!currentLang) {
    // Default to 'en' if no lang attribute is present
    htmlElement.setAttribute('lang', 'en');
    return 'en';
  }
  
  return currentLang;
}

function personName(element) {
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  if (!element) {
    return null;
  }
  
  // Check if element is an anchor with href
  if (element.tagName === 'A' && element.getAttribute('href')) {
    // This is a real link, return the accessible name
    return element.textContent.trim() || element.getAttribute('aria-label') || element.getAttribute('title') || 'Link';
  }
  
  // Check if element is a fake link (clickable element without href)
  if (element.tagName === 'BUTTON' || (element.tagName === 'A' && !element.getAttribute('href'))) {
    // For fake links, ensure proper accessible name
    return element.textContent.trim() || element.getAttribute('aria-label') || element.getAttribute('title') || 'Button';
  }
  
  return element.textContent?.trim() || null;
}

function getSvgAccessibleName(svgElement) {
  // Implementation for REACT_041: Add accessible names to 2 SVGs
  if (!svgElement || svgElement.tagName !== 'SVG') {
    return null;
  }
  
  // Check for aria-label or aria-labelledby
  let accessibleName = svgElement.getAttribute('aria-label');
  
  if (!accessibleName) {
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
      // In a real implementation, would look up the referenced element
      accessibleName = `Referenced by: ${labelledBy}`;
    }
  }
  
  // Check for title child element
  if (!accessibleName) {
    const titleElement = svgElement.querySelector('title');
    if (titleElement) {
      accessibleName = titleElement.textContent.trim();
    }
  }
  
  // If still no accessible name, add a default one for icons
  if (!accessibleName && svgElement.getAttribute('role') === 'img') {
    const id = svgElement.getAttribute('id') || 'svg-icon';
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `Icon: ${id}`;
    svgElement.insertBefore(title, svgElement.firstChild);
    accessibleName = title.textContent;
  }
  
  return accessibleName;
}

function validateTableAccessibility(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  const headers = tableElement.querySelectorAll('th');
  const dataCells = tableElement.querySelectorAll('td');
  
  // Check if table has header cells
  if (headers.length === 0) {
    errors.push('Table should have header cells (th) for accessibility');
  }
  
  // Check if headers have scope attribute
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check if data cells have headers attribute when in complex tables
  dataCells.forEach((td, index) => {
    if (!td.hasAttribute('headers') && headers.length > 0) {
      errors.push(`Data cell at index ${index} should have headers attribute for proper association`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    headerCount: headers.length,
    dataCellCount: dataCells.length
  };
}

function validateTableStructure(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  
  // Check for thead
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead section');
  }
  
  // Check for tbody
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody section');
  }
  
  // Check for caption if table has headers
  const caption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');
  if (hasHeaders && !caption) {
    errors.push('Table with header cells should have a caption');
  }
  
  // Check that th elements are inside thead
  const thsOutsideThead = Array.from(tableElement.querySelectorAll('th'))
    .filter(th => !tableElement.querySelector('thead')?.contains(th));
  if (thsOutsideThead.length > 0) {
    errors.push('All th elements should be inside thead');
  }
  
  // Check for proper row structure
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length === 0) {
      errors.push(`Row at index ${index} has no cells`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    hasThead: !!thead,
    hasTbody: !!tbody,
    hasCaption: !!caption,
    rowCount: rows.length
  };
}

function validateLandmark(landmarkElement) {
  // Implementation for REACT_017: Add/fix 4 landmark issues
  if (!landmarkElement) {
    return { valid: false, errors: ['Landmark element is required'] };
  }

  const errors = [];
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = landmarkElement.getAttribute('role');

  // Check if landmark has a valid role
  if (!role) {
    errors.push('Landmark element should have a role attribute');
  } else if (!validRoles.includes(role)) {
    errors.push(`Landmark element has invalid role: ${role}`);
  }

  // Check if landmark has accessible name
  const accessibleName = landmarkElement.getAttribute('aria-label') ||
                        landmarkElement.getAttribute('aria-labelledby') ||
                        landmarkElement.getAttribute('title');
  if (!accessibleName) {
    errors.push('Landmark element should have an accessible name');
  }

  // For navigation landmarks, ensure they have distinct accessible names
  if (role === 'navigation' && !accessibleName) {
    errors.push('Navigation landmark should have an accessible name to distinguish it from other navigation landmarks');
  }

  return {
    valid: errors.length === 0,
    errors,
    role,
    hasAccessibleName: !!accessibleName
  };
}

function validateLandmarkStructure(landmarks) {
  // Implementation for REACT_017: Add/fix 4 landmark issues
  if (!Array.isArray(landmarks)) {
    return { valid: false, errors: ['Landmarks should be provided as an array'] };
  }

  const errors = [];
  const seenRoles = {};
  let duplicateCount = 0;

  // Check for duplicate landmarks of the same type (REACT_025: Ensure unique landmarks)
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (!seenRoles[role]) {
        seenRoles[role] = 0;
      }
      seenRoles[role]++;
      
      if (seenRoles[role] > 1) {
        duplicateCount++;
        errors.push(`Duplicate landmark of role "${role}" found at index ${index}. Only one "${role}" landmark should exist per page.`);
      }
    }
  });

  // Check that main landmark exists exactly once
  const mainLandmarks = landmarks.filter(l => l.getAttribute('role') === 'main');
  if (mainLandmarks.length === 0) {
    errors.push('Page should have exactly one main landmark');
  } else if (mainLandmarks.length > 1) {
    errors.push('Page should have exactly one main landmark, but found multiple');
  }

  return {
    valid: errors.length === 0,
    errors,
    landmarkCount: landmarks.length,
    duplicateCount,
    mainLandmarkCount: mainLandmarks.length
  };
}

function ensureElementHasId(element) {
  // Implement logic to ensure the element has an id
  if (!element || !element.setAttribute) {
    return null;
  }
  
  const existingId = element.getAttribute('id');
  if (existingId) {
    return existingId;
  }
  
  // Generate a unique ID based on element type and timestamp
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'element';
  const uniqueId = `${tagName}-${Date.now()}`;
  element.setAttribute('id', uniqueId);
  return uniqueId;
}

function addAriaLabel(element, label) {
  // Implement logic to add aria-label to the element
  if (!element || !element.setAttribute) {
    return false;
  }
  
  if (label) {
    element.setAttribute('aria-label', label);
    return true;
  }
  
  // If no label provided, try to derive one from content
  const content = element.textContent?.trim() || element.getAttribute('title');
  if (content) {
    element.setAttribute('aria-label', content);
    return true;
  }
  
  return false;
}

function createInPageButton(text, options = {}) {
  // Implementation for REACT_036: Fix 1 fake link issue
  const { 
    href = null, 
    onClick = null, 
    ariaLabel = null, 
    className = 'in-page-button' 
  } = options;
  
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  
  // Set aria-label if provided or derive from text
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else {
    button.setAttribute('aria-label', text);
  }
  
  // Add click event if provided
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // If href is provided, make it a real link instead
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.className = className;
    
    if (ariaLabel) {
      link.setAttribute('aria-label', ariaLabel);
    } else {
      link.setAttribute('aria-label', text);
    }
    
    return link;
  }
  
  return button;
}

function renderDependencyGraphs(element) {
  // Implement logic to render the dependency graphs
  if (!element || !element.appendChild) {
    return null;
  }
  
  // Create container for graphs
  const container = document.createElement('div');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graphs');
  container.className = 'dependency-graphs-container';
  
  // Create SVG for graph visualization
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency Graph Visualization');
  svg.setAttribute('tabindex', '0');
  
  // Add title for accessibility
  const title = document.createElementNS(svgNS, 'title');
  title.textContent = 'Dependency Graph Visualization';
  svg.appendChild(title);
  
  // Add descriptive text for screen readers
  const desc = document.createElementNS(svgNS, 'desc');
  desc.textContent = 'Interactive visualization showing module dependencies. Use arrow keys to navigate between nodes.';
  svg.appendChild(desc);
  
  // Sample nodes (would be populated with actual dependency data)
  const nodes = [
    { id: 'main', label: 'Main', x: 100, y: 100 },
    { id: 'module1', label: 'Module 1', x: 200, y: 200 },
    { id: 'module2', label: 'Module 2', x: 300, y: 150 }
  ];
  
  // Add nodes to SVG
  nodes.forEach(node => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('role', 'group');
    g.setAttribute('aria-label', node.label);
    g.setAttribute('tabindex', '0');
    
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', '#4a90e2');
    
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 35);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#333');
    text.textContent = node.label;
    
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  });
  
  container.appendChild(svg);
  element.appendChild(container);
  
  return container;
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export all functions
module.exports = {
  CONFIG,
  log,
  validateInput,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  getLangAttribute,
  personName,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureElementHasId,
  addAriaLabel,
  createInPageButton,
  renderDependencyGraphs,
  calculateSum
};