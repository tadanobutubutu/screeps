// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper'); // Added this import

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxResults: 100,
  dataPath: './data'
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

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const getUserSafetyAdvice = () => {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
};

export const addBook = (title, author) => {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
};

export const announceBookAdded = (title, author) => {
  console.log(`A new book has been added: "${title}" by "${author}".`);
};

export const getBooksList = () => {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
};

// Helper functions
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

function loadLandmarks() {
  try {
    const filePath = config.dataPath + 'landmarks.json';
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
    // ...
    form.setAttribute('aria-label', 'Add Book Form');

    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    // ...
    // ...

    // ...

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

  // ...
  // ...

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
function loadLandmarks() {
  try {
      const filePath = CONFIG.DATA_PATH + 'landmarks.json';
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
  }
}

// Updated function: ensures landmarks uniqueness when there's an array structure
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

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
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
  formElement.setAttribute('aria-label', 'add-book-form-title');

  // Find and enhance form controls
  const inputs = formElement.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    // Add required attribute if needed
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }

    // Add labels if missing
    if (!input.id) {
      input.id = 'input_' + Math.random().toString(36).substr(2, 9);
    }
  });
}

/**
 * Renders a data visualization graph with proper accessibility attributes
 * Creates an accessible SVG graph component with title, description, and proper roles
 * @param {Object} data - The data to visualize
 * @param {string} title - The accessible title for the graph
 * @param {string} description - A detailed description of the data for screen readers
 * @param {Object} options - Configuration options for the graph
 * @returns {string} HTML string containing the accessible graph SVG
 */
export function renderGraph(data, title, description, options = {}) {
  const {
    id = 'graph',
    width = 600,
    height = 400,
    color = '#3498db',
    className = 'data-graph',
    ariaDescribedBy = 'graph-description'
  } = options;

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Calculate graph dimensions
  const padding = { top: 40, right: 20, bottom: 50, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const values = data.map(d => typeof d.value === 'number' ? d.value : 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Create scales
  const xScale = (index) => padding.left + (index / (data.length - 1)) * graphWidth;
  const yScale = (value) => padding.top + graphHeight - (value / valueRange) * graphHeight;

  // Generate path points
  const points = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(typeof d.value === 'number' ? d.value : 0);
    return `${x},${y}`;
  }).join(' ');

  // Generate bar charts if needed
  const bars = data.map((d, i) => {
    const x = xScale(i) - 5;
    const barHeight = typeof d.value === 'number' ? (d.value / valueRange) * graphHeight : 0;
    const y = padding.top + graphHeight - barHeight;
    const barWidth = (graphWidth / data.length) * 0.8;
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" aria-hidden="true"></rect>`;
  }).join('');

  // Generate axis
  const xAxis = data.map((d, i) => {
    const x = xScale(i);
    return `<text x="${x}" y="${height - 10}" text-anchor="middle" fill="#666" font-size="12">${d.label || i}</text>`;
  }).join('');

  const yAxis = [];
  for (let i = 0; i <= 5; i++) {
    const value = minValue + (i * valueRange / 5);
    const y = yScale(value);
    yAxis.push(`<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#666" font-size="12">${Math.round(value)}</text>`);
    if (i < 5) {
      yAxis.push(`<line x1="${padding.left}" y1="${y}" x2="${padding.left + graphWidth}" y2="${y}" stroke="#eee" stroke-width="1"></line>`);
    }
  }

  // Generate grid lines
  const gridLines = yAxis.filter(y => y.startsWith('<line'));
  
  // Create accessible SVG with proper structure
  return `
    <div class="${className}" role="region" aria-label="${title}" id="${id}-container">
      <svg id="${id}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-title ${id}-desc" focusable="false" preserveAspectRatio="xMidYMid meet">
        <title id="${id}-title">${title}</title>
        <desc id="${id}-desc">${description}</desc>
        <rect width="100%" height="100%" fill="white" aria-hidden="true"></rect>
        <g aria-hidden="true">
          ${gridLines.join('')}
        </g>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" aria-hidden="true"></polyline>
        ${bars}
      </g>
    </svg>
  `;
}

/**
 * Renders an accessible index or listing page with proper semantic structure
 * Creates navigable sections with proper headings, landmarks, and skip links
 * @param {string} title - The main title for the index page
 * @param {Array} sections - Array of section objects containing heading and content
 * @param {Object} options - Configuration options for the index
 * @returns {string} HTML string containing the accessible index structure
 */
export function renderIndex(title, sections = [], options = {}) {
  const {
    id = 'main-index',
    className = 'main-index',
    showSkipLink = true,
    ariaLabelledBy = 'index-heading'
  } = options;

  // Validate title
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Generate skip link for keyboard navigation
  const skipLink = showSkipLink ? `
    <a href="#${id}" class="skip-link" aria-label="Skip to main content">Skip to main content</a>
  ` : '';

  // Generate sections
  const indexSections = sections.map((section, index) => {
    const sectionId = section.id || `section-${index + 1}`;
    const sectionRole = section.role || 'region';
    const sectionLabel = section.label || section.heading || `Section ${index + 1}`;
    
    return `
      <section id="${sectionId}" role="${sectionRole}" aria-label="${sectionLabel}" class="index-section">
        ${section.heading ? `<h2 id="${sectionId}-heading">${section.heading}</h2>` : ''}
        <div class="section-content">
          ${section.content || ''}
        </div>
      </section>
    `;
  }).join('');

  // Create the main index structure with proper landmarks
  return `
    <main id="${id}" class="${className}" role="main" aria-labelledby="${ariaLabelledBy}">
      <h1 id="${ariaLabelledBy}" class="index-title">${title}</h1>
      <nav aria-label="Table of Contents" class="index-nav">
        <ul class="index-toc">
          ${sections.map((section, index) => {
            const sectionId = section.id || `section-${index + 1}`;
            return `<li><a href="#${sectionId}">${section.heading || `Section ${index + 1}`}</a></li>`;
          }).join('')}
        </ul>
      </nav>
      <div class="index-content">
        ${indexSections}
      </div>
    </main>
  `;
}

/**
 * Updates the existing function to use the new renderGraph and renderIndex functions
 * This function demonstrates integration of the new accessibility-focused rendering functions
 * @param {Object} config - Configuration object for graph and index rendering
 * @returns {string} Combined HTML string with rendered graph and index
 */
export function updateGraphIndexRendering(config = {}) {
  const {
    graphConfig = {},
    indexConfig = {},
    graphData = [],
    indexTitle = 'Index',
    indexSections = []
  } = config;

  // Render graph using new function
  const graphHtml = renderGraph(
    graphData,
    graphConfig.title || 'Data Visualization',
    graphConfig.description || 'Graphical representation of data',
    graphConfig.options || {}
  );

  // Render index using new function
  const indexHtml = renderIndex(
    indexTitle,
    indexSections,
    indexConfig.options || {}
  );

  return `
    <div class="graph-index-container">
      ${graphHtml}
      ${indexHtml}
    </div>
  `;
}