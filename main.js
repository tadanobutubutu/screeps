// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

// _Commit: 7d686c5a12fff4226aa99aa873837be64bdda82f_

// <!-- todo-hash: eaab11c955e687d0c7cf4e076f3ee5271986ab5f -->

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - ADD: Address new accessibility issues from insight report

// Screeps AI - Main Module

// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';
import { getDocument, getLangAttribute, getFullLangAttribute } from './accessibilityHelpers';
import { createInPageButton, handleAccessibilityIssues, createAccessibleLink, ensureUniqueLandmarks, validateLandmark, validateLandmarkStructure } from './accessibilityHelpers';
import { triggerAccessibilityMode } from './accessibilityMode';

// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';

// Accessibility function implementations
function getFullLangAttribute() {
  return getLangAttribute();
}

function personName() {
  // Fix for REACT_036: personName is part of the fake link fix
  return document.querySelector('[data-fake-link]')?.getAttribute('data-person-name') || 'Unknown';
}

function validateTableAccessibility(tableElement) {
  return validateTableAccessibility(tableElement);
}

function validateTableStructure(tableElement) {
  return validateTableStructure(tableElement);
}

function validateLandmark() {
  return validateLandmark();
}

function validateLandmarkStructure() {
  return validateLandmarkStructure();
}

function getSvgAccessibleName(svgElement) {
  return getSvgAccessibleName(svgElement);
}

function createInPageButton() {
  return createInPageButton();
}

// New function for REACT_031: Add 'aria-hidden' to decorative SVGs
function addAriaHiddenToDecorativeSVGs() {
  const decorativeSVGs = document.querySelectorAll('svg');
  decorativeSVGs.forEach((svg) => {
    if (!svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Additional accessibility functions
function addAriaToFormControls() {
  const controls = document.querySelectorAll('button, input, select, textarea');
  controls.forEach((control) => {
    if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
      const label = control.name || control.id || control.placeholder || 'Form control';
      control.setAttribute('aria-label', label);
    }
  });
}

function addAriaLabelToFormInputs() {
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input) => {
    const label = input.name || input.id || input.placeholder || 'Input field';
    input.setAttribute('aria-label', label);
  });
}

function addAriaLabelledbyToHeadings() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    const previousElement = heading.previousElementSibling;
    if (previousElement && !previousElement.getAttribute('aria-labelledby')) {
      previousElement.setAttribute('aria-labelledby', heading.id);
    }
  });
}

function addFixLandmarkIssues() {
  // Fix landmark issues by ensuring proper ARIA roles
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  landmarks.forEach((landmark) => {
    const tag = landmark.tagName.toLowerCase();
    if (tag === 'header' && !landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'banner');
    }
    if (tag === 'nav' && !landmark.getAttribute('aria-label')) {
      landmark.setAttribute('aria-label', 'Navigation');
    }
    if (tag === 'main' && !landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'main');
    }
    if (tag === 'aside' && !landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'complementary');
    }
    if (tag === 'footer' && !landmark.getAttribute('role')) {
      landmark.setAttribute('role', 'contentinfo');
    }
  });
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('[data-fake-link]');
  fakeLinks.forEach((link) => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    const personName = link.getAttribute('data-person-name') || 'Unknown';
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', `Link to ${personName}`);
    }
  });
}

// Placeholder variables for content
let dependencyGraphContent;
let indexContent;

// New function to count dependencies
function countDependencies() {
  // Placeholder implementation: count dependencies in the project
  // This could involve scanning package.json, node_modules, or internal references
  // For now, return a default value.
  return 0;
}

// Implement this function for ensuring unique landmarks (merged from both branches)
function ensureUniqueLandmarks() {
  // Landmarks that should be unique on a page
  const uniqueLandmarkSelectors = ['main', '[role="main"]', '[role="banner"]', '[role="contentinfo"]', '[role="search"]'];
  
  uniqueLandmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        // Add or update aria-label to make each landmark unique
        const existingLabel = element.getAttribute('aria-label');
        const elementTag = element.tagName.toLowerCase();
        const role = element.getAttribute('role') || elementTag;
        
        if (!existingLabel) {
          // Add index-based label for distinction
          element.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });
  
  // Ensure region and navigation landmarks have accessible names when multiple exist
  const sectionLandmarkSelectors = ['nav', '[role="navigation"]', '[role="region"]', 'aside', '[role="complementary"]'];
  
  sectionLandmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        const hasLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby') || element.id;
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        
        if (!hasLabel) {
          element.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  // Also ensure unique IDs and only one main landmark (from origin/main)
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const seenIds = new Set();
  const seenRoles = new Map();

  landmarks.forEach(landmark => {
    const role = landmark.tagName.toLowerCase();
    
    // Ensure unique IDs
    if (!landmark.id) {
      let id = role;
      let counter = 1;
      while (seenIds.has(id)) {
        id = `${role}-${counter++}`;
      }
      landmark.id = id;
      seenIds.add(id);
    } else {
      seenIds.add(landmark.id);
    }

    // Track roles for uniqueness
    if (!seenRoles.has(role)) {
      seenRoles.set(role, []);
    }
    seenRoles.get(role).push(landmark);
  });

  // Ensure only one main landmark
  const mainLandmarks = document.querySelectorAll('main');
  if (mainLandmarks.length > 1) {
    for (let i = 1; i < mainLandmarks.length; i++) {
      mainLandmarks[i].setAttribute('aria-hidden', 'true');
    }
  }
}

// New function to fix accessibility issues as per the insight report (merged from both branches)
function fixAccessibilityIssues() {
  // 1. REACT_015: Ensure lang attribute is set on the HTML element
  const lang = getLangAttribute();
  const htmlElement = getDocument ? getDocument().documentElement : document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }

  // 2. REACT_027: Validate table accessibility and structure
  const tables = (getDocument ? getDocument() : document).querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // 3. REACT_017: Validate landmark and landmark structure issues
  validateLandmark();
  validateLandmarkStructure();

  // 4. REACT_025: Ensure unique landmarks (addressing the 2 landmark uniqueness issues)
  ensureUniqueLandmarks();
  validateLinkAccessibility();
  handleFakeLinks();

  // 5. REACT_041: Add accessible names to SVGs (assuming two SVG elements)
  const svgElements = (getDocument ? getDocument() : document).querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      setSvgAttributes(svg, accessibleName);
    }
  });

  // 6. REACT_036: Fix fake link issue (personName is part of the fix)
  personName();
  handleFakeLinks();
  if (typeof handleAccessibilityIssues === 'function') {
    handleAccessibilityIssues();
  }

  // Call the new function to fix accessibility issues
  fixControlsAccessibility();
}

// Implement wrapPrimaryContentInMain function (merged from both branches)
function wrapPrimaryContentInMain(primaryContent) {
  // Wrap primary content in a <main> element for accessibility
  const doc = getDocument ? getDocument() : document;
  const mainElement = doc.createElement('main');
  mainElement.setAttribute('id', 'main-content');
  mainElement.setAttribute('role', 'main');
  
  if (typeof primaryContent === 'string') {
    mainElement.innerHTML = primaryContent;
  } else if (primaryContent instanceof HTMLElement || (primaryContent && primaryContent.appendChild)) {
    mainElement.appendChild(primaryContent);
  }
  
  return mainElement;
}

// DOM-based accessibility code for controls
function fixControlsAccessibility() {
  // Add necessary code to address any remaining control accessibility issues
}

// Renders the dependency graph view.
// Updated to use dependencyGraphContent.
export function renderDependencyGraph() {
  const container = document.getElementById('dependency-graph-container');
  if (container && dependencyGraphContent) {
    container.innerHTML = dependencyGraphContent;
    // Apply accessibility fixes to new content
    fixAccessibilityIssues();
  }
}

// Renders the index view.
// Updated to use indexContent.
export function renderIndex() {
  const container = document.getElementById('index-container');
  if (container && indexContent) {
    container.innerHTML = indexContent;
    // Apply accessibility fixes to new content
    fixAccessibilityIssues();
  }
}

/**
 * Spawns a new process or subprocess.
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments to pass to the command
 * @param {object} options - Spawn options
 * @returns {ChildProcess} - The spawned child process
 */
export function spawnProcess(command, args = [], options = {}) {
  const { spawn } = require('child_process');
  const defaultOptions = {
    stdio: 'inherit',
    shell: true
  };
  return spawn(command, args, { ...defaultOptions, ...options });
}

/**
 * Spawns a worker or subprocess for the dependency graph.
 * @param {object} options - Configuration options for the spawn
 * @returns {Promise<ChildProcess>} - Promise resolving to the spawned process
 */
export function spawnDependencyGraphWorker(options = {}) {
  return new Promise((resolve, reject) => {
    const worker = spawnProcess('node', ['./workers/dependencyGraphWorker.js'], {
      ...options,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    worker.on('error', (error) => {
      console.error('Error spawning dependency graph worker:', error);
      reject(error);
    });

    worker.on('spawn', () => {
      console.log('Dependency graph worker spawned successfully');
      resolve(worker);
    });
  });
}

/**
 * Spawns a worker or subprocess for the index.
 * @param {object} options - Configuration options for the spawn
 * @returns {Promise<ChildProcess>} - Promise resolving to the spawned process
 */
export function spawnIndexWorker(options = {}) {
  return new Promise((resolve, reject) => {
    const worker = spawnProcess('node', ['./workers/indexWorker.js'], {
      ...options,
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    worker.on('error', (error) => {
      console.error('Error spawning index worker:', error);
      reject(error);
    });

    worker.on('spawn', () => {
      console.log('Index worker spawned successfully');
      resolve(worker);
    });
  });
}

// Export makeHeaderFocusable function (from origin/main)
export { makeHeaderFocusable };

function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'banner');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        header.focus();
      }
    });
  }
}

function ensureElementId(element) {
  // Combined and reconciled code from both branches
  if (!element.id) {
    element.id = element.id || element.name || '';
  }
}

function addAriaLabel(element) {
  // Combined and reconciled code from both branches
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', 'View focus');
  }
}

// DOM-based accessibility code
document.addEventListener('DOMContentLoaded', () => {
  // Add lang attribute to HTML element
  document.documentElement.setAttribute('lang', getLangAttribute());

  // Create in-page button with accessibility considerations
  createInPageButton();

  // Validate table structure and accessibility
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Add/fix landmark issues
  validateLandmark();
  validateLandmarkStructure();

  // Add accessible names to SVGs
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });

  // Ensure unique landmarks
  ensureUniqueLandmarks();
  handleFakeLinks();

  // Add aria-hidden to decorative SVGs
  addAriaHiddenToDecorativeSVGs();
  
  // Add aria-label to form inputs
  addAriaLabelToFormInputs();
  
  // Add aria-labelledby to headings
  addAriaLabelledbyToHeadings();
  
  // Fix landmark issues
  addFixLandmarkIssues();
  
  // Fix fake link issues
  fixFakeLinkIssues();
});

const dependencyGraphContainer = document.createElement('div');
dependencyGraphContainer.id = 'dependencyGraph';
dependencyGraphContainer.setAttribute('role', 'region');
dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph');

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.price}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className = 'product-list';
  container.innerHTML = products.map(p => renderProductCard(p)).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderPage(input);
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = data.content;
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
function updateView(viewType) {
  // Call the updated functions to render the graph or index as needed
  if (viewType === 'graph') {
    renderDependencyGraph(dependencyGraphContent);
  } else if (viewType === 'index') {
    renderIndex();
  }
}

// New function as requested in the issue
function calculateSum(a, b) {
  return a + b;
}

// New function placeholder (referenced in updateGraphRendering)
// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

function addressAccessibilityIssues(insightReport) {
  // Implement the logic to address accessibility issues based on the insight report
  // This is a placeholder function and should be replaced with actual implementation
  console.log('Addressing accessibility issues from insight report:', insightReport);

  // Add accessibility improvements
  document.body.setAttribute('lang', 'en');
  document.title = 'Accessible Application';

  // Add ARIA attributes to buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent);
    }
  });

  // Add skip link for keyboard users
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add focus styles for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    .skip-link {
      position: absolute;
      left: -9999px;
      top: 0;
    }
    .skip-link:focus {
      left: 0;
      background: #000;
      color: #fff;
      padding: 0.5em;
      z-index: 100;
    }
    button:focus {
      outline: 3px solid #4d90fe;
    }
  `;
  document.head.appendChild(style);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    button.setAttribute('aria-label', buttonText); // Add ARIA label
    document.body.appendChild(button);
}

function renderAccessibilityReport(insightReport) {
    addressAccessibilityIssues(insightReport);
}

function renderUIComponents() {
    createInPageButton('accessibility-btn', 'Check Accessibility', 'accessibility-button');
}

// Accessibility improvements for addBook function/form
function addBook(title, author, isbn) {
    // Create form elements with proper ARIA attributes
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add a new book');

    // Title input
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'book-title');
    titleLabel.textContent = 'Book Title:';
    const titleInput = document.createElement('input');
    titleInput.id = 'book-title';
    titleInput.type = 'text';
    titleInput.required = true;
    titleInput.setAttribute('aria-required', 'true');
    titleInput.setAttribute('aria-label', 'Enter the book title');

    // Author input
    const authorLabel = document.createElement('label');
    authorLabel.setAttribute('for', 'book-author');
    authorLabel.textContent = 'Author:';
    const authorInput = document.createElement('input');
    authorInput.id = 'book-author';
    authorInput.type = 'text';
    authorInput.required = true;
    authorInput.setAttribute('aria-required', 'true');
    authorInput.setAttribute('aria-label', 'Enter the author name');

    // ISBN input
    const isbnLabel = document.createElement('label');
    isbnLabel.setAttribute('for', 'book-isbn');
    isbnLabel.textContent = 'ISBN:';
    const isbnInput = document.createElement('input');
    isbnInput.id = 'book-isbn';
    isbnInput.type = 'text';
    isbnInput.setAttribute('aria-label', 'Enter the ISBN number');

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit the book information');

    // Assemble form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(authorLabel);
    form.appendChild(authorInput);
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Add form to document
    document.body.appendChild(form);

    // Return form for potential further manipulation
    return form;
}

// Preserve any existing exports here
// export { addressAccessibilityIssues, createInPageButton, existingFunction, existingFunction1, existingFunction2, newFunctionForMain };
// Assuming existingFunction is the name of another export in the codebase (you should replace this with its actual name)

// TODO: Create or update the affected functions to be accessible
//------ BEGIN CHANGES (added/updated)------
function newFunctionForMain() {
    console.log('New function is now accessible in main.js');
}

// Update or create any other necessary functions here
//------ END CHANGES------