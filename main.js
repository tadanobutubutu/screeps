import React from 'react';
import ReactDOM from 'react-dom';
import Landmark from './Landmark'; // assuming there's another file for Landmark component

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

// Testing the checkLandmarkElement function:
//
// To test this function, we could create a test file with the following content:
const test = require('jest');
const ReactDOM = require('react-dom');
const { checkLandmarkElement } = require('./main');
const landmark = document.createElement('div');
landmark.id = 'test-landmark';
document.body.appendChild(landmark);
test.test('Check landmark element', () => {
  expect(checkLandmarkElement('test-landmark')).toBeTruthy();
});
test.run();