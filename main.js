const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark'); // assuming there's another file for Landmark component

// existing functions and variables, if any

/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// existing exports, if any

// New function to check if a landmark has a valid structure
function isValidLandmark(landmark) {
  return landmarkStructureCheck(landmark) && checkLandmarkElement(landmark.id);
}

// Testing the isValidLandmark function:
//
// To test this function, we could create a test file with the following content:
const test = require('jest');
// const ReactDOM = require('react-dom'); // already defined above
// const { checkLandmarkElement, landmarkStructureCheck, isValidLandmark } = require('./main'); // not needed, function is in scope
const landmark = document.createElement('div');
landmark.id = 'test-landmark';
document.body.appendChild(landmark);
test.test('Check landmark validity', () => {
  expect(isValidLandmark({ id: 'test-landmark', name: 'Test Landmark', coordinates: { lat: 0, lng: 0 } })).toBeTruthy();
});
test.run();

const landmarkStructureCheck = (landmark) => {
  // Implement your logic for checking the landmark structure
  // For example, let's check if the landmark has required properties: name and coordinates
  if (!landmark.name || !landmark.coordinates) {
    return false;
  }
  return true;
};

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
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    isValidLandmark // Exporting the new function
};