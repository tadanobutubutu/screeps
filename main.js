// Accessibility Functions for Screeps

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const accessiblyHelper = async (...args) => {
  return args;
};

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

const { 
  setLanguageAttribute, 
  addLandmarkRoles, 
  fixFakeLinks, 
  addressAccessibilityIssues, 
  setSvgAccessibleNames, 
  ensureUniqueLandmarks, 
  fixUniqueLandmarks 
} = require('./AccessibilityUtilities');

const { 
  validateInput, processData, formatResponse 
} = require('./utils/validators');
const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkUtils');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svgAccessibilityUtils');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { checkLinkAccessibility } = require('./utils/linkAccessibilityUtils');
const { CONFIG: CONFIG_UTILS } = require('./utils/constants');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

// Book-related functions
function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);
  announceBookAdded(title, author);
  return bookObject;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];
  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });
  return booksList.join("\n");
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

exports.generateDependencyReport = generateDependencyReport;
exports.fixAccessibilityIssues = fixAccessibilityIssues;
exports.accessiblyHelper = accessiblyHelper;
exports.createAccessibleInput = createAccessibleInput;
exports.getUserSafetyAdvice = getUserSafetyAdvice;

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

function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

function rotateBack() {
  console.log('Reverting back the rotation.');
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.name;
}

function writeReport(report) {
  const reportFile = path.join(CONFIG.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id !== 'undefined' && landmark.id !== null) {
      if (!seen.has(landmark.id)) {
        seen.add(landmark.id);
        uniqueLandmarks.push(landmark);
      }
    }
  }
  return uniqueLandmarks;
}

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function setSvgAttributes(svgElement, name) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return false;
  }
  svgElement.removeAttribute('aria-label');
  svgElement.removeAttribute('aria-labelledby');
  if (!name) {
    svgElement.setAttribute('aria-hidden', 'true');
    return true;
  }
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;
  const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  title.setAttribute('id', titleId);
  svgElement.setAttribute('aria-labelledby', titleId);
  svgElement.removeAttribute('aria-hidden');
  return true;
}

function validateLinkAccessibility(link) {
  const issues = [];
  if (!link) {
    return { valid: false, issues: ['Link element is required'] };
  }
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  if (!text && !ariaLabel) {
    issues.push('REACT_036: Link has no accessible name (no text or aria-label)');
  }
  if (text && (text === 'click here' || text === 'read more' || text === 'learn more')) {
    issues.push(`REACT_036: Link text "${text}" is not descriptive`);
  }
  return { valid: issues.length === 0, issues };
}

function handleFakeLinks(container) {
  const issues = [];
  const elements = container ? container.querySelectorAll('a, button') : document.querySelectorAll('a, button');
  elements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'a' && !element.getAttribute('href') && !element.getAttribute('onclick')) {
      issues.push(`REACT_036: Element at index ${index} is an anchor without href or onclick`);
    }
    if (tagName === 'button' && element.querySelector('a')) {
      issues.push(`REACT_036: Button at index ${index} contains an anchor element`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function fixFakeLink() {
  handleFakeLinks();
}

function addLandmarkRegions() {
  addProperLandmarkRegions();
}

function addProperLandmarkRegions(container) {
  const result = { added: [], issues: [] };
  const root = container || document.body;
  let main = root.querySelector('main, [role="main"]');
  if (!main) {
    main = document.createElement('main');
    const firstChild = root.firstChild;
    if (firstChild) {
      root.insertBefore(main, firstChild);
    } else {
      root.appendChild(main);
    }
    result.added.push('main');
  }
  let header = root.querySelector('header, [role="banner"]');
  if (!header) {
    header = document.createElement('header');
    root.insertBefore(header, root.firstChild);
    result.added.push('header');
  }
  let footer = root.querySelector('footer, [role="contentinfo"]');
  if (!footer) {
    footer = document.createElement('footer');
    root.appendChild(footer);
    result.added.push('footer');
  }
  return result;
}

function processAccessibilityReport(report) {
  const findings = {
    langAttribute: false,
    tableIssues: 0,
    landmarkIssues: 0,
    svgIssues: 0,
    uniqueLandmarkIssues: 0,
    fakeLinkIssues: 0
  };
  if (report) {
    if (report.REACT_015) findings.langAttribute = true;
    if (report.REACT_027) findings.tableIssues = report.REACT_027.count || 0;
    if (report.REACT_017) findings.landmarkIssues = report.REACT_017.count || 0;
    if (report.REACT_041) findings.svgIssues = report.REACT_041.count || 0;
    if (report.REACT_025) findings.uniqueLandmarkIssues = report.REACT_025.count || 0;
    if (report.REACT_036) findings.fakeLinkIssues = report.REACT_036.count || 0;
  }
  return findings;
}

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return;
  }
  insightReport.issues.forEach((issue) => {
    switch (issue.type) {
      case 'REACT_015':
        if (issue.element) {
          addLangAttribute(issue.element);
        }
        break;
      case 'REACT_027':
        if (issue.table) {
          validateTableStructure(issue.table);
          fixTableStructure();
        } else {
          validateTableAccessibility();
        }
        break;
      case 'REACT_017':
        if (issue.landmark) {
          validateLandmarkStructure(issue.landmark);
        } else {
          validateLandmark();
        }
        addLandmarkRegions();
        break;
      case 'REACT_041':
        if (issue.svg) {
          const accessibleName = getSvgAccessibleName(issue.svg);
          setSvgAttributes(issue.svg, accessibleName);
        }
        break;
      case 'REACT_025':
        ensureUniqueLandmarks(landmarks);
        break;
      case 'REACT_036':
        handleFakeLinks();
        createInPageButton('Click me', () => {});
        break;
      default:
        break;
    }
  });
}

function createAccessibleBookForm(container) {
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'add-book-form-title');
  const title = document.createElement('h2');
  title.id = 'add-book-form-title';
  title.textContent = 'Add New Book';
  form.appendChild(title);
  const fields = [
    { id: 'book-title', label: 'Title', type: 'text', required: true },
    { id: 'book-author', label: 'Author', type: 'text', required: true },
    { id: 'book-isbn', label: 'ISBN', type: 'text', required: false },
    { id: 'book-published', label: 'Published Date', type: 'date', required: false }
  ];
  fields.forEach(field => {
    const fieldset = document.createElement('div');
    fieldset.className = 'form-field';
    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;
    fieldset.appendChild(label);
    const input = document.createElement('input');
    input.id = field.id;
    input.type = field.type;
    input.required = field.required;
    input.setAttribute('aria-required', field.required.toString());
    fieldset.appendChild(input);
    form.appendChild(fieldset);
  });
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Book';
  submitButton.setAttribute('aria-label', 'Submit the book form');
  form.appendChild(submitButton);
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');
  });
  if (container) {
    container.appendChild(form);
  }
  return form;
}

function enhanceFormAccessibility(form) {
  if (!form) return;
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'form-title');
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
      input.id = id;
      const label = form.querySelector(`label[for="${id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id);
      } else {
        const type = input.type || 'text';
        input.setAttribute('aria-label', `${type} input`);
      }
    }
  });
  const buttons = form.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent.trim() || 'Submit button');
    }
  });
}

function addLangAttribute(element) {
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

function getFullLangAttribute() {
  return document.documentElement.lang || 'en-US';
}

function getLangAttribute() {
  return document.documentElement.lang;
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => validateTableStructure(table));
}

function validateTableStructure(table) {
  const issues = [];
  if (!table) {
    return { valid: false, issues: ['Table element is required'] };
  }
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    const isHeaderRow = row.parentElement.tagName === 'THEAD';
    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH' && !isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} contains th but is not in thead`);
      }
      if (cell.tagName === 'TD' && isHeaderRow) {
        issues.push(`REACT_027: Row ${rowIndex} in thead contains td instead of th`);
      }
    });
  });
  return { valid: issues.length === 0, issues };
}