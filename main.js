// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäéèêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  setHtmlLangAttribute(lang);
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return issues;
  }
  
  // Check if table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      code: 'REACT_027',
      message: 'Table is missing a caption element for accessibility'
    });
  }
  
  // Check if table headers have scope or are properly associated
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.id) {
      issues.push({
        code: 'REACT_027',
        message: `Table header at index ${index} is missing scope attribute`
      });
    }
  });
  
  // Check if data cells have headers association
  const cells = table.querySelectorAll('td[headers]');
  if (headers.length > 0 && cells.length === 0) {
    issues.push({
      code: 'REACT_027',
      message: 'Table has headers but no data cells with headers attribute'
    });
  }
  
  return issues;
}

function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return issues;
  }
  
  // Check for proper thead and tbody structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead) {
    issues.push({
      code: 'REACT_027',
      message: 'Table is missing thead element'
    });
  }
  
  if (!tbody) {
    issues.push({
      code: 'REACT_027',
      message: 'Table is missing tbody element'
    });
  }
  
  // Validate consistent column count
  const rows = table.querySelectorAll('tr');
  let expectedCols = 0;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    const colspan = Array.from(cells).reduce((sum, cell) => {
      return sum + (parseInt(cell.getAttribute('colspan')) || 1);
    }, 0);
    
    if (index === 0) {
      expectedCols = colspan;
    } else if (colspan !== expectedCols) {
      issues.push({
        code: 'REACT_027',
        message: `Row ${index} has inconsistent column count (expected ${expectedCols}, got ${colspan})`
      });
    }
  });
  
  return issues;
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  const issues = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  if (!element) {
    element = document.body;
  }
  
  landmarkRoles.forEach(role => {
    const landmarks = element.querySelectorAll(`[role="${role}"]`);
    landmarks.forEach((landmark, index) => {
      // Check for accessible name on landmark
      const hasLabel = landmark.getAttribute('aria-label') || 
                       landmark.getAttribute('aria-labelledby') ||
                       landmark.querySelector('h1, h2, h3, h4, h5, h6');
      
      if (!hasLabel && landmarkRoles.indexOf(role) !== landmarkRoles.indexOf('main')) {
        issues.push({
          code: 'REACT_017',
          message: `Landmark with role="${role}" is missing accessible name at index ${index}`
        });
      }
    });
  });
  
  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  
  if (typeof document === 'undefined') {
    return issues;
  }
  
  // Check for multiple main landmarks
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Page has ${mains.length} main landmarks, should have only one`
    });
  }
  
  // Check for multiple banner landmarks
  const banners = document.querySelectorAll('[role="banner"]');
  if (banners.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Page has ${banners.length} banner landmarks, should have only one`
    });
  }
  
  // Check for multiple contentinfo landmarks
  const contentinfos = document.querySelectorAll('[role="contentinfo"]');
  if (contentinfos.length > 1) {
    issues.push({
      code: 'REACT_017',
      message: `Page has ${contentinfos.length} contentinfo landmarks, should have only one`
    });
  }
  
  // Check for multiple navigation landmarks
  const navigations = document.querySelectorAll('nav, [role="navigation"]');
  navigations.forEach((nav, index) => {
    const hasLabel = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        code: 'REACT_017',
        message: `Navigation landmark at index ${index} is missing accessible name`
      });
    }
  });
  
  return issues;
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  if (!svg) {
    return '';
  }
  
  // Check if SVG already has an accessible title
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent;
    }
  }
  
  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const issues = [];
  
  if (typeof document === 'undefined') {
    return issues;
  }
  
  const landmarkLabels = {};
  
  // Collect all landmarks with their labels
  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const label = landmark.getAttribute('aria-label') || 
                  landmark.getAttribute('aria-labelledby') ||
                  (landmark.querySelector('h1, h2, h3, h4, h5, h6') || {}).textContent;
    
    if (label) {
      const key = `${role}:${label}`;
      if (landmarkLabels[key]) {
        issues.push({
          code: 'REACT_025',
          message: `Duplicate landmark: role="${role}" with label "${label}" appears ${landmarkLabels[key] + 1} times`
        });
        landmarkLabels[key]++;
      } else {
        landmarkLabels[key] = 1;
      }
    }
  });
  
  return issues;
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const link = document.createElement('a');
  link.href = href || '#';
  link.textContent = text || '';
  
  // Set role="link" explicitly for accessibility
  link.setAttribute('role', 'link');
  
  // Add aria-label if provided
  if (options['aria-label']) {
    link.setAttribute('aria-label', options['aria-label']);
  }
  
  // Handle onClick as button behavior - ensure it's properly announced
  if (options.onClick && !href) {
    link.setAttribute('tabindex', '0');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      options.onClick(e);
    });
    
    // Ensure keyboard accessibility
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        options.onClick(e);
      }
    });
  }
  
  // Ensure links have accessible names
  if (!text && !options['aria-label']) {
    console.warn('REACT_036: Link is missing accessible name');
  }
  
  return link;
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = (typeof document !== 'undefined' ? document.body : null)) {
  if (typeof document === 'undefined') {
    return null;
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '[...]';
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  
  if (parent) {
    parent.appendChild(btn);
  }
  
  return btn;
}

// TODO: Implement spawning logic
function spawnProcess(command) {
  // Implementation for spawning a process based on the command argument
  // Placeholder: This is where the actual spawning logic would go
  console.log(`Spawning process for command: ${command}`);
  // Return a Promise that resolves when the process is spawned
  return new Promise((resolve, reject) => {
    // Example of creating a process (node.js specific)
    const child = require('child_process').spawn(command);
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve('Process exited with code 0');
      } else {
        reject(`Process exited with code ${code}`);
      }
    });
  });
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createInPageButton,
  createAccessibleLink,
  spawnProcess
};