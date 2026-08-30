const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// TODO: This is the existing code that needs to be preserved
// _Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
// <!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// <!--- START ADDITIONAL FUNCTION --->

// New Function to create additional SVG icons
const createAdditionalIcon = (options) => {
  const { id, src, alt, className } = options;

  if (!id || !src || !alt || !className) {
    throw new Error('Missing required props for createAdditionalIcon: id, src, alt, className');
  }

  icons[id] = (
    <svg
      id={id}
      className={className}
      src={src}
      width="24"
      height="24"
      role="img"
      aria-labelledby={`svg-icon-${id} ${id}-description`}
    >
      <title id={`${id}-title`}>{alt}</title>
      <desc id={`${id}-description`}>{alt}</desc>
    </svg>
  );
};

// New Function to clear the local storage
function clearLocalStorage() {
  localStorage.clear();
}

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const landmarkStructureCheck = (landmark) => {
    // Check landmark properties here
    // ...
    return true; // Add your own check logic
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  // Ensure the landmarks are unique
  const ensureUniqueLandmarks = (landmarks) => {
    // Add your own unique landmark logic here
    // ...
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
}

function addLangAttribute(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

// New export for createAdditionalIcon function
exports.createAdditionalIcon = createAdditionalIcon;
exports.clearLocalStorage = clearLocalStorage; // New export for clearLocalStorage function

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum
};