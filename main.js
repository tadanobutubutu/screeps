// Import required module(s) - for fixing table structure issues and SVG accessibility issues
import './table-styles.css';

// main.js - Entry point for the application

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
// Update or create the affected functions to be accessible
// Address additional accessibility issues by fixing table structure issues

function ensureUniqueLandmarks(landmarks, prefix = 'landmark') {
  if (!landmarks || !Array.isArray(landmarks)) {
    throw new Error('Landmarks array is required');
  }

  const ids = [];
  const usedIds = new Set();

  landmarks.forEach((landmark, index) => {
    if (!landmark) {
      return;
    }

    if (landmark.id) {
      if (usedIds.has(landmark.id)) {
        const newId = `${prefix}-${index}`;
        landmark.id = newId;
        usedIds.add(newId);
        ids.push(newId);
      } else {
        usedIds.add(landmark.id);
        ids.push(landmark.id);
      }
    } else {
      let generatedId = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
      while (usedIds.has(generatedId)) {
        generatedId = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
      }
      landmark.id = generatedId;
      usedIds.add(generatedId);
      ids.push(generatedId);
    }
  });

  return ids;
}

function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode || 'en');
  }
}

export function anotherFunction() {
  // More existing functionality
}

function addAriaLabelToDependencyGraph(container) {
  const container = document.getElementById('dependencyGraph');
  addAriaLabel(container, 'Dependency Graph');
}

function checkTablesAccessibility(tables) {
  tables.forEach((table) => {
    // Check for proper table structure
    if (!table.querySelector('thead') && table.querySelectorAll('th').length > 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const wrapper = document.createElement('thead');
        firstRow.parentNode.insertBefore(wrapper, firstRow);
        wrapper.appendChild(firstRow);
      }
    }
    
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const headerRow = table.querySelector('thead tr');
      const bodyRows = headerRow ? rows.slice(1) : rows;
      
      if (bodyRows.length > 0) {
        const tbody = document.createElement('tbody');
        bodyRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
  });
}

function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const body = document.body;
    if (body) {
      // Wrap content in main element
      body.insertBefore(mainElement, body.firstChild);
    }
  }
  return mainElement;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Merge the changes from both branches
  });
}

function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first <main> and convert others to <section> or <div>
    for (let i = 1; i < mainElements.length; i++) {
      const section = document.createElement('section');
      while (mainElements[i].firstChild) {
        section.appendChild(mainElements[i].firstChild);
      }
      mainElements[i].parentNode.replaceChild(section, mainElements[i]);
    }
  }
}

function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('.fake-link, [data-fake-link]');
  fakeLinks.forEach((fakeLink) => {
    // Preserve existing functionality
  });
}

function addSvgAccessibilityProps(svgElement, options = {}) {
  if (!svgElement) {
    return;
  }

  const { label, role = 'img' } = options;

  // Ensure SVG has a role for accessibility
  if (role) {
    svgElement.setAttribute('role', role);
  }

  // Set aria-label if a label is provided
  if (label) {
    svgElement.setAttribute('aria-label', label);
  }

  // Make SVG focusable for keyboard navigation
  svgElement.setAttribute('focusable', 'false');

  return svgElement;
}

function enhanceSVGsAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    // Skip if already has accessibility attributes
    const hasRole = svg.hasAttribute('role');
    const hasAriaLabel = svg.hasAttribute('aria-label') || svg.hasAttribute('aria-labelledby') || svg.hasAttribute('aria-describedby');
    const hasDescriptiveChild = svg.querySelector('title, desc');

    if (!hasRole && !hasAriaLabel && !hasDescriptiveChild) {
      // Add default accessibility props to bare SVGs
      addSvgAccessibilityProps(svg, { label: 'Decorative image' });
    }
  });
}

function setupAccessibility() {
  // Add lang attribute with default English
  setLanguageAttribute();

  // Ensure skip links work properly
  const skipLink = document.querySelector('.skip-link, [data-skip-link]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href')?.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.tabIndex = -1;
        target.focus();
      }
    });
  }

  // Enhance SVG accessibility for all SVGs on the page
  enhanceSVGsAccessibility();
}

let internalFunction1 = (arg1, arg2) => {
  // Implementation of the new function (adjust as necessary)
};

let internalFunction2 = () => {
  // Implementation of the new function (adjust as necessary)
};

function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

// Assuming main.js has a <html> tag, add the lang attribute based on your content
function setLanguageAttribute(languageCode) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', languageCode || 'en');
  }
}

// Table accessibility check function - addresses the TODO on line 17
function checkTableAccessibilityIssues() {
  const tables = document.querySelectorAll('table');
  const issues = [];

  tables.forEach((table, index) => {
    const tableIssues = [];

    // Check if table has a caption
    const caption = table.querySelector('caption');
    if (!caption) {
      tableIssues.push({
        type: 'missing-caption',
        message: 'Table is missing a caption element',
        severity: 'warning'
      });
    }

    // Check if table headers have proper scope attributes
    const headers = table.querySelectorAll('th');
    headers.forEach((header, headerIndex) => {
      if (!header.hasAttribute('scope')) {
        tableIssues.push({
          type: 'missing-scope',
          message: `Header at index ${headerIndex} is missing scope attribute`,
          severity: 'warning'
        });
      }
    });

    // Check if table has thead
    const thead = table.querySelector('thead');
    if (headers.length > 0 && !thead) {
      tableIssues.push({
        type: 'missing-thead',
        message: 'Table with headers is missing thead element',
        severity: 'warning'
      });
    }

    // Check if table has tbody
    const tbody = table.querySelector('tbody');
    const dataRows = table.querySelectorAll('tr');
    if (!tbody && dataRows.length > 0) {
      tableIssues.push({
        type: 'missing-tbody',
        message: 'Table is missing tbody element',
        severity: 'info'
      });
    }

    // Check for proper table role
    if (!table.hasAttribute('role') && !table.tagName.toLowerCase() === 'table') {
      tableIssues.push({
        type: 'missing-role',
        message: 'Table should have a proper role attribute for screen readers',
        severity: 'info'
      });
    }

    // Check for complex tables with proper id headers associations
    const headerCells = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    if (headerCells.length > 0 && dataCells.length > 0) {
      // Check if headers have unique ids for complex tables
      const headerIds = new Set();
      headerCells.forEach((th) => {
        if (th.id) {
          if (headerIds.has(th.id)) {
            tableIssues.push({
              type: 'duplicate-header-id',
              message: `Header id "${th.id}" is not unique`,
              severity: 'error'
            });
          }
          headerIds.add(th.id);
        }
      });

      // Check if data cells properly reference header ids
      dataCells.forEach((td) => {
        const headersAttr = td.getAttribute('headers');
        if (headersAttr) {
          const headerIdList = headersAttr.split(' ');
          headerIdList.forEach((headerId) => {
            if (!headerIds.has(headerId)) {
              tableIssues.push({
                type: 'invalid-header-reference',
                message: `Data cell references non-existent header id "${headerId}"`,
                severity: 'error'
              });
            }
          });
        }
      });
    }

    if (tableIssues.length > 0) {
      issues.push({
        tableIndex: index,
        tableElement: table,
        issues: tableIssues
      });
    }
  });

  return issues;
}

// Fix table accessibility issues
function fixTableAccessibilityIssues() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      caption.style.captionSide = 'top';
      if (table.firstChild) {
        table.insertBefore(caption, table.firstChild);
      } else {
        table