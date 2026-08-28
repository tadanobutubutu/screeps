/**
 * Check table structure in the document
 * @param { Document } doc - The document object to operate on
 * @returns { Array } - Array of table structure validation results
 */
function validateTableStructure(doc) {
  const tables = doc.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    
    results.push({
      index,
      hasThead,
      hasTbody,
      headerCount: headers.length,
      rowCount: rows.length
    });
  });
  
  return results;
}

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"]');
  const main = doc.createElement('div');
  main.className = 'main';

  if (primaryContent && primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Validate table accessibility
 * @param { Document } doc - The document object to operate on
 * @returns { Array } - Array of accessibility validation results
 */
function validateTableAccessibility(doc) {
  const tables = doc.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;
    
    results.push({
      index,
      hasCaption,
      hasHeaders
    });
  });
  
  return results;
}

function addProperLandmarkRegions(doc) {
  const landmarks = doc.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  return landmarks;
}

function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const id = landmark.id || landmark.getAttribute('role');
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
}

function addAriaToFormControls(doc) {
  const inputs = doc.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach(input => {
    if (input.type === 'text' || input.type === 'email' || input.type === 'password') {
      const label = input.closest('label') || doc.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-label', label.textContent.trim());
      }
    }
  });
}

function replaceMyButtonId(doc) {
  const buttons = doc.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (button.textContent.includes('My Button')) {
      button.id = `my-button-${index}`;
    }
  });
}

function getLangAttribute(doc) {
  return doc.documentElement.getAttribute('lang');
}

function getFullLangAttribute(doc) {
  const lang = doc.documentElement.getAttribute('lang');
  return lang ? lang : 'en';
}

function validateLandmark(landmark) {
  const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const role = landmark.getAttribute('role');
  return validRoles.includes(role);
}

function validateLandmarkStructure(doc) {
  const landmarks = doc.querySelectorAll('[role]');
  return Array.from(landmarks).filter(validateLandmark);
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  return {
    title: title ? title.textContent : null,
    desc: desc ? desc.textContent : null
  };
}

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = { addMissingExportFunction: () => {} };

module.exports = {
  addProperLandmarkRegions,
  validateTableStructure,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  getSvgAccessibleName
};