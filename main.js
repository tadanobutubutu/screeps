// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/tableAccessibilityUtils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings

// Validate that tables in the document are accessible
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );

    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });

  return results;
}

// Validate the structure of tables in the document
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];

  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;

    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);

      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }

    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });

  return results;
}

// Generate accessibility report
function generateAccessibilityReport() {
  const timestamp = new Date().toISOString();
  const tableAccessibilityResults = validateTableAccessibility();
  const tableStructureResults = validateTableStructure();

  const totalTables = tableAccessibilityResults.length;
  const accessibleTables = tableAccessibilityResults.filter(r => r.isAccessible).length;
  const validStructures = tableStructureResults.filter(r => r.isValid).length;

  const issues = [];

  tableAccessibilityResults.forEach((result, index) => {
    if (!result.isAccessible) {
      const issue = { tableIndex: index, type: 'accessibility' };
      if (!result.hasCaption) issue.reason = 'Missing caption';
      else if (!result.hasHeaders) issue.reason = 'Missing header cells';
      else if (!result.hasScope) issue.reason = 'Headers missing scope attribute';
      issues.push(issue);
    }
  });

  tableStructureResults.forEach((result, index) => {
    if (!result.isValid && result.error) {
      issues.push({ tableIndex: index, type: 'structure', reason: result.error });
    }
  });

  return {
    timestamp,
    summary: {
      totalTables,
      accessibleTables,
      validStructures,
      accessibilityScore: totalTables > 0 ? (accessibleTables / totalTables) * 100 : 100,
      structureScore: totalTables > 0 ? (validStructures / totalTables) * 100 : 100
    },
    issues,
    tableAccessibility: tableAccessibilityResults,
    tableStructure: tableStructureResults
  };
}

// Export existing functionality and new functions
export {
  initialize,
  getConfig,
  getVersion,
  setupSkipLinks,
  setupButtonAccessibility,
  createInPageButton,
  performTask,
  handleEvent,
  greet,
  add,
  calculateDiscount,
  newFunction,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  initApp,
  rotateBack,
  helloWorld,
  addLandmarkRoles,
  setLanguageAttribute,
  addSVGAccessibleName,
  fixFakeLinks,
  initDependencyGraph,
  renderDependencyGraph,
  getElementById,
  queryElements,
  checkLandmarkElements,
  validateLandmarkStructure,
  ensureThScope,
  addSvgAccessibleNames,
  fixFakeLink,
  initializeAccessibility,
  VERSION,
  CONFIG,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport,
  createUnrotateButton
};

// Add back any required exports that might have been missing
export {
  createUnrotateButton,
  ensureThScope,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLink,
  initializeAccessibility
};

// Add the new function to the default export
export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport
};

// Compatibility for CommonJS if needed (as per HEAD)
if (typeof module !== 'undefined' && module.exports) {
  module.exports.newFunction = newFunction;
}

module.exports = main;
module.exports.default = main;

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}