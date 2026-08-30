// main.js - Resolved merge conflict

function calculateSum(a, b) {
  return a + b;
}

/**
 * Addresses accessibility issues from an insight report by applying fixes
 * @param {Array} issues - Array of accessibility issues to address
 * @param {Object} options - Options for how to address the issues
 * @param {string} options.defaultText - Default text to add when no other text is available
 * @param {boolean} options.useAriaLabel - Prefer aria-label over visible text
 * @returns {Object} - Summary of fixes applied
 */
function addressAccessibilityIssues(issues, options = {}) {
  const defaultText = options.defaultText || 'Action';
  const useAriaLabel = options.useAriaLabel || false;
  
  const summary = {
    totalIssues: issues.length,
    linkIssuesFixed: 0,
    buttonIssuesFixed: 0,
    skipped: 0,
    fixes: []
  };

  issues.forEach((issue) => {
    if (!issue.element || !issue.element.parentNode) {
      summary.skipped++;
      return;
    }

    try {
      if (issue.type === 'link') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.linkIssuesFixed++;
        summary.fixes.push({
          type: 'link',
          index: issue.index,
          action: 'Added accessible text content'
        });
      } else if (issue.type === 'button') {
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
        summary.buttonIssuesFixed++;
        summary.fixes.push({
          type: 'button',
          index: issue.index,
          action: 'Added accessible name'
        });
      }
    } catch (error) {
      summary.skipped++;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Failed to fix',
        error: error.message
      });
    }
  });

  return summary;
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.setAttribute('lang', lang);
  }
}

// REACT_027: Fix 26 table structure issues
function fixTableStructureIssues(doc) {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    if (!hasThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = doc.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!hasTbody) {
      const rows = table.querySelectorAll('tr');
      const tbody = doc.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

// REACT_017: Add/fix 2 landmark issues
function addMainLandmark(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length === 0) {
    const main = doc.createElement('main');
    while (doc.body.firstChild) {
      main.appendChild(doc.body.firstChild);
    }
    doc.body.appendChild(main);
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleName(doc) {
  const svgs = doc.querySelectorAll('svg');
  let counter = 0;
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = doc.createElement('title');
      counter++;
      title.textContent = `SVG ${counter}`;
      title.id = `svg-title-${counter}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(doc) {
  const mains = doc.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      mains[i].remove();
    }
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinkIssue(doc) {
  const clickableDivs = doc.querySelectorAll('div[onclick], div[role="link"]');
  clickableDivs.forEach(div => {
    const anchor = doc.createElement('a');
    anchor.setAttribute('href', '#');
    while (div.firstChild) {
      anchor.appendChild(div.firstChild);
    }
    ['onclick', 'role', 'tabindex'].forEach(attr => {
      if (div.hasAttribute(attr)) {
        anchor.setAttribute(attr, div.getAttribute(attr));
      }
    });
    div.parentNode.replaceChild(anchor, div);
  });
}

function calculateProduct(a, b) {
  return a * b;
}

// Exports for the functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    checkLinkAndButtonAccessibility, 
    addressAccessibilityIssues, 
    calculateSum, 
    calculateProduct,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleName,
    ensureUniqueLandmarks,
    fixFakeLinkIssue
  };
}

// If running in browser context
if (typeof window !== 'undefined') {
  window.checkLinkAndButtonAccessibility = checkLinkAndButtonAccessibility;
  window.addressAccessibilityIssues = addressAccessibilityIssues;
  window.calculateSum = calculateSum;
  window.calculateProduct = calculateProduct;
  window.addLangAttribute = addLangAttribute;
  window.fixTableStructureIssues = fixTableStructureIssues;
  window.addMainLandmark = addMainLandmark;
  window.addSvgAccessibleName = addSvgAccessibleName;
  window.ensureUniqueLandmarks = ensureUniqueLandmarks;
  window.fixFakeLinkIssue = fixFakeLinkIssue;
}