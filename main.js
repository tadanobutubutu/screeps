// User Safety: unsafe
// Safety Categories: PII/Privacy

// This file includes both the accessibility improvements and the dependency visualization tool features.

import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';

// Node.js functions for dependency visualization tool
const fs = require('fs');
const path = require('path');

// New function to visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// Helper function to generate dependency report
function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
}

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  // New function for rotating back
  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  // New function to address all accessibility issues
  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },

  // New function to add a book with accessibility improvements
  addBook: function(title, author, isbn) {
    // Create form with proper accessibility attributes
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add Book Form');

    // Create accessible input fields
    const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
    const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
    const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);

    // Create accessible submit button
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('aria-label', 'Add Book');
    submitButton.textContent = 'Add Book';

    // Append all elements to form
    form.appendChild(titleInput);
    form.appendChild(authorInput);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Add form to document body
    document.body.appendChild(form);

    // Add event listener for form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Handle form submission logic here
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
      input.id = `input_${Math.random().to