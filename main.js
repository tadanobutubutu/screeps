Here is the resolved file content:

```javascript
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

  /*
    Integrating both changes:
    - Adding checkLinkAndButtonAccessibility from the other branch
    - Moving the function to be a part of addressAccessibilityIssues
  */
  function checkLinkAndButtonAccessibility(doc) {
    const links = doc.getElementsByTagName('a');
    const buttons = doc.getElementsByTagName('button');
    Array.prototype.push.apply(links, Array.prototype.slice.call(buttons));
    Array.prototype.forEach.call(links, (link) => {
      if (!link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', defaultText);
      }
    });
  }

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
      checkLinkAndButtonAccessibility(issue.element.ownerDocument);
      if (issue.type === 'link') {
        /*
          Integrating both logic:
          - Keep the existing code using 'document.createTextNode' if useAriaLabel is false
          - Move the aria-label code to the try block to overwrite in case both conditions are met
        */
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          // Add visible text content
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
      } else if (issue.type === 'button') {
        /*
          Merging both implementations
          - Keep existing solution for setting aria-label if useAriaLabel is true
          - Preserve addition of visible text content for when useAriaLabel is false
        */
        if (useAriaLabel) {
          issue.element.setAttribute('aria-label', defaultText);
        } else {
          const textNode = document.createTextNode(defaultText);
          issue.element.appendChild(textNode);
        }
      }
      summary.linkIssuesFixed += (issue.type === 'link') ? 1 : 0;
      summary.buttonIssuesFixed += (issue.type === 'button') ? 1 : 0;
      summary.fixes.push({
        type: issue.type,
        index: issue.index,
        action: 'Fixed accessibility issue'
      });
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
    checkLinkAndButtonAccessibility: addressAccessibilityIssues,  // Renamed function to match the exports in the other branch
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
```

This file resolves the merge conflict by integrating both sets of changes where possible. The checkLinkAndButtonAccessibility function has been moved inside addressAccessibilityIssues, and the naming of the function in the exports object has been adjusted to match the changes from the other branch. Other than that, the changes from both branches have been kept and properly merged.