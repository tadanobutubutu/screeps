/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"], body > *');
  const main = doc.createElement('main');
  main.className = 'main';

  if (primaryContent.parentNode) {
    primaryContent.parentNode.replaceChild(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Ensure landmark regions have unique labels
 * @param { Array } landmarks - Array of landmark elements
 * @returns { Array } Array of landmarks with unique labels
 */
function ensureUniqueLandmarks(landmarks) {
  const labelCount = {};
  
  landmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label') || 
                  landmark.getAttribute('aria-labelledby') ||
                  landmark.tagName.toLowerCase();
    
    if (labelCount[label]) {
      labelCount[label]++;
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${label} ${labelCount[label]}`);
      }
    } else {
      labelCount[label] = 1;
    }
  });
  
  return landmarks;
}

/**
 * Validate table accessibility
 * @param { Document } doc - The document object to operate on
 * @returns { Array } Array of accessibility issues found in tables
 */
function validateTableAccessibility(doc) {
  const issues = [];
  const tables = doc.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Check if table has a caption
    const caption = table.querySelector('caption');
    if (!caption) {
      issues.push({
        tableIndex: index,
        issue: 'Missing caption for table'
      });
    }
    
    // Check if this is a data table (not a layout table)
    const isLayoutTable = table.classList.contains('layout-table') || 
                          table.getAttribute('role') === 'presentation';
    
    if (!isLayoutTable) {
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push({
          tableIndex: index,
          issue: 'Data table missing header cells (th)'
        });
      }
      
      // Check for proper scope attributes on headers
      headers.forEach((header, hIndex) => {
        const scope = header.getAttribute('scope');
        if (!scope) {
          issues.push({
            tableIndex: index,
            headerIndex: hIndex,
            issue: 'Header missing scope attribute'
          });
        }
      });
    }
  });
  
  return issues;
}

/**
 * Add proper landmark regions to the document
 * @param { Document } doc - The document object to operate on
 */
function addProperLandmarkRegions(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer');
  return ensureUniqueLandmarks(Array.from(landmarks));
}

/**
 * Add ARIA attributes to form controls
 * @param { Document } doc - The document object to operate on
 */
function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = input.closest('label');
      if (label) {
        input.setAttribute('aria-label', label.textContent.trim());
      }
    }
  });
}

/**
 * Replace myButton with a unique ID
 * @param { Document } doc - The document object to operate on
 */
function replaceMyButtonId(doc) {
  const buttons = doc.querySelectorAll('[id="myButton"], .myButton');
  buttons.forEach((button, index) => {
    button.id = `myButton_${Date.now()}_${index}`;
  });
}

/**
 * Get the lang attribute from the document
 * @param { Document } doc - The document object to operate on
 * @returns { string } The language attribute value
 */
function getLangAttribute(doc) {
  return doc.documentElement.getAttribute('lang') || '';
}

/**
 * Get the full lang attribute including dialect
 * @param { Document } doc - The document object to operate on
 * @returns { string } The full language attribute value
 */
function getFullLangAttribute(doc) {
  const lang = getLangAttribute(doc);
  return lang;
}

/**
 * Validate landmark accessibility
 * @param { Document } doc - The document object to operate on
 * @returns { boolean } True if landmarks are valid
 */
function validateLandmark(doc) {
  const landmarks = doc.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  return landmarks.length > 0;
}

/**
 * Validate landmark structure
 * @param { Document } doc - The document object to operate on
 * @returns { boolean } True if landmark structure is valid
 */
function validateLandmarkStructure(doc) {
  const main = doc.querySelector('main, [role="main"]');
  return main !== null;
}

/**
 * Validate table structure
 * @param { Document } doc - The document object to operate on
 * @returns { boolean } True if table structure is valid
 */
function validateTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  return Array.from(tables).every(table => {
    const rows = table.querySelectorAll('tr');
    return rows.length > 0;
  });
}

/**
 * Get accessible name for SVG elements
 * @param { Element } svg - The SVG element
 * @returns { string } The accessible name
 */
function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const ariaLabel = svg.getAttribute('aria-label');
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledby) {
    const labelElement = svg.ownerDocument.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  if (title) return title.textContent;
  return '';
}

const { addMissingExportFunction } = require('./utils');

module.exports = {
  addProperLandmarkRegions,
  ensureUniqueLandmarks,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain,
  getSvgAccessibleName
};