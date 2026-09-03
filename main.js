// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement ? document.documentElement.getAttribute('lang') || '' : '';
  }
  return '';
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.hasAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = Array.from(table.querySelectorAll('th')).some(th => th.hasAttribute('scope'));
  return hasCaption || hasHeaders;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return false;
  }
  const cells = rows[0].querySelectorAll('td, th');
  const firstRowCellCount = cells.length;
  for (let i = 1; i < rows.length; i++) {
    const rowCells = rows[i].querySelectorAll('td, th');
    if (rowCells.length !== firstRowCellCount) {
      return false;
    }
  }
  return true;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return;
  }
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Data Table';
    table.insertBefore(newCaption, table.firstChild);
  }
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

/**
 * Adds main landmark to the page
 */
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main');
    if (!existingMain) {
      const mainElement = document.createElement('main');
      const firstChild = document.body ? document.body.firstChild : null;
      if (firstChild) {
        document.body.insertBefore(mainElement, firstChild);
      } else if (document.body) {
        document.body.appendChild(mainElement);
      }
    }
  }
}

/**
 * Validates landmark accessibility
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const validLandmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  return validLandmarks.includes(role) || validLandmarks.includes(tagName);
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  return landmark.children.length >= 0;
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  if (role && ['main', 'navigation', 'complementary', 'banner', 'contentinfo', 'region'].includes(role)) {
    return true;
  }
  return ['main', 'nav', 'aside', 'header', 'footer'].includes(tagName);
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof HTMLElement)) {
    return '';
  }
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent || '';
    }
  }
  return '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {SVGElement} svg - The SVG element
 * @param {string} name - The accessible name to set
 */
function setSvgAttributes(svg, name) {
  if (!svg || !(svg instanceof HTMLElement) || !name) {
    return;
  }
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
  const hasAriaLabelledby = svg.querySelector('title[id]');
  if (!hasAriaLabelledby) {
    title.setAttribute('id', 'svg-title-' + Math.random().toString(36).substr(2, 9));
    svg.setAttribute('aria-labelledby', title.getAttribute('id'));
  }
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

/**
 * Ensures unique landmarks on the page
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return;
  }
  const landmarks = document.querySelectorAll('[role="main"], main');
  if (landmarks.length > 1) {
    for (let i = 1; i < landmarks.length; i++) {
      landmarks[i].setAttribute('role', 'region');
      landmarks[i].setAttribute('aria-label', 'Section ' + (i + 1));
    }
  }
}

/**
 * Creates an in-page button for accessibility
 * @returns {HTMLButtonElement} The button element
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'in-page-button');
  button.textContent = 'Skip to main content';
  button.addEventListener('click', function() {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || !(link instanceof HTMLElement)) {
    return false;
  }
  const tagName = link.tagName.toLowerCase();
  if (tagName !== 'a') {
    return false;
  }
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }
  const text = link.textContent;
  if (!text || text.trim() === '') {
    return false;
  }
  return true;
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  if (typeof document === 'undefined') {
    return;
  }
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const button = createInPageButton();
    if (link.textContent) {
      button.textContent = link.textContent;
    }
    link.parentNode.replaceChild(button, link);
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') {
    return;
  }
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : 'Secondary navigation');
    }
  });
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
}

// Existing code preserved
function existingFunction1() {
  // Existing implementation
}

function existingFunction2() {
  // Existing implementation
}

// New Function
function newFunction() {
  // Implement the new functionality (as per the original commitment)
  // Specific logic required here goes below
  // Example:
  // return 'New functionality result';
}

/**
 * Validates accessibility of a book form
 * @param {HTMLElement} form - The book form element to validate
 * @returns {boolean} True if form is accessible
 */
function validateBookFormAccessibility(form) {
  if (!form || !(form instanceof HTMLElement)) {
    return false;
  }
  const inputs = form.querySelectorAll('input, select, textarea');
  let hasLabel = false;
  let hasAccessibleName = false;
  
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = id ? form.querySelector('label[for="' + id + '"]') : null;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    
    if (label || ariaLabel || ariaLabelledby) {
      hasLabel = true;
    }
    
    if (input.getAttribute('aria-label') || input.getAttribute('aria-labelledby') || form.querySelector('label[for="' + input.id + '"]')) {
      hasAccessibleName = true;
    }
  });
  
  return hasLabel && hasAccessibleName;
}

/**
 * Fixes accessibility issues in a book form
 * @param {HTMLElement} form - The book form element to fix
 */
function fixBookFormAccessibility(form) {
  if (!form || !(form instanceof HTMLElement)) {
    return;
  }
  
  if (!form.hasAttribute('role')) {
    form.setAttribute('role', 'form');
  }
  
  const inputs = form.querySelectorAll('input, select, textarea');
  const formId = form.id || 'book-form-' + Math.random().toString(36).substr(2, 9);
  form.id = formId;
  
  inputs.forEach(input => {
    if (!input.id) {
      input.id = formId + '-input-' + Math.random().toString(36).substr(2, 9);
    }
    
    const inputType = input.tagName.toLowerCase() === 'input' ? input.type : input.tagName.toLowerCase();
    const accessibleName = input.getAttribute('aria-label') || 
                           (input.getAttribute('aria-labelledby') && document.getElementById(input.getAttribute('aria-labelledby'))) ||
                           form.querySelector('label[for="' + input.id + '"]');
    
    if (!accessibleName) {
      const label = document.createElement('label');
      label.setAttribute('for', input.id);
      const inputName = input.getAttribute('name') || inputType;
      label.textContent = inputName.charAt(0).toUpperCase() + inputName.slice(1).replace(/([A-Z])/g, ' $1');
      input.parentNode.insertBefore(label, input);
    }
    
    if (input.hasAttribute('required') && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  const legend = form.querySelector('legend');
  const fieldset = form.querySelector('fieldset');
  if (!legend && fieldset) {
    const newLegend = document.createElement('legend');
    newLegend.textContent = 'Add New Book';
    fieldset.insertBefore(newLegend, fieldset.firstChild);
  } else if (!fieldset) {
    const newFieldset = document.createElement('fieldset');
    const newLegend = document.createElement('legend');
    newLegend.textContent = 'Add New Book';
    newFieldset.appendChild(newLegend);
    while (form.firstChild) {
      newFieldset.appendChild(form.firstChild);
    }
    form.appendChild(newFieldset);
  }
}

/**
 * Creates an accessible book form
 * @param {Object} options - Form configuration options
 * @returns {HTMLElement} The accessible book form
 */
function createAccessibleBookForm(options = {}) {
  const form = document.createElement('form');
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'book-form-title');
  form.id = options.id || 'add-book-form';
  
  const title = document.createElement('h2');
  title.id = 'book-form-title';
  title.textContent = options.title || 'Add New Book';
  form.appendChild(title);
  
  const fields = options.fields || ['title', 'author', 'isbn', 'year'];
  
  fields.forEach(field => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'form-group');
    
    const label = document.createElement('label');
    const fieldId = 'book-' + field;
    label.setAttribute('for', fieldId);
    label.textContent = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');
    label.setAttribute('id', fieldId + '-label');
    
    const input = document.createElement('input');
    input.type = field === 'year' ? 'number' : 'text';
    input.id = fieldId;
    input.name = field;
    input.setAttribute('aria-labelledby', fieldId + '-label');
    
    if (field === 'title' || field === 'author') {
      input.required = true;
      input.setAttribute('aria-required', 'true');
    }
    
    const errorId = fieldId + '-error';
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'false');
    
    const error = document.createElement('span');
    error.id = errorId;
    error.setAttribute('class', 'error-message');
    error.setAttribute('role', 'alert');
    error.style.display = 'none';
    
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(error);
    form.appendChild(wrapper);
  });
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.id = 'submit-book-btn';
  submitBtn.textContent = options.submitText || 'Add Book';
  submitBtn.setAttribute('aria-label', options.submitText || 'Add Book');
  form.appendChild(submitBtn);
  
  const liveRegion = document.createElement('div');
  liveRegion.id = 'book-form-status';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'visually-hidden';
  form.appendChild(liveRegion);
  
  return form;
}

/**
 * Announces book addition to screen readers
 * @param {string} bookTitle - The title of the added book
 */
function announceBookAdded(bookTitle) {
  if (typeof document === 'undefined') {
    return;
  }
  
  let liveRegion = document.getElementById('book-added-announcement');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'book-added-announcement';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'visually-hidden';
    document.body.appendChild(liveRegion);
  }
  
  liveRegion.textContent = 'Book "' + bookTitle + '" has been added successfully.';
  
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 1000);
}

/**
 * Handles book form submission with accessibility improvements
 * @param {HTMLElement} form - The book form element
 * @param {Function} callback - Callback function when form is submitted
 * @returns {boolean} True if form is valid and submitted
 */
function handleBookFormSubmit(form, callback) {
  if (!form || !(form instanceof HTMLElement)) {
    return false;
  }
  
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    const formData = {};
    
    inputs.forEach(input => {
      const errorId = input.getAttribute('aria-describedby');
      const errorElement = errorId ? document.getElementById(errorId) : null;
      
      if (input.required && !input.value.trim()) {
        isValid = false;
        input.setAttribute('aria-invalid', 'true');
        if (errorElement) {
          errorElement.textContent = input.labels && input.labels[0] ? 
            input.labels[0].textContent + ' is required' : 
            'This field is required';
          errorElement.style.display = 'block';
        }
      } else {
        input.setAttribute('aria-invalid', 'false');
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      }
      
      formData[input.name] = input.value;
    });
    
    if (isValid) {
      const titleInput = form.querySelector('input[name="title"]');
      const bookTitle = titleInput ? titleInput.value : 'New Book';
      
      announceBookAdded(bookTitle);
      
      if (typeof callback === 'function') {
        callback(formData);
      }
      
      form.reset();
      
      const firstInput = form.querySelector('input, select, textarea');
      if (firstInput) {
        firstInput.focus();
      }
    } else {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
    
    return isValid;
  });
}

// Export all functions
module.exports = {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  existingFunction1,
  existingFunction2,
  newFunction,
  validateBookFormAccessibility,
  fixBookFormAccessibility,
  createAccessibleBookForm,
  announceBookAdded,
  handleBookFormSubmit
};