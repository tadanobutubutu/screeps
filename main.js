import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

// ... (preserve all existing code, exports, and functions from current main.js)

function addBook(book) {
  // Create a new list item
  const listItem = document.createElement('li');
  listItem.textContent = `${book.title} by ${book.author}`;

  // Add accessibility attributes
  listItem.setAttribute('role', 'option');
  listItem.setAttribute('aria-selected', 'false');
  listItem.setAttribute('tabindex', '-1');

  // Append to the book list
  const bookList = document.getElementById('book-list');
  if (bookList) {
    bookList.appendChild(listItem);
  }

  // Update UI
  updateBookListUI();
}

function updateBookListUI() {
  // Example: Update the count of books
  const bookCount = document.getElementById('book-count');
  const bookList = document.getElementById('book-list');
  if (bookCount && bookList) {
    const count = bookList.children.length;
    bookCount.textContent = `Total Books: ${count}`;
  }
}

/* ... (rest of the existing code remains unchanged) */

/**
 * Gets the language attribute value
 * @returns {string} Language code (e.g., 'en')
 */
function getLangAttribute() {
  // Attempt to get from <html> tag or default to 'en'
  const htmlLang = document.documentElement.lang;
  return htmlLang || 'en';
}

/**
 * Adds the language attribute to the HTML element
 */
function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', getLangAttribute());
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table passes basic accessibility checks
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) return false;
  // Check for scope on headers
  const headers = table.querySelectorAll('th');
  for (const th of headers) {
    if (!th.hasAttribute('scope')) return false;
  }
  return true;
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table) return false;
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) return false;
  // Check that all rows have the same number of cells
  const rows = tbody.querySelectorAll('tr');
  let expectedCellCount = -1;
  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    if (expectedCellCount === -1) {
      expectedCellCount = cells.length;
    } else if (cells.length !== expectedCellCount) {
      return false;
    }
  }
  return true;
}

/**
 * Adds a main landmark to the page
 */
function addMainLandmark() {
  // Check if main already exists
  if (document.querySelector('main')) return;
  const main = document.createElement('main');
  main.id = 'main-content';
  // Wrap existing content (simplified)
  while (document.body.firstChild) {
    main.appendChild(document.body.firstChild);
  }
  document.body.appendChild(main);
}

/**
 * Validates landmark presence
 * @returns {boolean} True if main landmark exists
 */
function validateLandmark() {
  return !!document.querySelector('main');
}

/**
 * Validates landmark structure
 * @returns {boolean} True if landmark has content
 */
function validateLandmarkStructure() {
  const main = document.querySelector('main');
  return main && main.children.length > 0;
}

/**
 * Validates landmark attributes
 * @returns {boolean} True if landmark has correct role
 */
function validateLandmarkAttributes() {
  const main = document.querySelector('main');
  if (!main) return false;
  // Ensure role is set (though native main element has implicit role)
  if (!main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  return true;
}

/**
 * Gets accessible name from SVG
 * @param {SVGElement} svg - The SVG element
 * @returns {string} Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  // Prefer title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  // Fallback to aria-label
  return svg.getAttribute('aria-label') || '';
}

/**
 * Sets attributes on SVG for accessibility
 * @param {SVGElement} svg - The SVG element
 * @param {Object} attributes - Key-value pairs of attributes to set
 */
function setSvgAttributes(svg, attributes) {
  if (!svg) return;
  Object.entries(attributes).forEach(([key, value]) => {
    svg.setAttribute(key, value);
  });
}

/**
 * Creates an in-page button (e.g., back to top)
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Back to top';
  btn.setAttribute('aria-label', 'Return to top of page');
  btn.style.position = 'fixed';
  btn.style.bottom = '2rem';
  btn.style.right = '2rem';
  btn.style.zIndex = '1000';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  return btn;
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  // Check for visible text
  const text = link.textContent.trim();
  if (!text) return false;
  // Check for non-empty href
  const href = link.getAttribute('href');
  if (!href || href === '#') return false;
  return true;
}

/**
 * Handles fake links (e.g., href="#") to prevent jumps
 * @param {Event} event - The click event
 */
function handleFakeLinks(event) {
  const link = event.target.closest('a[href="#"]');
  if (link) {
    event.preventDefault();
    // Optionally focus an element or do nothing
  }
}