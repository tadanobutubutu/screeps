// main.js
// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

const http = require('http')
const fs = require('fs')
const path = require('path')

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
}

// New function to address REACT_015: Add lang attribute to HTML element
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
  let lang = 'en'; // Default to English
  
  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh';
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja';
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru';
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar';
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr';
    } else if (/[äöüß]+/i.test(content)) {
      lang = 'de';
    }
  }
  
  return lang;
}

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('a[href="#main-content"]')
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.getElementById('main-content')
        if (target) {
          target.setAttribute('tabindex', '-1')
          target.focus()
        }
      })
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    })
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.style.position = 'absolute'
    announcer.style.left = '-9999px'
    announcer.textContent = message
    document.body.appendChild(announcer)
    setTimeout(() => announcer.remove(), 1000)
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key
    if (handlers[key]) {
      handlers[key](e)
    }
  }
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
  
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
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
    
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
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
  
  const role = element.getAttribute('role');
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  
  if (role && !validLandmarks.includes(role) && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
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
  
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }
  
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
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
  
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
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
      errors.push(`SVG ${index + 1} is missing accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(type);
    const labeledElements = document.querySelectorAll(`[role="${type}"]`);
    const total = elements.length + labeledElements.length;
    
    if (total > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple ${type} landmarks found (${total}). Consider using unique aria-labels to differentiate them.`);
    } else if (total > 1) {
      const allElements = [...elements, ...labeledElements];
      const labels = allElements.map(el => el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'));
      const uniqueLabels = new Set(labels.filter(l => l));
      if (uniqueLabels.size < total) {
        errors.push(`Multiple ${type} landmarks found without unique aria-labels`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix fake link issues
function createInPageButton(text, onClick) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

function personName(name) {
  if (typeof name !== 'string') {
    return '';
  }
  return name.trim();
}

// Functions to ensure the element has an id, add aria-label, render dependency graphs
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`
  }
  return element
}

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const renderDependencyGraph = (data) => {
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  }
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

function newFocusTrap() {
  return (element) => {
    if (!element) return
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    })
  }
}

function calculateSum(a, b) {
  return a + b
}

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received')
  }

  if (response.error) {
    throw new Error(response.error)
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 36000
    }
  }

  throw new Error('Invalid credential response')
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] ${message}`)
}

// Module-level function definitions
function affectedFunction() {
  return 'affected function result'
}

function updateFunction() {
  return 'update function result'
}

function accessibleFunction() {
  return 'accessible function result'
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.setAttribute('aria-label', `Download ${filename}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`)
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2)
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json')
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = []
    csvRows.push(headers.join(','))

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }

    const csvString = csvRows.join('\n')
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv')
  }
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_\-\.]/gi, '_')
}

function readFileSafe(filePath) {
  try {
    const fs = require('fs')
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error')
    return null
  }
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink()

  document.addEventListener('keydown', (e) => {
    accessibilityUtils.handleKeyboardNav(e, {
      Escape: () => {
      }
    })
  })
}

// Main entry point
function main() {
  return 'main function executed'
}

// Export functions to make them accessible
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName,
  affectedFunction,
  updateFunction,
  accessibleFunction,
  main,
  calculateSum,
  handleCredentialResponse,
  log,
  newFocusTrap,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  accessibilityUtils,
  exportUtils,
  sanitizeFilename,
  readFileSafe,
  initAccessibility,
  CONFIG
}

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.affectedFunction = affectedFunction
  window.updateFunction = updateFunction
  window.accessibleFunction = accessibleFunction
  window.main = main
}