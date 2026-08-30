const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons
const createInPageButton = (options) => {
  // ... (existing code remains unchanged)
};

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // ... (existing code remains unchanged)
}

function addLangAttribute(htmlElement) {
  // ... (existing code remains unchanged)
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  // ... (existing code remains unchanged)
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  // ... (existing code remains unchanged)
}

/**
 * Function to perform accessibility checks on tables.
 * @param {HTMLElement} table - The table element to check.
 * @returns {boolean} Returns true if the table passes accessibility checks; otherwise, false.
 */
function checkTableAccessibility(table) {
  if (!(table instanceof HTMLElement) || table.tagName.toLowerCase() !== 'table') {
    console.error('checkTableAccessibility: Invalid table element provided');
    return false;
  }

  // Check for a caption element
  const caption = table.querySelector('caption');
  if (!caption) {
    console.error('Table is missing a caption');
    return false;
  }

  // Check for at least one header row
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) {
    console.error('Table is missing a header row');
    return false;
  }

  // Check for at least one cell in the header row
  const headerCells = headerRow.querySelectorAll('th');
  if (headerCells.length === 0) {
    console.error('Header row is missing cells');
    return false;
  }

  // Check for at least one cell in the body rows
  const bodyRows = table.querySelectorAll('tbody tr');
  bodyRows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length === 0) {
      console.error('Table body row is missing cells');
      return false;
    }
  });

  // Additional accessibility checks can be added here

  return true;
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  checkTableAccessibility
};