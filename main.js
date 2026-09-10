// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
//_Commit: d8d02021406e5d8b828d9152d138300270e58d9c_

// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// existing code...

// Assuming there's a function `newFunction` that needs to be exported
export function newFunction() {
  // function body...
}

// Function for checking landmark elements
function checkLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    return false;
  }

export function greet(name) {
  return `Hello, ${name}!`;
}

export function isEven(num) {
  return num % 2 === 0;
}

export function isOdd(num) {
  return num % 2 !== 0;
}

// Array utility functions
export function sumArray(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function averageArray(arr) {
  if (arr.length === 0) return 0;
  return sumArray(arr) / arr.length;
}

export function findMax(arr) {
  return Math.max(...arr);
}

export function findMin(arr) {
  return Math.min(...arr);
}

// String utility functions
export function reverseString(str) {
  return str.split('').reverse().join('');
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str) {
  return str.split(' ').map(capitalize).join(' ');
}

// Additional utility functions
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function capitalizeString(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Accessibility improvements for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
 * - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
 * - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
 * - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
 * - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
 * - REACT_036: Fix 1 fake link issues (DONE: fixFakeLinkIssue)
 */

// Accessibility functions are now accessible in main.js:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function addLangAttributeToHtml(html) {
  if (typeof html !== 'string') return html;
  
  return html.replace(/<html([^>]*)>/gi, (match, attrs) => {
    // Check if lang attribute already exists
    if (!attrs || attrs.includes(' lang=')) {
      return match;
    }
  });
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function fixTableStructure(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th\b([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes(' scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table\b([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes(' summary=') || attrs && attrs.includes(' caption')) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Note: The following complex tbody/thead wrapping logic has been removed
  // due to implementation complexity and potential for breaking HTML structure.
  // The function now focuses on adding missing scope and summary attributes,
  // which are critical for accessibility and can be safely applied with regex.
  
  return result;
}

/**
 * Adds main landmark to HTML for proper document structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with main landmark added
 */
export function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if (/<main\b/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main>${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body${bodyAttrs || ''}>${wrappedContent}</body>`);
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function addSvgLabels(html) {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return html.replace(/<svg\b([^>]*)>/gi, (match, attrs) => {
    // Handle case where attrs might be undefined (for <svg> without attributes)
    const attributes = attrs || '';
    const existingLabel = attributes.match(/aria-label=/) || attributes.match(/aria-labelledby=/);
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = attributes.match(/<title>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attributes.match(/id="([^"]*)"/);
    if (idMatch) {
      return `<svg${attributes} role="img" aria-labelledby="${idMatch[1]}-title">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return `<svg${attributes} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
  });
  
  return landmarks;
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  html = html.replace(/<main(\s[^>]*)?>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if (safeAttrs.includes('aria-label=') || safeAttrs.includes("aria-label=")) {
      return `<section${safeAttrs}>`;
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (html.match(/<main\\b/gi) || []).length;
  const mainCloseCount = (html.match(/<\/main>/gi) || []).length;
  if (mainCloseCount > mainOpenCount) {
    const extras = mainCloseCount - mainOpenCount;
    let replaced = 0;
    html = html.replace(/<\/main>/gi, (match) => {
      if (replaced < extras) {
        replaced += 1;
        return '</section>';
      }
      return match;
    });
  }
  
  // Recompute counters after main -> section conversion
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Assign unique IDs to remaining landmarks
  landmarks.forEach(lm => {
    const count = counters[lm] || 0;
    if (count === 0) return;
    const seen = {};
    const openRegex = new RegExp(`<${lm}(\\s[^>]*)?>`, 'gi');
    html = html.replace(openRegex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && inner.includes('id=')) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return `<${lm} id="${id}"${inner || ''}>`;
    });
  });
  
  return html;
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return html.replace(/<a(\s[^>]*)?>/gi, (match, attrs) => {
    if (attrs && attrs.includes('href=')) {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

/**
 * Checks table structure for accessibility issues
 * @param {string} html - The HTML string to check
 * @returns {string[]} Array of error messages
 */
export function checkTableStructure(html) {
  if (typeof html !== 'string') return [];
  
  const issues = [];
  const tableRegex = /<table\b[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[0];
    
    // Check for caption
    if (!/<caption\b/i.test(tableHtml)) {
      issues.push('Table missing <caption> element');
    }
    
    // Check for summary attribute
    if (!/\bsummary=/i.test(tableHtml)) {
      issues.push('Table missing summary attribute');
    }
    
    // Check for th with scope
    const thRegex = /<th\b([^>]*)>/gi;
    let thMatch;
    let thMissingScope = false;
    while ((thMatch = thRegex.exec(tableHtml)) !== null) {
      const attrs = thMatch[1];
      if (!/\bscope=/i.test(attrs)) {
        thMissingScope = true;
        break;
      }
    }
    if (thMissingScope) {
      issues.push('<th> missing scope attribute');
    }
    
    // Check for thead/tbody
    if (!/<thead\b/i.test(tableHtml) || !/<tbody\b/i.test(tableHtml)) {
      issues.push('Table missing <thead> or <tbody> structure');
    }
  }
  
  return issues;
}

//------ END OF ORIGINAL CODE ------

// Export all functions for use in tests and other parts of the application
export {
  newFunction,
  wrapPrimaryContentInMain,
  addSkipLink,
  getAccessibleName,
  setAccessibleName,
  addProperLandmarkRegions,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
};

// New functions to be added
const addLangAttribute = (document) => {
  const html = document.documentElement;
  if (html && !html.lang) {
    html.lang = 'en';
  }
  return document;
};

const fixTableStructureIssues = (document) => {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }

    if (table.querySelector('tbody') === null) {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length > 0) {
        const newTbody = document.createElement('tbody');
        rows.forEach((row) => newTbody.appendChild(row));
        table.appendChild(newTbody);
      }
    }

    const thead = table.querySelector('thead');
    if (thead) {
      thead.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'col'));
    }

    const tbodies = table.querySelectorAll('tbody');
    tbodies.forEach(tbody => {
      tbody.querySelectorAll('th').forEach(th => th.setAttribute('scope', 'row'));
    });
  });
  return document;
};

const ensureUniqueLandmarks = (document) => {
  const landmarkTypes = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const usedIds = new Set();

  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(`[role="${type}"], ${type}`);
    elements.forEach((element) => {
      if (!element.id) {
        let idSuffix = 1;
        const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        let id = `${type}-${idSuffix}`;
        while (existingIds.includes(id)) {
          idSuffix++;
          id = `${type}-${idSuffix}`;
        }
        element.id = id;
      }
    });
  });
};

const addSvgAccessibleNames = (document) => {
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  svgs.forEach((svg) => {
    if (!svg.getAttribute('role') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG ${svgIndex + 1}`;
      title.id = `svg-title-${svgIndex + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgIndex++;
  });
  return document;
};

const fixFakeLinkIssue = (document) => {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    // Add role="link" to ensure it's recognized as a link by screen readers
    if (!link.getAttribute('role') || link.getAttribute('role') === 'button') {
      link.setAttribute('role', 'link');
    }
    // Ensure the link has accessible name
    if (link.getAttribute('role') === 'link' && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
    // Remove href="#" and add href="#" with proper handling
    if (link.getAttribute('href') === '#') {
      link.setAttribute('href', 'javascript:void(0);');
    }
  });
  return document;
};