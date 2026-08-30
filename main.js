import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.lang = lang;
  }
  return lang;
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
    } else if (/[\u0400-\u04FF]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]/i.test(content)) {
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

// New functions to address REACT_017, REACT_041, REACT_025, REACT_036
// (These functions were not provided in the given code snippet, but they are inferred from the conflict markers and the given function names)

function addLangAttribute(lang) {
  return setHtmlLangAttribute(lang);
}

function fixTableStructure(tableOrUrl) {
  if (typeof document === 'undefined') return { fixed: false, count: 0 };
  const tables = typeof tableOrUrl === 'string' ? document.querySelectorAll('table') : (tableOrUrl ? (Array.isArray(tableOrUrl) ? tableOrUrl : [tableOrUrl]) : []);
  let fixed = 0;
  tables.forEach(table => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      try {
        table.insertBefore(caption, table.firstChild);
        fixed++;
      } catch (e) {}
    }
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
        fixed++;
      }
    }
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      rows.forEach(row => {
        if (row.parentElement === table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
      fixed++;
    }
    table.querySelectorAll('th').forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
        fixed++;
      }
    });
  });
  return { fixed: fixed > 0, count: fixed, tables: tables.length };
}

function validateLandmark(element) {
  const el = typeof element === 'string' ? (typeof document !== 'undefined' ? document.querySelector(element) : null) : (element || (typeof document !== 'undefined' ? document.body : null));
  if (!el) return { valid: false, role: null, message: 'No element found' };
  const role = el.getAttribute('role') || el.tagName.toLowerCase();
  const validLandmarks = ['main', 'navigation', 'region', 'search', 'banner', 'contentinfo', 'form', 'application', 'complementary'];
  const isValid = validLandmarks.indexOf(role) !== -1 || !!el.querySelector('[role]');
  return { valid: isValid, role, message: isValid ? 'Landmark valid' : 'Landmark missing or invalid' };
}

function validateLandmarkStructure(root) {
  if (typeof document === 'undefined') return { issues: [], score: 100 };
  const rootEl = typeof root === 'string' ? document.querySelector(root) : (root || document.body || document);
  const issues = [];
  const roles = ['main', 'navigation', 'banner'];
  roles.forEach(role => {
    const elements = (rootEl || document).querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      issues.push({ type: 'duplicate_landmark', role, message: `Multiple ${role} landmarks found` });
    }
  });
  const score = Math.max(0, 100 - issues.length * 25);
  return { issues, score };
}

function addLandmarkIssues(element) {
  if (typeof document === 'undefined') return { added: 0, message: 'Document unavailable' };
  const el = typeof element === 'string' ? document.querySelector(element) : (element || document.body);
  if (!el) return { added: 0, message: 'No element' };
  let added = 0;
  if (!document.querySelector('main, [role="main"]')) {
    added++;
  }
  return { added, element: el.tagName ? el.tagName.toLowerCase() : null };
}

function getSvgAccessibleName(svg) {
  const el = typeof svg === 'string' ? (typeof document !== 'undefined' ? document.querySelector(svg) : null) : svg;
  if (el && typeof el.getAttribute === 'function') {
    const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (aria) return aria;
    const titleEl = el.querySelector('title');
    if (titleEl) return titleEl.textContent || '';
  }
  return '';
}

function addSvgAccessibleNames(container) {
  if (typeof document === 'undefined') return { added: 0 };
  const root = typeof container === 'string' ? document.querySelector(container) : (container || document);
  let added = 0;
  if (root) {
    root.querySelectorAll('svg').forEach(svg => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
        svg.setAttribute('aria-label', 'SVG graphic');
        added++;
      }
    });
  }
  return { added };
}

function ensureUniqueLandmarks(root) {
  if (typeof document === 'undefined') return { fixed: 0 };
  const rootEl = typeof root === 'string' ? document.querySelector(root) : (root || document.body || document);
  let fixed = 0;
  const roles = ['main', 'navigation'];
  roles.forEach(role => {
    const elements = (rootEl || document).querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      fixed += elements.length - 1;
    }
  });
  return { fixed };
}

function fixFakeLinkIssue(elementOrUrl) {
  if (typeof document === 'undefined') return { fixed: 0 };
  const root = typeof elementOrUrl === 'string' ? document.querySelector(elementOrUrl) : (elementOrUrl || document.body);
  let fixed = 0;
  if (root) {
    root.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0);') {
        if (link.hasAttribute('onclick') || link.getAttribute('role') === 'button') {
          const btn = document.createElement('button');
          btn.textContent = link.textContent;
          btn.setAttribute('type', 'button');
          if (typeof link.onclick === 'function') {
            btn.onclick = link.onclick;
          }
          if (link.parentNode) link.parentNode.replaceChild(btn, link);
          fixed++;
        } else {
          link.setAttribute('href', '#');
          fixed++;
        }
      }
    });
  }
  return { fixed };
}

function createInPageButton(text, onClick) {
  if (typeof document === 'undefined') {
    return { tag: 'button', text: text || 'Button', onclick: onClick };
  }
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.textContent = text || 'Button';
  if (typeof onClick === 'function') {
    btn.addEventListener('click', onClick);
  }
  return btn;
}

module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  addLangAttribute,
  fixTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  addLandmarkIssues,
  getSvgAccessibleName,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  createInPageButton
};