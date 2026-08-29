const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark'); // assuming there's another file for Landmark component

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
 * Function to check the landmark structure.
 * @param {object} landmark - The landmark object to be checked.
 * @returns {boolean} Returns true if the landmark has required properties: name and coordinates; otherwise, false.
 */
const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

/**
 * Function to ensure unique landmarks based on their ID or name.
 * @param {array} landmarks - An array of landmark objects to check for uniqueness.
 * @returns {array} Returns an array of unique landmark objects.
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

module.exports = {
    checkLandmarkElement,
    landmarkStructureCheck,
    ensureUniqueLandmarks
};