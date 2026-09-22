const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./landmark.js'); // Import Landmark module

// Import the new function
const createInPageButton = require('./createInPageButton');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons (from createInPageButton.js)

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

function addLangAttribute(htmlElement, lang = 'en') {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('Invalid HTML element provided');
    return;
  }

  if (lang) {
    htmlElement.lang = lang; // Default to English if not specified
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.querySelector(`#${id}`);
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

// Harvest and upgrade logic
/**
 * Harvests a resource by a specified amount.
 * @param {string} resource - The name/type of the resource to harvest.
 * @param {number} amount - The amount of resource to harvest (default: 1).
 * @returns {Object|null} Returns an object with resource details and timestamp, or null if invalid.
 */
function harvestResource(resource, amount = 1) {
  if (!resource || typeof resource !== 'string') {
    console.error('harvestResource: Invalid resource provided');
    return null;
  }

  if (typeof amount !== 'number' || amount <= 0) {
    console.error('harvestResource: Amount must be a positive number');
    return null;
  }

  return {
    resource,
    amount,
    timestamp: Date.now()
  };
}

/**
 * Upgrades an item to a specified level.
 * @param {Object} item - The item object to upgrade.
 * @param {number} level - The number of levels to upgrade (default: 1).
 * @returns {Object|null} Returns the upgraded item with new level and timestamp, or null if invalid.
 */
function upgradeItem(item, level = 1) {
  if (!item || typeof item !== 'object') {
    console.error('upgradeItem: Invalid item provided');
    return null;
  }

  if (typeof level !== 'number' || level <= 0) {
    console.error('upgradeItem: Level must be a positive number');
    return null;
  }

  return {
    ...item,
    level: (item.level || 0) + level,
    upgradedAt: Date.now()
  };
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  harvestResource,
  upgradeItem
};