import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Create a hidden live region for dynamic announcements
  const announcementId = 'accessibility-announcement';
  let announcement = document.getElementById(announcementId);
  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = announcementId;
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    // Hide off-screen
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.style.top = '-9999px';
    document.body.appendChild(announcement);
  }
}

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
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('th, td').length);
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

// Validate landmark elements in the document
function validateLandmark() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  const landmarkElements = document.querySelectorAll('[role], header, nav, main, aside, footer, form, [role="search"]');
  const results = [];
  
  landmarkElements.forEach((element, index) => {
    const role = element.getAttribute('role') || getImplicitRole(element);
    const isLandmark = landmarkRoles.includes(role);
    
    let isValid = true;
    let error = null;
    
    if (isLandmark) {
      if (role === 'main') {
        const mainCount = document.querySelectorAll('[role="main"], main').length;
        if (mainCount > 1) {
          isValid = false;
          error = 'Multiple main landmarks found';
        }
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          if (!element.querySelector('h1, h2, h3, h4, h5, h6, [aria-label], [aria-labelledby]')) {
            // Only flag if no heading or label exists
          }
        }
      }
      
      if (role === 'navigation') {
        const navCount = document.querySelectorAll('[role="navigation"], nav').length;
        if (navCount > 1 && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          isValid = false;
          error = 'Multiple navigation landmarks without aria-label';
        }
      }
      
      if (role === 'banner' || role === 'contentinfo') {
        const count = document.querySelectorAll(`[role="${role}"]`).length;
        if (count > 1) {
          isValid = false;
          error = `Multiple ${role} landmarks found`;
        }
      }
    }
    
    results.push({
      elementIndex: index,
      role,
      isLandmark,
      isValid,
      error,
      tagName: element.tagName.toLowerCase()
    });
  });
  
  return results;
}

function getImplicitRole(element) {
  const tagName = element.tagName.toLowerCase();
  const implicitRoles = {
    'header': 'banner',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'form': 'form',
    'section': 'region'
  };
  return implicitRoles[tagName] || null;
}

// Generate accessibility report
function generateAccessibilityReport() {
  const timestamp = new Date().toISOString();
  const tableAccessibilityResults = validateTableAccessibility();
  const tableStructureResults = validateTableStructure();
  const landmarkResults = validateLandmark();
  
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
  
  landmarkResults.forEach((result, index) => {
    if (!result.isValid && result.error) {
      issues.push({ elementIndex: index, type: 'landmark', reason: result.error });
    }
  });
  
  return {
    timestamp,
    summary: {
      totalTables,
      accessibleTables,
      validStructures,
      accessibilityScore: totalTables > 0 ? Math.round((accessibleTables / totalTables) * 100) : 100,
      structureScore: totalTables > 0 ? Math.round((validStructures / totalTables) * 100) : 100
    },
    issues,
    tableAccessibility: tableAccessibilityResults,
    tableStructure: tableStructureResults,
    landmarkResults
  };
}

// Export the new function
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  generateAccessibilityReport
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
  validateLandmark,
  generateAccessibilityReport
};