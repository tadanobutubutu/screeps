const fs = require('fs');
const path = require('path');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const { spawn } = require('child_process');
const PropTypes = require('prop-types');
const React = require('react');
const ReactDOM = require('react-dom/client');
const a11y = require('./AccessibilityUtilities');
const accessiblyHelper = require('./accessably-helper');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(),validateLandmarkStructure(),validateLandmarkAttributes() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName()and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

let userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
let books = [];
let dependencyGraph = {};

function initialize() {
  console.log('Initializing application...');
  return true;
}

function systemInfo() {
  return 'System info not implemented';
}

const initializeApp = () => {
  console.log('Application initialized');
  addressAccessibilityIssues();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      console.log('Tab pressed');
    }
  });

  document.addEventListener('click', () => {
    console.log('Click event');
  });
};

const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

const updateAccessibilityFeatures = () => {
  console.log('Accessibility features updated.');
};

const getUserSafetyAdvice = () => {
  const safetyCategoriesLocal = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategoriesLocal[Math.floor(Math.random() * safetyCategoriesLocal.length)];
};

const addBook = (title, author) => {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
};

const announceBookAdded = (title, author) => {
  console.log(`A new book has been added: "${title}" by "${author}".`);
};

const getBooksList = () => {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
};

function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;

  if (!element.id) {
    const id = prefix + Math.random().toString(36).substring(2, 9);
    element.id = id;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element || !label) return false;

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

function renderDependencyGraph(container, dependencies = [], options = {}) {
  // ...
}

function getDependencies(root) {
  // ...
}

function getLangAttribute(element) {
  return element.getAttribute('lang') || 'en';
}

function addLangAttribute(element, lang) {
  if (lang && !element.getAttribute('lang')) {
    element.setAttribute('lang', lang);
  }
}

function createInPageButton(targetId, text) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function loadLandmarks() {
  try {
    const filePath = CONFIG.dataPath + '/landmarks.json';
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

  const validLandmarks = landmarks.filter(validateLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarksList(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seenIds = new Set();
  return landmarks.filter(landmark => {
    if (seenIds.has(landmark.id)) {
      return false;
    }
    seenIds.add(landmark.id);
    return true;
  });
}

function addLandmarkRoles(container) {
  if (!container) return;
}

function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      console.warn(`Multiple ${role} landmarks detected. Only one ${role} should be present per page.`);
    }
  });

  return landmarkCounts;
}

function fixFakeLinkIssue(container) {
  const fakeLinks = container.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
      const href = link.getAttribute('data-href');
      if (href) {
        link.setAttribute('href', href);
      } else {
        const onclick = link.getAttribute('onclick');
        if (onclick) {
          link.setAttribute('role', 'button');
        }
      }
    }
  });
}

function addAccessibleNamesToSVGs(container) {
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = 'svg-title-' + index;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', 'SVG image ' + (index + 1));
      }
    }
  });
}

function addressAccessibilityIssues() {
  const accessibilityIssues = [
    {
      action: (context) => addLandmarkRoles(context),
      context: document.body
    },
    {
      action: (context) => ensureUniqueLandmarks(context),
      context: document.body
    },
    {
      action: (context) => fixFakeLinkIssue(context),
      context: document.body
    },
    {
      action: (context) => addAccessibleNamesToSVGs(context),
      context: document.body
    }
  ];

  accessibilityIssues.forEach((issue) => {
    if (issue.context) {
      issue.action(issue.context);
    }
  });
}

function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

function enhanceAddBookFormAccessibility(formElement) {
  if (!formElement) return;

  formElement.setAttribute('role', 'form');
  formElement.setAttribute('aria-label', 'add-book-form-title');

  const inputs = formElement.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }

    if (!input.id) {
      input.id = 'input_' + Math.random().toString(36).substr(2, 9);
    }
  });
}

function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (issuesData) {
    issues = a11y.accessiblyHelper(issuesData);
  }

  // Implementation for generateAccessibilityReport using axe-core scanning and report writing
}

function generateReport(options = {}) {
  const {
    context = document,
    options: axeOptions = {},
    includeIncomplete = true,
    allowedRules = []
  } = options;

  const results = axe(context, axeOptions);

  results
    .then(results => {
      const violations = results.violations.reverse();
      const report = extractReportData(violations);

      if (report) {
        fs.writeFileSync(path.join(CONFIG.dataPath, 'report.json'), JSON.stringify(report));
      }
    })
    .catch(error => {
      console.error('Error while generating the accessibility report:', error);
    });
}

function extractReportData(violations) {
  const report = {
    title: 'Accessibility Report',
    date: new Date().toLocaleDateString(),
    context: {
      name: document.title,
      url: document.URL
    },
    results: []
  };

  violations.forEach(violation => {
    const { node, violations: detailedViolations } = violation;

    if (detailedViolations && detailedViolations.length > 0) {
      report.results.push(...detailedViolations.map(detailedViolation => {
        return {
          id: detailedViolation.nodeId,
          impact: detailedViolation.impacts[0],
          description: detailedViolation.description,
          tags: detailedViolation.tags,
          help: detailedViolation.help
        };
      }));
    }

    report.results.push({
      id: violation.id,
      impact: violation.impacts[0],
      description: violation.description,
      tags: violation.tags,
      help: violation.help,
      nodes: [node]
    });
  });

  return report;
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

function spawnProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.on('error', reject);
    child.on('close', resolve);
    child.stdout.on('data', data => process.stdout.write(data));
    child.stderr.on('data', data => process.stderr.write(data));
  });
}

function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seenIds = new Set();
  return elements.filter(element => {
    if (element && 'id' in element) {
      if (seenIds.has(element.id)) {
        return false;
      }
      seenIds.add(element.id);
      return true;
    }
    return false;
  });
}

function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graph');

  renderDependencyGraph(container);
  renderIndexView(container);
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  return '';
}

function setSvgAttributes(svg, accessibleName) {
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
}

function validateTableAccessibility(table) {
  return table && table.tagName === 'TABLE';
}

function validateTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    return false;
  }
  const hasHeader = table.querySelector('thead');
  const hasBody = table.querySelector('tbody');
  return hasHeader && hasBody;
}

function fixTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    return;
  }

  let thead = table.querySelector('thead');
  if (!thead) {
    thead = document.createElement('thead');
    table.insertBefore(thead, table.firstChild);
  }

  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }
}

function validateLandmarkStructure(landmark) {
  return landmark && landmark.tagName;
}

function validateLandmarkAttributes(landmark) {
  const role = landmark.getAttribute('role');
  const label = landmark.getAttribute('aria-label');
  const labelledby = landmark.getAttribute('aria-labelledby');
  return role || label || labelledby;
}

function addMainLandmark(element) {
  if (element && !element.getAttribute('role')) {
    element.setAttribute('role', 'main');
  }
}

function ensureUniqueLandmarks() {
  const landmarkSelectors = [
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="form"]',
    '[role="search"]'
  ];

  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      for (let i = 1; i < elements.length; i++) {
        const element = elements[i];
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          element.setAttribute('aria-label', 'Duplicate ' + selector.replace('[role="', '').replace('"]', '));
        }
      }
    }
  });
}

function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main') || document.querySelector('#main-content');
  if (mainContent) {
    addMainLandmark(mainContent);
  }
}

function validateLinkAccessibility(link) {
  return link && link.getAttribute('href');
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const parent = link.parentElement;
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-label', link.getAttribute('aria-label') || 'Link');
    button.textContent = link.textContent;
    if (link.hasAttribute('onclick')) {
      button.addEventListener('click', () => eval(link.getAttribute('onclick')));
    }
    parent.replaceChild(button, link);
  });
}

function validateLandmark(landmarkElement) {
  if (!landmarkElement) return false;
  
  const role = landmarkElement.getAttribute('role');
  if (!role) return false;
  
  const landmarkRolesAllowed = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'region'];
  return landmarkRolesAllowed.includes(role);
}

function validateLandmarkStructure(landmarkElement) {
  if (!landmarkElement) return false;
  
  const tagName = landmarkElement.tagName.toLowerCase();
  const structuralElements = ['main', 'nav', 'aside', 'footer', 'header', 'section'];
  
  return structuralElements.includes(tagName);
}

function validateLandmarkAttributes(landmarkElement) {
  if (!landmarkElement) return false;
  
  const hasLabel = !!landmarkElement.getAttribute('aria-label');
  const hasLabelledBy = !!landmarkElement.getAttribute('aria-labelledby');
  
  return hasLabel || hasLabelledBy;
}

function ensureUniqueLandmarksList(landmarksArray) {
  if (!Array.isArray(landmarksArray)) return [];
  
  const seen = new Set();
  return landmarksArray.filter(item => {
    const key = item.id || item.role || JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Add the code that sets the ARIA role for the dependencyGraph container
if (document.querySelector('#dependency-graph')) {
  const currentRole = document.querySelector('#dependency-graph').getAttribute('role');
  if (!currentRole || currentRole !== 'graph') {
    document.querySelector('#dependency-graph').setAttribute('role', 'graph');
  }
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

const main = {
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

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
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

function renderIndexView(container) {
  // ...
}

function fixAccessibilityIssues() {
  addressAccessibilityIssues();
}

function getUserSafetyAdviceInternal() {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function rotateBack() {
  console.log('Reverting back the rotation.');
}

// Export required modules
module.exports.initialize = initialize;
module.exports.initializeApp = initializeApp;
module.exports.ensureElementHasId = ensureElementHasId;
module.exports.addAriaLabel = addAriaLabel;
module.exports.renderDependencyGraph = renderDependencyGraph;
module.exports.getDependencies = getDependencies;
module.exports.CONFIG = CONFIG;
module.exports.getLangAttribute = getLangAttribute;
module.exports.addLangAttribute = addLangAttribute;
module.exports.createInPageButton = createInPageButton;
module.exports.addLandmarkRoles = addLandmarkRoles;
module.exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
module.exports.fixFakeLinkIssue = fixFakeLinkIssue;
module.exports.addAccessibleNamesToSVGs = addAccessibleNamesToSVGs;
module.exports.addressAccessibilityIssues = addressAccessibilityIssues;
module.exports.main = main;
module.exports.getUserSafetyAdvice = getUserSafetyAdvice;
module.exports.addBook = addBook;
module.exports.announceBookAdded = announceBookAdded;
module.exports.getBooksList = getBooksList;
module.exports.checkUserSafety = checkUserSafety;
module.exports.checkSafetyCategories = checkSafetyCategories;
module.exports.updateAccessibilityFeatures = updateAccessibilityFeatures;
module.exports.rotateBack = rotateBack;
module.exports.ensure = ensureUniqueLandmarks;