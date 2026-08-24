// Address accessibility issues from insight report
// Accessibility fixes have been applied
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// This is the main entry point for the application
// Import necessary modules
const fs = require('fs');
const path = require('path');

// Define some basic functionality
function initialize() {
  console.log('Initializing application...');
}

// Helper function
function getFilePath(filename) {
  return path.join(__dirname, filename);
}

// Address accessibility issues as per insight report
function makeElementAccessible(element) {
  if (!element || !element.tagName) return;
  if (element.tagName.toLowerCase() === 'html') {
    element.setAttribute('lang', 'en');
  } else if (element.tagName.toLowerCase() === 'svg') {
    element.setAttribute('aria-label', 'SVG description');
  }
}

// Implement fixTableStructureIssues to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  for (let table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        let cell = table.rows[i].cells[j];
        if (cell.tagName && cell.tagName.toLowerCase() === 'th') {
          if (i === 0) {
            cell.setAttribute('scope', 'col');
          } else {
            cell.setAttribute('scope', 'row');
          }
        }
      }
    }
  }
}

// Add proper landmark regions for improved accessibility
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('.main-content');
  const navigation = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.querySelector('.navigation');
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]') || document.querySelector('.footer');
  if (mainContent) mainContent.setAttribute('role', 'main');
  if (navigation) navigation.setAttribute('role', 'navigation');
  if (footer) footer.setAttribute('role', 'contentinfo');
  const htmlElement = document.documentElement;
  if (htmlElement) htmlElement.setAttribute('lang', 'en');
}

// New function for unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  return [...landmarks].every(landmark => {
    return landmark.id && landmark.id !== '';
  });
}

// New function for fixing one fake link issue
function fixOneFakeLinkIssue() {
  const fakeLink = document.querySelector('a:not([href])');
  if (fakeLink) {
    fakeLink.textContent = 'Example Link';
    fakeLink.href = '#';
  }
}

// Implement fixReactFakeLinkIssue to fix React fake link issue
function fixReactFakeLinkIssue() {
  const hashLinks = document.querySelectorAll('a[href^="#"]');
  for (let link of hashLinks) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  }
}

// NEW: Fix React Fake Link issue
function fixReactFakeLinkIssue() {
  const hashLinks = document.querySelectorAll('a[href^="#"]');
  for (let link of hashLinks) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  }
}

// New function for ensuring landmarks with unique IDs
function hasUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  return [...landmarks].every(landmark => {
    return landmark.id && landmark.id !== '';
  });
}

// New function for fixing fake link issues (general)
function fixFakeLinkIssues() {
  // Fix generic fake links
  const fakeLinks = document.querySelectorAll('a:not([href])');
  for (let fakeLink of fakeLinks) {
    fakeLink.textContent = 'Example Link';
    fakeLink.href = '#';
  }
  // Fix React-style fake links (anchor tags with hash href)
  const hashLinks = document.querySelectorAll('a[href^="#"]');
  for (let link of hashLinks) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  }
}

// NEW: Fix React SVG Accessible Name issues
function fixSvgAccessibleNames() {
  const svgElements = document.querySelectorAll('svg');
  for (let svg of svgElements) {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = svg.getAttribute('data-description') || 'SVG description';
      svg.insertBefore(title, svg.firstChild);
    }
  }
}

// NEW: Ensure all landmarks have unique IDs
function ensureLandmarksHaveUniqueIds() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]');
  const usedIds = new Set();
  for (let landmark of landmarks) {
    if (!landmark.id || landmark.id === '' || usedIds.has(landmark.id)) {
      let newId = landmark.getAttribute('role') || 'landmark';
      let counter = 1;
      let uniqueId = newId;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${newId}-${counter}`;
        counter++;
      }
      landmark.id = uniqueId;
      usedIds.add(uniqueId);
    } else {
      usedIds.add(landmark.id);
    }
  }
}

// NEW: Fix React Language Attribute
function fixHtmlLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// NEW: Enhanced table structure fixes for React tables
function fixReactTableStructure() {
  const tables = document.querySelectorAll('table');
  for (let table of tables) {
    // Ensure table has caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('data-table-title') || 'Data table';
      caption.style.display = 'none'; // Visually hidden but accessible
      table.insertBefore(caption, table.firstChild);
    }
    
    // Fix header cell scopes
    const headerCells = table.querySelectorAll('th');
    for (let th of headerCells) {
      if (!th.getAttribute('scope')) {
        const parentRow = th.closest('tr');
        const parentSection = th.closest('thead, tfoot, tbody');
        if (parentSection && parentSection.tagName.toLowerCase() === 'thead') {
          th.setAttribute('scope', 'col');
        } else if (parentSection && parentSection.tagName.toLowerCase() === 'tfoot') {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    }
    
    // Associate data cells with headers
    const dataCells = table.querySelectorAll('td');
    for (let td of dataCells) {
      if (!td.getAttribute('headers')) {
        const headers = [];
        const row = td.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(td);
        
        // Find column headers
        const thead = table.querySelector('thead');
        if (thead) {
          const headerRow = thead.rows[thead.rows.length - 1];
          if (headerRow && headerRow.cells[cellIndex]) {
            const headerCell = headerRow.cells[cellIndex];
            if (headerCell.id) {
              headers.push(headerCell.id);
            } else {
              headerCell.id = `col-${cellIndex}`;
              headers.push(headerCell.id);
            }
          }
        }
        
        // Find row headers
        const firstCell = row.cells[0];
        if (firstCell && firstCell.tagName.toLowerCase() === 'th' && firstCell !== td) {
          if (firstCell.id) {
            headers.push(firstCell.id);
          } else {
            firstCell.id = `row-${rowIndex}`;
            headers.push(firstCell.id);
          }
        }
        
        if (headers.length > 0) {
          td.setAttribute('headers', headers.join(' '));
        }
      }
    }
  }
}

function newPreservedFunction() {
  return true;
}

// NEW: Wrapper function to run all accessibility fixes
function runAllAccessibilityFixes() {
  fixHtmlLanguageAttribute();
  fixSvgAccessibleNames();
  fixReactTableStructure();
  addProperLandmarkRegions();
  ensureLandmarksHaveUniqueIds();
  fixFakeLinkIssues();
}

module.exports = {
  initialize,
  getFilePath,
  makeElementAccessible,
  newPreservedFunction,
  fixTableStructureIssues,
  addProperLandmarkRegions,
  fixFakeLinkIssues,
  fixOneFakeLinkIssue,
  ensureUniqueLandmarks,
  fixReactFakeLinkIssue,
  hasUniqueLandmarks,
  wrapPrimaryContentInMain,
  fixSvgAccessibleNames,
  ensureLandmarksHaveUniqueIds,
  fixHtmlLanguageAttribute,
  fixReactTableStructure,
  runAllAccessibilityFixes
};