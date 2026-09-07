// Address accessibility issues from insight report

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/**
 * Function to check the landmark structure.
 * @param {object} landmark - The landmark object to validate.
 * @returns {boolean} Returns true if the landmark has required properties: name and coordinates; otherwise, false.
 */
const landmarkStructureCheck = (landmark) => {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Function to ensure unique landmarks in an array.
 * @param {Array<object>} landmarks - The array of landmark objects.
 * @returns {Array<object>} Returns an array of unique landmarks.
 */
function ensureUniqueLandmarks(landmarks) {
    const uniqueLandmarks = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        // Use id if available, otherwise fall back to name
        const key = landmark.id || landmark.name;

        if (key && !seen.has(key)) {
            seen.add(key);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

module.exports = {
    Landmark, // assuming Landmark is a component
    checkLandmarkElement,
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    divide
};