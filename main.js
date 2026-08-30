const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';
import { addLangAttribute } from './utils/accessibility.js'; // New import for the added function

// Function to create in-page buttons
// (... Previous code for createInPageButton function remained unchanged)

// Placeholder for the affected SVGs
const icons = {};

// New function to address REACT_015: Add lang attribute to HTML element
function addLangAttributeToHTML(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// New function to address REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles(landmarkElement, landmarkRole) {
  // Check if the landmark element exists first
  if (checkLandmarkElement(landmarkElement)) {
    landmarkElement.setAttribute('role', landmarkRole);
  }
}

// New function to fix REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  // ... Add your own unique landmark logic here
  // ... Make sure to store unique landmark IDs in an object (e.g., landmarkIds)

  // Check if each landmark ID is unique
  const landmarkIds = Object.values(landmarks).map((landmark) => landmark.id);
  if (new Set(landmarkIds).size !== landmarkIds.length) {
    throw new Error('Landmarks must have unique IDs');
  }

  return landmarks;
}

// New function to address REACT_036: Fix 1 fake link issue
function isValidLink(href) {
  // A simple validation if the href has a `#` char
  // Add your own link validation logic here
  return /#/.test(href);
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function addAccessibleNamesForSVGs(svgId, svgTitle) {
  const svgElement = document.getElementById(svgId);
  if (svgElement) {
    svgElement.setAttribute('aria-label', svgTitle);
  }
}

// Function to address REACT_015, 036, 041
function addressAccessibilityIssues(htmlElement, svgId1, svgTitle1, svgId2, svgTitle2) {
  addLangAttributeToHTML(htmlElement);
  addAccessibleNamesForSVGs(svgId1, svgTitle1); // Address REACT_041
  addAccessibleNamesForSVGs(svgId2, svgTitle2); // Address REACT_041

  // Address REACT_036
  const allLinks = document.getElementsByTagName('a');
  for (let i = 0; i < allLinks.length; i++) {
    if (!isValidLink(allLinks[i].href)) {
      allLinks[i].setAttribute('href', '#');
    }
  }
}

// New module to export functions related to accessibility enhancements
module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  addressAccessibilityIssues
};