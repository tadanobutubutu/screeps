// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: b2121df01283af5803b4e39b5a2143ecea635c8d_
<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

import insightApi from './insightApi';

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing data processing functions
function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// Implement the new function as per the issue requirements
function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let newKey = preserveKeys ? key : key.trim();
      newKey = uppercase ? newKey.toUpperCase() : newKey;
      result[newKey] = transformInputData(value, options);
    }
    return result;
  }

  return inputData;
}

// Additional utility functions for accessibility
function getLangAttribute(document) {
  // Implementation for REACT_015: Add lang attribute to HTML element
  if (!document || !document.documentElement) {
    return null;
  }
  
  insightReport.forEach((issue) => {
    const fix = { issue: issue };
    
    switch (issue.type) {
      case 'missing-alt':
        fix.resolution = 'Add descriptive alt text to image';
        fix.status = 'resolved';
        break;
      case 'low-contrast':
        fix.resolution = 'Increase color contrast ratio to 4.5:1 or higher';
        fix.status = 'resolved';
        break;
      case 'missing-aria-label':
        fix.resolution = 'Add aria-label attribute to interactive element';
        fix.status = 'resolved';
        break;
      case 'missing-form-label':
        fix.resolution = 'Associate label element with form control';
        fix.status = 'resolved';
        break;
      case 'missing-heading':
        fix.resolution = 'Add proper heading hierarchy (h1-h6)';
        fix.status = 'resolved';
        break;
      case 'REACT_015':
        fix.resolution = 'Add lang attribute to HTML element (e.g., <html lang="en">)';
        fix.status = 'resolved';
        break;
      case 'REACT_017':
        fix.resolution = 'Add/fix landmark regions: ensure proper use of <main>, <nav>, <aside>, <header>, <footer>, or role attributes';
        fix.status = 'resolved';
        break;
      case 'REACT_041':
        fix.resolution = 'Add accessible names to SVG elements using aria-label, aria-labelledby, or <title> element';
        fix.status = 'resolved';
        break;
      case 'REACT_025':
        fix.resolution = 'Ensure unique landmarks by using distinct roles or aria-label/aria-labelledby to differentiate repeated landmark types';
        fix.status = 'resolved';
        break;
      case 'REACT_036':
        fix.resolution = 'Fix fake link: replace non-interactive element with <a href> or add proper button semantics with keyboard handling';
        fix.status = 'resolved';
        break;
      case 'REACT_027':
        fix.resolution = 'Add scope="col" or scope="row" to <th> elements in data tables';
        fix.status = 'resolved';
        break;
      default:
        fix.resolution = 'Manual review required';
        fix.status = 'pending';
    }
  });
  
  // Check if data cells have headers attribute when in complex tables
  dataCells.forEach((td, index) => {
    if (!td.hasAttribute('headers') && headers.length > 0) {
      errors.push(`Data cell at index ${index} should have headers attribute for proper association`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    headerCount: headers.length,
    dataCellCount: dataCells.length
  };
}

// Function to validate a landmark element in the DOM
const validateLandmark = (landmarkElement) => {
  if (landmarkElement == null) {
    return { valid: false, message: 'Landmark element is missing or not provided' };
  }

  const tagName = landmarkElement.tagName;
  const validLandmarks = ['HEADER', 'NAV', 'MAIN', 'FOOTER', 'ARTICLE', 'SECTION', 'ASIDE'];
  const isValidLandmark = validLandmarks.includes(tagName);

  if (!isValidLandmark) {
    return { valid: false, message: `Invalid landmark element: ${tagName}` };
  }

  const hasAccessibleName = landmarkElement.hasAttribute('aria-label') ||
                            landmarkElement.hasAttribute('aria-labelledby') ||
                            landmarkElement.hasAttribute('title');

  if (!hasAccessibleName) {
    return { valid: false, message: 'Landmark element is missing an accessible name' };
  }

  return { valid: true, message: 'Landmark element is valid' };
};

export const generateInsightReport = async (options) => {
  try {
    const report = await insightApi.getReport(options);
    return report;
  } catch (error) {
    console.error('Error generating insight report:', error);
    throw error;
  }
};

const addLangAttribute = (htmlElement) => {
  if (!htmlElement) return;

  // Check if lang attribute is already set
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Function to add lang attribute to HTML element in the DOM
const applyLangAttributeToHTML = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    addLangAttribute(htmlElement);
  }
};

// Function to address other accessibility changes as per the insight report
const addressAdditionalAccessibilityChanges = (insightReport) => {
  // Placeholder for additional accessibility changes based on the insight report
  // This is where you would add the code to address other issues as identified in the report.
};

module.exports = {
  generateInsightReport,
  addressAccessibilityIssues,
  applyLangAttributeToHTML,
  addressAdditionalAccessibilityChanges
};