// Comments and existing code should be preserved as-is

// Harvest and upgrade logic
function harvest(resource, multiplier = 1) {
  if (typeof resource !== 'number' || resource < 0) {
    return 0;
  }
  const harvested = Math.floor(resource * multiplier);
  console.log(`Harvested ${harvested} resources`);
  return harvested;
}

function upgrade(currentLevel, successRate = 0.8) {
  if (typeof currentLevel !== 'number' || currentLevel < 0) {
    return 1;
  }
  const roll = Math.random();
  if (roll < successRate) {
    const newLevel = currentLevel + 1;
    console.log(`Upgrade successful! Level: ${currentLevel} -> ${newLevel}`);
    return newLevel;
  }
  console.log(`Upgrade failed. Level remained at ${currentLevel}`);
  return currentLevel;
}

// Node.js functions for dependency visualization tool
const fs = require('fs');
const path = require('path');

// New function to visualize the dependency tree

// Load landmarks from file
function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  return landmarks.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Process and filter landmarks

// Visualize the dependency tree
function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // TODO: Add code here to fix accessibility issues
}

// Main entry point for dependency visualization tool
export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  harvest: function(resource, multiplier) {
    return harvest(resource, multiplier);
  },

  upgrade: function(currentLevel, successRate) {
    return upgrade(currentLevel, successRate);
  },

  // Add your new functions here
  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  }
};

// Utilities

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

export function rotateBack() {
  console.log('Reverting back the rotation.');
}