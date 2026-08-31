import './styles.css';

import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Testing the checkLandmarkElement function:
// To test this function, we could create a test file with the following content:
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * REACT_015: Add lang attribute to HTML element
 * Sets the language attribute on the HTML element.
 */
function setLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Generates a report based on accessibility issues found in the page.
 * Uses axe-core to scan the document and generates a structured report.
 * @param {Object} options - Optional configuration for the scan.
 * @param {string[]} options.tags - Tags to filter results (e.g., ['wcag2a', 'wcag2aa']).
 * @param {string[]} options.runOnly - Limit Axe to only run specified tags or rules.
 * @returns {Promise<Object>} Resolves with the accessibility report.
 */
async function generateAccessibilityReport(options = {}) {
  const report = {
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    issues: [],
    summary: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      total: 0
    }
  };

  // Check if axe-core is available
  if (typeof axe === 'undefined') {
    console.warn('axe-core is not loaded. Accessibility scanning unavailable.');
    return report;
  }

  try {
    // Configure axe-core options
    const axeOptions = {};
    if (options.tags && options.tags.length > 0) {
      axeOptions.runOnly = {
        type: 'tag',
        values: options.tags
      };
    }
    if (options.runOnly && options.runOnly.length > 0) {
      axeOptions.runOnly = {
        type: 'rule',
        values: options.runOnly
      };
    }

    // Run axe-core analysis on the entire document
    const results = await axe.run(document.body, axeOptions);

    // Process violations by impact level
    if (results && results.violations) {
      results.violations.forEach(violation => {
        const impact = violation.impact || 'unknown';
        if (report.summary.hasOwnProperty(impact)) {
          report.summary[impact]++;
        }
        report.summary.total++;

        // Add each violation to issues array
        violation.nodes.forEach(node => {
          report.issues.push({
            id: violation.id,
            description: violation.description,
            help: violation.help,
            helpUrl: violation.helpUrl,
            impact: impact,
            element: node.html,
            target: Array.isArray(node.target) ? node.target.join(', ') : node.target,
            standards: {
              wcag: violation.tags.filter(tag => tag.startsWith('wcag')).join(', ')
            }
          });
        });
      });
    }

    // Include passes in report if requested
    if (options.includePasses && results && results.passes) {
      report.passes = results.passes.map(pass => ({
        id: pass.id,
        description: pass.description,
        help: pass.help,
        helpUrl: pass.helpUrl,
        impact: 'pass',
        elements: pass.nodes.map(node => node.html)
      }));
    }

    return report;
  } catch (error) {
    console.error('Error running accessibility scan:', error);
    report.error = error.message;
    return report;
  }
}

/**
 * Writes the accessibility report to the console and optionally to a file.
 * @param {Object} report - The accessibility report to write.
 * @param {Object} options - Options for writing the report.
 * @param {boolean} options.console - Whether to log to console.
 * @param {boolean} options.format - Output format ('json' or 'text').
 */
function writeAccessibilityReport(report, options = {}) {
  const format = options.format || 'json';
  
  if (options.console !== false) {
    if (format === 'json') {
      console.log('Accessibility Report:', JSON.stringify(report, null, 2));
    } else {
      console.log('=== Accessibility Report ===');
      console.log(`Timestamp: ${report.timestamp}`);
      console.log(`URL: ${report.url}`);
      console.log(`\nSummary:`);
      console.log(`  Critical: ${report.summary.critical}`);
      console.log(`  Serious: ${report.summary.serious}`);
      console.log(`  Moderate: ${report.summary.moderate}`);
      console.log(`  Minor: ${report.summary.minor}`);
      console.log(`  Total Issues: ${report.summary.total}`);
      
      if (report.issues.length > 0) {
        console.log(`\nDetailed Issues:`);
        report.issues.forEach((issue, index) => {
          console.log(`\n[${index + 1}] ${issue.id} (${issue.impact})`);
          console.log(`    ${issue.help}`);
          console.log(`    Element: ${issue.element}`);
          console.log(`    Help: ${issue.helpUrl}`);
        });
      }
    }
  }
  
  return report;
}

/**
 * REACT_017: Add/fix 2 landmark issues
 * Validates landmark elements for proper structure and accessibility.
 */
function validateLandmark(landmark) {
  if (!landmark || !landmark.role) {
    return false;
  }
  return true;
}

/**
 * Validates landmark structure by checking required properties.
 * @param {Object} landmark - The landmark object to validate.
 * @returns {boolean} Returns true if the landmark structure is valid.
 */
function validateLandmarkStructure(landmark) {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
}

/**
 * Adds landmark roles to elements.
 */
function addLandmarkRoles() {
  const landmarkElements = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"], [role="banner"], [role="complementary"], [role="search"]');
  landmarkElements.forEach((element, index) => {
    if (!element.id) {
      element.id = 'landmark-' + index;
    }
  });
}

/**
 * REACT_027: Fix 26 table structure issues
 * Validates table accessibility by checking for proper structure.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table is accessible.
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  const hasCaption = table.querySelector('caption') !== null;
  
  return hasHeaders && hasCaption;
}

/**
 * Validates table structure for proper headers and accessibility.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} Returns true if the table structure is valid.
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    cells.forEach(cell => {
      if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
        cell.setAttribute('scope', 'col');
      }
    });
  });
  
  return true;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Gets accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string|null} Returns the accessible name or null.
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  return svg.getAttribute('aria-label') || 
         svg.getAttribute('aria-labelledby') || 
         svg.querySelector('title')?.textContent || 
         null;
}

/**
 * Sets accessibility attributes on SVG elements.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} name - The accessible name to set.
 */
function setSvgAttributes(svg, name) {
  if (!svg) return;
  
  if (name && !svg.hasAttribute('aria-label')) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
  }
}

/**
 * REACT_036: Fix 1 fake link issue
 * Creates an in-page button with proper accessibility.
 * @param {string} text - The button text.
 * @param {Function} onClick - The click handler.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

/**
 * Validates link accessibility by checking for proper href attributes.
 * @param {HTMLAnchorElement} link - The link element to validate.
 * @returns {boolean} Returns true if the link is accessible.
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  
  const href = link.getAttribute('href');
  const hasProperHref = href && href.length > 0 && href !== '#';
  const hasAccessibleText = link.textContent.trim().length > 0 || link.getAttribute('aria-label');
  
  return hasProperHref || hasAccessibleText;
}

/**
 * Handles fake links by converting them to proper buttons or adding accessibility attributes.
 */
function handle