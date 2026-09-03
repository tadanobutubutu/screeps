// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Existing code starts here
const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice';

export const checkUserSafety = () => {
  let userSafetyMessage = '';

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';


  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Authorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Fix fake links by converting them to proper buttons
  handleFakeLinks();

  // Validate and fix table accessibility issues
  validateTableAccessibility();

  // Validate and fix table structure issues
  validateTableStructure();

  // Validate and fix landmark issues
  validateLandmark();
  validateLandmarkStructure();

  // Validate and fix SVG accessibility issues
  getSvgAccessibleName();
  setSvgAttributes();

  // Validate and fix link accessibility issues
  validateLinkAccessibility();
  checkLinkAccessibility();

  // Set language attributes
  getLangAttribute();
  getFullLangAttribute();
}

/**
 * Generates a detailed accessibility report using axe-core scanning.
 * @param {Object} options - Configuration options for the accessibility scan
 * @param {HTMLElement} options.context - The context element to scan (defaults to document)
 * @param {Object} options.results - Previous results to merge with
 * @returns {Promise<Object>} A promise that resolves to an accessibility report object
 */
export async function generateAccessibilityReport(options = {}) {
  // axe-core is assumed to be available globally or imported
  const axe = window.axe || (await import('axe-core')).default;
  
  const context = options.context || document;
  const results = options.results || [];
  
  try {
    const axeResults = await axe.run(context, {
      ...options.axeOptions,
      // Include common rules for accessibility checking
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
      }
    });
    
    const violations = axeResults.violations || [];
    const passes = axeResults.passes || [];
    const incomplete = axeResults.incomplete || [];
    const inherits = axeResults.inherits || [];
    const notices = axeResults.notices || [];
    
    // Format violations for the report
    const formattedViolations = violations.map(violation => ({
      id: violation.id,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      severity: violation.severity,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary
      }))
    }));
    
    // Format passes for the report
    const formattedPasses = passes.map(pass => ({
      id: pass.id,
      description: pass.description,
      help: pass.help,
      helpUrl: pass.helpUrl,
      nodes: pass.nodes.map(node => ({
        html: node.html,
        target: node.target
      }))
    }));
    
    // Create the accessibility report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        violationsCount: violations.length,
        passesCount: passes.length,
        incompleteCount: incomplete.length,
        inheritsCount: inherits.length,
        noticesCount: notices.length,
        totalIssues: violations.length + incomplete.length
      },
      violations: formattedViolations,
      passes: formattedPasses,
      incomplete: incomplete,
      inherits: inherits,
      notices: notices,
      // Add any previous results that were passed in
      previousResults: results
    };
    
    return report;
  } catch (error) {
    console.error('Error running accessibility scan:', error);
    throw new Error(`Accessibility report generation failed: ${error.message}`);
  }
}

/**
 * Writes an accessibility report to a file or console output.
 * @param {Object} report - The accessibility report object generated by generateAccessibilityReport
 * @param {string} format - The output format ('json', 'text', or 'console')
 * @param {string} filePath - The file path to write the report to (for file formats)
 * @returns {Promise<string>} The formatted report or file path
 */
export async function writeAccessibilityReport(report, format = 'json', filePath = null) {
  const formatReport = (reportObj, fmt) => {
    switch (fmt) {
      case 'text':
        let textReport = 'Accessibility Report\n';
        textReport += '==================\n\n';
        textReport += `Generated: ${reportObj.timestamp}\n\n`;
        textReport += 'Summary:\n';
        textReport += `- Violations: ${reportObj.summary.violationsCount}\n`;
        textReport += `- Passes: ${reportObj.summary.passesCount}\n`;
        textReport += `- Incomplete: ${reportObj.summary.incompleteCount}\n`;
        textReport += `- Inherits: ${reportObj.summary.inheritsCount}\n`;
        textReport += `- Notices: ${reportObj.summary.noticesCount}\n`;
        textReport += `- Total Issues: ${reportObj.summary.totalIssues}\n\n`;
        
        if (reportObj.violations.length > 0) {
          textReport += 'Violations:\n';
          reportObj.violations.forEach((violation, index) => {
            textReport += `\n${index + 1}. ${violation.help}\n`;
            textReport += `   ID: ${violation.id}\n`;
            textReport += `   Description: ${violation.description}\n`;
            textReport += `   Severity: ${violation.severity}\n`;
            textReport += `   Affected nodes: ${violation.nodes.length}\n`;
            violation.nodes.forEach((node, nodeIndex) => {
              textReport += `     - Node ${nodeIndex + 1}: ${node.failureSummary}\n`;
            });
          });
        }
        
        return textReport;
      case 'json':
      default:
        return JSON.stringify(reportObj, null, 2);
    }
  };
  
  if (format === 'file' && filePath) {
    try {
      const fs = require('fs');
      const formattedReport = formatReport(report, 'json');
      fs.writeFileSync(filePath, formattedReport, 'utf8');
      return filePath;
    } catch (error) {
      console.error('Error writing report file:', error);
      throw new Error(`Failed to write report file: ${error.message}`);
    }
  } else if (format === 'json') {
    return formatReport(report, 'json');
  } else if (format === 'text') {
    return formatReport(report, 'text');
  } else if (format === 'console') {
    const formattedReport = formatReport(report, 'text');
    console.log(formattedReport);
    return formattedReport;
  } else {
    throw new Error(`Unknown format: ${format}`);
  }
}

/**
 * Scans for accessibility issues and generates a comprehensive report.
 * Combines axe-core scanning with custom accessibility validation.
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} The accessibility report
 */
export async function scanAndReportAccessibility(options = {}) {
  const report = await generateAccessibilityReport(options);
  
  // Enhance the report with additional custom checks
  const customIssues = [];
  
  // Check for language attribute
  const htmlElement = document.documentElement;
  if (!htmlElement.lang || htmlElement.lang === '') {
    customIssues.push({
      id: 'MISSING_LANG_ATTRIBUTE',
      description: 'The HTML element is missing a lang attribute',
      help: 'Add a lang attribute to the HTML element to specify the document language',
      severity: 'moderate',
      nodes: [{
        html: '<html>',
        target: ['html']
      }]
    });
  }
  
  // Check for unique landmarks
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="form"], [role="region"]');
  const landmarkTypes = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmarkTypes[role]) {
      landmarkTypes[role] = [];
    }
    landmarkTypes[role].push(landmark);
  });
  
  // Check for duplicate main landmarks
  if (landmarkTypes.main && landmarkTypes.main.length > 1) {
    customIssues.push({
      id: 'DUPLICATE_LANDMARKS',
      description: 'Multiple main landmarks found',
      help: 'Ensure there is only one main landmark per page',
      severity: 'moderate',
      nodes: landmarkTypes.main.map((el, index) => ({
        html: el.outerHTML || el.tagName,
        target: [`${index + 1}. ${el.tagName}`]
      }))
    });
  }
  
  // Add custom issues to violations
  if (customIssues.length > 0) {
    report.violations = [...report.violations, ...customIssues];
    report.summary.violationsCount = report.violations.length;
    report.summary.totalIssues = report.violations.length + report.summary.incompleteCount;
  }
  
  return report;
}

export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  addBook: function(title, author, isbn) {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add Book Form');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);

    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Book added:', {
        title: titleInput.value,
        author: authorInput.value,
        isbn: isbnInput.value
      });
    });

    return form;
  }
};

/**
 * Creates an accessible input element with proper labeling.
 * @param {string} type - Input type (text, number, etc.)
 * @param {string} id - Unique identifier for the input
 * @param {string} labelText - Text for the associated label
 * @param {string} value - Initial value for the input
 * @returns {HTMLElement} The created input element with label
 */
function createAccessibleInput(type, id, labelText, value = '') {
  const container = document.createElement('div');
  container.className = 'form-group';

  const label = document.createElement('label');
  label.setAttribute('for', id);
  label.textContent = labelText;

  const input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('id', id);
  input.setAttribute('name', id);
  input.setAttribute('aria-required', 'true');
  input.setAttribute('aria-label', labelText);
  input.value = value;

  container.appendChild(label);
  container.appendChild(input);

  return container;
}

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Load landmarks from file (new addition)
import {CONFIG} from './utils/constants';
import path from 'path';
import fs from 'fs';
function loadLandmarks() {
  try {
      const filePath = path.join(__dirname, 'landmarks.json');
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarkTypes = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependency-graph');
  if (!container) {
    return;
  }

  // Ensure the dependencyGraph container has a proper ARIA role for accessibility
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graph');

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Function to enhance accessibility for addBook form
function enhanceAddBookFormAccessibility(formElement) {
  if (!formElement) return;

  // Add ARIA attributes to form elements
  formElement.setAttribute('role', 'form');
  formElement.setAttribute('aria-labelledby', 'add-book-form-title');

  // Find and enhance form controls
  const inputs = formElement.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Add required attribute if needed
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }

    // Add labels if missing
    if (!input.id) {
      input.id = `input_${Math.random().toString(36).substr(2, 9)}`;
    }
  });
}
=========================================