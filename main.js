const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

// existing functions and variables, if any

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
//  * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/**
 * Function to check the structure of a landmark object.
 * @param {Object} landmark - A landmark object to check.
//  * @returns {boolean} Returns true if the landmark object has required properties: name and coordinates; otherwise, false.
 */
function landmarkStructureCheck(landmark) {
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
}

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

// existing exports, if any

// Testing the landmarkStructureCheck and ensureUniqueLandmarks functions:
//
// To test these functions, add tests in a separate file (e.g., /tests/main.test.js)

module.exports = {
    checkLandmarkElement,
    landmarkStructureCheck,
    ensureUniqueLandmarks
};