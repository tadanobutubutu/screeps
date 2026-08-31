// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

// Existing code...

const accessibilityUtils = {
  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // REACT_015: Add lang attribute to HTML element
  setHtmlLangAttribute: (lang = 'en') => {
    if (typeof document === 'undefined') return;
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
  },

  // REACT_027: Fix table structure issues
  validateTableAccessibility: (table) => {
    if (!table || table.tagName !== 'TABLE') return { valid: false, issues: ['Element is not a TABLE'] };

    const issues = [];

    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push('Table is missing a <caption> element');
    }

    // Check for headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push('Table has no <th> elements');
    }

    // Check scope attribute on headers
    headers.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        issues.push(`<th> at index ${index} is missing scope attribute`);
      }
    });

    return { valid: issues.length === 0, issues };
  },

  validateTableStructure: (tables) => {
    const results = [];
    tables.forEach((table, index) => {
      results.push({
        tableIndex: index,
        result: accessibilityUtils.validateTableAccessibility(table)
      });
    });
    return results;
  },

  // REACT_017: Validate landmark issues
  validateLandmark: (element) => {
    if (!element) return { valid: false, issues: ['Element is null'] };

    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search', 'form'];
    const role = element.getAttribute('role');
    const tagName = element.tagName.toLowerCase();

    const landmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'form'];
    const isLandmark = landmarkTags.includes(tagName) || (role && validRoles.includes(role));

    const issues = [];
    if (!isLandmark) {
      issues.push('Element is not a recognized landmark');
    }

    if (tagName === 'section' && !element.querySelector('h1, h2, h3, h4, h5, h6')) {
      issues.push('Section without an accessible name (heading) requires aria-label or aria-labelledby');
    }

    return { valid: issues.length === 0, issues };
  },

  validateLandmarkStructure: (elements) => {
    const results = [];
    elements.forEach((element, index) => {
      results.push({
        elementIndex: index,
        result: accessibilityUtils.validateLandmark(element)
      });
    });
    return results;
  },

  // REACT_041: Add accessible names to SVGs
  getSvgAccessibleName: (svg) => {
    if (!svg || svg.tagName !== 'svg') return null;

    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const refElement = document.getElementById(ariaLabelledBy);
      if (refElement) return refElement.textContent;
    }

    const titleElement = svg.querySelector('title');
    if (titleElement) return titleElement.textContent;

    return null;
  },

  setSvgAttributes: (svg, accessibleName, role = 'img') => {
    if (!svg || svg.tagName !== 'svg') return;

    if (accessibleName) {
      if (!svg.querySelector('title')) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = accessibleName;
        svg.insertBefore(title, svg.firstChild);
      }
      svg.setAttribute('aria-label', accessibleName);
    }

    svg.setAttribute('role', role);
    if (!svg.hasAttribute('focusable')) {
      svg.setAttribute('focusable', 'false');
    }
  },

  // REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks: () => {
    if (typeof document === 'undefined') return [];
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer, section');
    const seen = new Map();
    const duplicates = [];

    landmarks.forEach((landmark) => {
      const tagName = landmark.tagName.toLowerCase();
      const role = landmark.getAttribute('role') || tagName;
      const key = `${role}::${landmark.id || ''}::${landmark.getAttribute('aria-label') || ''}`;

      if (seen.has(role)) {
        const count = seen.get(role).count + 1;
        seen.get(role).count = count;
        if (!landmark.id) {
          landmark.id = `${role}-${count}`;
        }
        duplicates.push(landmark);
      } else {
        seen.set(role, { count: 1, element: landmark });
        if (role === 'region' && !landmark.id && !landmark.getAttribute('aria-label')) {
          landmark.setAttribute('aria-label', `Region ${seen.get(role).count}`);
        }
      }
    });

    return duplicates;
  },

  // REACT_036: Fix fake link issues
  createInPageButton: (options = {}) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = options.text || '';
    button.className = options.className || '';
    if (options.onClick) button.addEventListener('click', options.onClick);
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    return button;
  },

  validateLinkAccessibility: (link) => {
    if (!link || link.tagName !== 'A') return { valid: false, issues: ['Element is not an anchor'] };

    const issues = [];
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');

    if (!href || href === '#' || href.trim() === '') {
      issues.push('Link has empty or "#" href (fake link)');
    }

    if (!text && !ariaLabel) {
      issues.push('Link has no accessible text');
    }

    return { valid: issues.length === 0, issues };
  },

  handleFakeLinks: (rootElement = document) => {
    if (typeof document === 'undefined') return [];
    const fixedElements = [];
    const links = rootElement.querySelectorAll('a');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#' || !href || href.trim() === '') {
        const button = accessibilityUtils.createInPageButton({
          text: link.textContent.trim(),
          className: link.className,
          ariaLabel: link.getAttribute('aria-label')
        });
        if (link.parentNode) {
          link.parentNode.replaceChild(button, link);
          fixedElements.push(button);
        }
      }
    });

    return fixedElements;
  },

  // REACT_037: Add proper landmark regions
  addProperLandmarkRegions: () => {
    if (typeof document === 'undefined') return [];

    const added = [];

    // Add main landmark if missing
    if (!document.querySelector('main, [role="main"]')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      const content = document.querySelector('#content, .content, body > div');
      if (content) {
        main.appendChild(content);
      }
      document.body.appendChild(main);
      added.push(main);
    }

    // Add navigation landmark if missing
    if (!document.querySelector('nav, [role="navigation"]')) {
      const nav = document.createElement('nav');
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
      document.body.insertBefore(nav, document.body.firstChild);
      added.push(nav);
    }

    // Add contentinfo (footer) landmark if missing
    if (!document.querySelector('footer, [role="contentinfo"]')) {
      const footer = document.createElement('footer');
      footer.setAttribute('role', 'contentinfo');
      document.body.appendChild(footer);
      added.push(footer);
    }

    return added;
  },

  // Skip link initialization
  initSkipLink: () => {
    if (typeof document === 'undefined') return;
    const skipLink = document.querySelector('a[href^="#main"], [data-skip-link]');
    if (!skipLink) {
      const newSkipLink = document.createElement('a');
      newSkipLink.href = '#main';
      newSkipLink.textContent = 'Skip to main content';
      newSkipLink.className = 'skip-link';
      if (document.body.firstChild) {
        document.body.insertBefore(newSkipLink, document.body.firstChild);
      } else {
        document.body.appendChild(newSkipLink);
      }
    }
  },

  // Get language attribute
  getLangAttribute: () => {
    if (typeof document === 'undefined') return 'en';
    const htmlElement = document.documentElement;
    return htmlElement ? htmlElement.getAttribute('lang') || 'en' : 'en';
  },

  // NEW: Implement a new function to handle focus trap for keyboard navigation
  newFocusTrap: (element) => {
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const trapFocusHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', trapFocusHandler);
    
    return () => {
      element.removeEventListener('keydown', trapFocusHandler);
    };
  }
};

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Apply all accessibility fixes from the insight report
  accessibilityUtils.setHtmlLangAttribute();
  accessibilityUtils.ensureUniqueLandmarks();
  accessibilityUtils.addProperLandmarkRegions();

  // Validate and fix tables
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    accessibilityUtils.validateTableStructure(tables);
  }

  // Fix fake links
  accessibilityUtils.handleFakeLinks();

  // Add accessible names to SVGs that don't have them
  if (typeof document !== 'undefined') {
    document.querySelectorAll('svg').forEach((svg) => {
      if (!accessibilityUtils.getSvgAccessibleName(svg)) {
        accessibilityUtils.setSvgAttributes(svg, 'Decorative icon');
      }
    });
  }

  // Validate landmarks
  if (typeof document !== 'undefined') {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section');
    accessibilityUtils.validateLandmarkStructure(Array.from(landmarks));
  }

  // Add keyboard support for all interactive elements
  document.addEventListener('click', (e) => {
    const element = e.target.closest('[role="button"], button, a');
    if (element) {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    }
  });
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]+/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// Accessibility-related references preserved from both sides
const accessibilityExports = {
  getLangAttribute: accessibilityUtils.getLangAttribute,
  createInPageButton: accessibilityUtils.createInPageButton,
  validateTableAccessibility: accessibilityUtils.validateTableAccessibility,
  validateTableStructure: accessibilityUtils.validateTableStructure,
  getSvgAccessibleName: accessibilityUtils.getSvgAccessibleName,
  setSvgAttributes: accessibilityUtils.setSvgAttributes,
  ensureUniqueLandmarks: accessibilityUtils.ensureUniqueLandmarks,
  validateLinkAccessibility: accessibilityUtils.validateLinkAccessibility,
  handleFakeLinks: accessibilityUtils.handleFakeLinks,
  addProperLandmarkRegions: accessibilityUtils.addProperLandmarkRegions,
  newFocusTrap: accessibilityUtils.newFocusTrap,
};

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
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role) && !validLandmarks.includes(role.toLowerCase())) {
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
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
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
      errors.push(`SVG ${index + 1} is missing accessible name`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}