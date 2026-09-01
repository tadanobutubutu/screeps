// Existing code and exports

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// New function to handle REACT_015 (Add lang attribute to HTML element)
function getLangAttribute() {
  // Default to English, but could be made configurable
  return 'en';
}

// New function to add lang attribute
function addLangAttribute(element) {
  element.setAttribute('lang', getLangAttribute());
}

// Process and filter landmarks
function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

// Sort landmarks by name
function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

// Get landmark by ID
function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Ensure unique landmarks by ID
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

// Load landmarks from data file
function loadLandmarks() {
    try {
        const dataFile = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
    }
    return [];
}

// Function to write the generated report to a file (for accessibility issues)
function writeAccessibilityReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Analyze accessibility of a given URL using axe-core
async function scanAccessibility(url) {
  const options = {
    elementsOnly: true,
    // ...other axe-core options if needed...
  };
  const axeInstance = axe.createInstance(options);
  const results = await axeInstance.analyze(url);
  const formattedResults = formatAccessibilityReport(results);
  return formattedResults;
}

// Format accessibility report from axe-core's results
function formatAccessibilityReport(results) {
  const violations = results.violations.map(violation => ({
    id: violation.id,
    help: violation.help,
    nodes: violation.nodes
        .map(node => ({
          line: node.lineNumber,
          column: node.columnNumber,
          attribute: node.ancestors.attr,
          tag: node.ancestors.tagName
        })),
    rule: {
      id: violation.rules.id,
      help: violation.rules.help
    }
  }));

  return { violations };
}

// TODO: Implement function for generating a report based on accessibility issues
function generateAccessibilityReport() {
  const url = 'YOUR_WEBSITE_URL'; // Replace with the URL to be scanned
  return scanAccessibility(url)
    .then(report => {
      writeAccessibilityReport(report);
      return report;
    })
    .catch(error => {
      console.error('Error running accessibility scan:', error.message);
    });
}

// New function to ensure elements have an id
function ensureElementId(element) {
  if (!element || typeof element.id !== 'string' || element.id.trim() === '') {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// New function to add aria-label to elements
function addAriaLabel(element, label) {
  if (!element || typeof element.setAttribute !== 'function') {
    return;
  }
  element.setAttribute('aria-label', label);
}

// New function to render dependency graphs
function renderDependencyGraph(landmarks) {
  // Placeholder for rendering logic
  console.log('Rendering dependency graphs for landmarks...');
}

// New function to fix table structure issues (REACT_027)
function fixTableStructure(tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') return;

  // Ensure table has proper structure with thead, tbody, and tfoot if needed
  if (!tableElement.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tableElement.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(tableElement.querySelectorAll('tr:not(:first-child)'));
    rows.forEach(row => tbody.appendChild(row));
    tableElement.appendChild(tbody);
  }

  // Add scope attributes to headers if missing
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// New function to add main landmark (REACT_017)
function addMainLandmark() {
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    const main = document.createElement('main');
    main.id = 'main-content';
    document.body.prepend(main);
    return main;
  }
  return mainElement;
}

// New function to add accessible names to SVGs (REACT_041)
function addSvgAccessibleNames(svgElement, name) {
  if (!svgElement || svgElement.tagName !== 'svg') return;

  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', name || 'Interactive graphic');
  }

  // Ensure SVG has a title element for screen readers
  if (!svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = name || 'Interactive graphic';
    svgElement.prepend(title);
  }
}

// New function to fix fake link issue (REACT_036)
function fixFakeLinkIssue(element) {
  if (!element || element.tagName !== 'A') return;

  // If element looks like a link but doesn't have href, make it a button
  if (!element.hasAttribute('href') || element.getAttribute('href') === '#') {
    const button = document.createElement('button');
    // Copy attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    // Copy content
    button.innerHTML = element.innerHTML;
    // Replace in DOM
    element.parentNode.replaceChild(button, element);
    return button;
  }
  return element;
}

// Update the main execution to use the new functions
if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    sorted.forEach(landmark => {
      ensureElementId(landmark);
      addAriaLabel(landmark, 'Description of landmark');
    });
    renderDependencyGraph(sorted);

    console.log('First landmark with id and aria-label:', sorted[0]);
  }
}

// Existing utility function (preserved)
const formatResponse = (data) => {
  return JSON.stringify(data, null, 2);
};

// Import required modules and export the new necessary function(s) here in main.js (preserving the original code)
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Export new necessary functions
module.exports = {
  validateInput,
  processData,
  formatResponse,
  config: CONFIG,
  // landmark functions
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  // accessibility functions
  generateAccessibilityReport,
  scanAccessibility,
  formatAccessibilityReport,
  writeAccessibilityReport,
  // i18n/accessibility functions
  getLangAttribute,
  addLangAttribute,
  // newly added functions
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  // accessibility fixes
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};