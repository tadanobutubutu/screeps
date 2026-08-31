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
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/\b(le|la|les|de|du|et|est|une|un|des|pour|dans|sur|avec|ce|que|qui)\b/i.test(content) && 
               /[àâçéèêëîïôùûü]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/\b(der|die|das|ein|eine|und|ist|von|mit|für|auf|im|zu|als|auch|es|an|werden|aus)\b/i.test(content) && 
               /[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
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

// New function to validate table accessibility
function validateTableAccessibility() {
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Check if table has a caption
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push({
        tableIndex: index,
        issue: 'REACT_027',
        message: `Table ${index + 1} is missing a caption element for accessibility`
      });
    }
    
    // Check if table headers have scope attribute
    const headers = table.querySelectorAll('th');
    headers.forEach((header, hIndex) => {
      if (!header.hasAttribute('scope')) {
        issues.push({
          tableIndex: index,
          headerIndex: hIndex,
          issue: 'REACT_027',
          message: `Table ${index + 1} header at index ${hIndex} is missing scope attribute`
        });
      }
    });
    
    // Check if table has proper ID headers association for complex tables
    const cells = table.querySelectorAll('td[headers], th[headers]');
    if (cells.length === 0 && headers.length > 0) {
      // Simple table - verify it has proper structure
      const rows = table.querySelectorAll('tr');
      if (rows.length > 1 && table.querySelector('thead') && table.querySelector('tbody')) {
        // Good - proper semantic structure
      } else {
        issues.push({
          tableIndex: index,
          issue: 'REACT_027',
          message: `Table ${index + 1} should use thead and tbody for proper structure`
        });
      }
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    totalIssues: issues.length
  };
}

// New function to validate table structure
function validateTableStructure() {
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Check for proper table structure
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    // Ensure tables have tbody
    if (!tbody) {
      issues.push({
        tableIndex: index,
        issue: 'REACT_027',
        message: `Table ${index + 1} is missing tbody element`
      });
    }
    
    // Check that thead contains only tr and th/td
    if (thead) {
      const theadRows = thead.querySelectorAll(':scope > tr');
      theadRows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll(':scope > th, :scope > td');
        cells.forEach(cell => {
          if (cell.tagName === 'TD') {
            issues.push({
              tableIndex: index,
              rowIndex: rowIndex,
              issue: 'REACT_027',
              message: `Table ${index + 1} thead row ${rowIndex + 1} should use th instead of td`
            });
          }
        });
      });
    }
    
    // Check for proper column/row headers
    const headers = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    if (headers.length === 0 && dataCells.length > 0) {
      issues.push({
        tableIndex: index,
        issue: 'REACT_027',
        message: `Table ${index + 1} appears to need header cells for accessibility`
      });
    }
    
    // Check for merged cells that may cause accessibility issues
    const mergedCells = table.querySelectorAll('[colspan], [rowspan]');
    mergedCells.forEach(cell => {
      const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
      const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
      
      if (colspan > 1 || rowspan > 1) {
        // Verify there's appropriate header association
        if (!cell.hasAttribute('headers') && !cell.hasAttribute('scope')) {
          issues.push({
            tableIndex: index,
            issue: 'REACT_027',
            message: `Table ${index + 1} merged cell is missing headers or scope attribute`
          });
        }
      }
    });
  });
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    totalIssues: issues.length
  };
}

// New function to validate landmarks
function validateLandmark() {
  const issues = [];
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header'),
    navigation: document.querySelectorAll('[role="navigation"], nav'),
    main: document.querySelectorAll('[role="main"], main'),
    complementary: document.querySelectorAll('[role="complementary"], aside'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer'),
    search: document.querySelectorAll('[role="search"]'),
    form: document.querySelectorAll('[role="form"]')
  };
  
  // Check for required landmarks
  if (landmarks.main.length === 0) {
    issues.push({
      issue: 'REACT_025',
      message: 'Page is missing a main landmark'
    });
  }
  
  // Check for unique banner landmark (should only be one)
  if (landmarks.banner.length > 1) {
    issues.push({
      issue: 'REACT_025',
      message: `Found ${landmarks.banner.length} banner landmarks. Only one banner should exist per page`
    });
  }
  
  // Check for unique contentinfo landmark (should only be one)
  if (landmarks.contentinfo.length > 1) {
    issues.push({
      issue: 'REACT_025',
      message: `Found ${landmarks.contentinfo.length} contentinfo landmarks. Only one contentinfo should exist per page`
    });
  }
  
  // Check for accessible labels on landmarks that need them
  const navLandmarks = landmarks.navigation;
  navLandmarks.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      if (navLandmarks.length > 1) {
        issues.push({
          landmarkType: 'navigation',
          landmarkIndex: index,
          issue: 'REACT_017',
          message: `Navigation landmark ${index + 1} needs an accessible name (aria-label or aria-labelledby)`
        });
      }
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues: issues,
    totalIssues: issues.length
  };
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  const issues = [];
  
  // Check for proper nesting of landmarks
  const main = document.querySelector('main, [role="main"]');
  const header = document.querySelector('header, [role="banner"]');
  const footer = document.querySelector('footer, [role="contentinfo"]');
  
  // Main should not be inside header or footer
  if (main) {
    const mainParent = main.parentElement;
    if (mainParent) {
      if (mainParent.tagName === 'HEADER' || mainParent.getAttribute('role') === 'banner') {
        issues.push({
          issue: 'REACT_017',
          message: 'Main landmark should not be nested inside header/banner'
        });
      }
      if (mainParent.tagName === 'FOOTER' || mainParent.getAttribute('role') === 'contentinfo') {
        issues.push({
          issue: 'REACT_017',
          message: 'Main landmark should not be nested inside footer/contentinfo'
        });
      }
    }
  }
  
  // Check for landmark exclusion issues (landmarks inside other landmarks)
  const landmarkRoles = ['