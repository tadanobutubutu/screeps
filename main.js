Looking at the issue, I need to implement harvest and upgrade logic in main.js. The `=======` appears to be a git conflict marker that needs to be removed. I'll preserve all existing code and add the harvest/upgrade implementation.

```javascript
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

// Harvest and upgrade logic implementation
const creepRoles = {
  HARVESTER: 'harvester',
  UPGRADER: 'upgrader',
  BUILDER: 'builder'
};

function runHarvestAndUpgradeLogic() {
  const room = Game.rooms['W0N0'];
  if (!room) return;

  const creeps = Object.values(Game.creeps);
  const harvesters = creeps.filter(c => c.memory.role === creepRoles.HARVESTER);
  const upgraders = creeps.filter(c => c.memory.role === creepRoles.UPGRADER);
  const sources = room.find(FIND_SOURCES);
  const controller = room.controller;

  // Assign harvesters to sources
  sources.forEach((source, index) => {
    const assignedHarvester = harvesters.find(c => c.memory.sourceIndex === index);
    if (!assignedHarvester && harvesters.length > 0) {
      const harvester = harvesters.pop();
      harvester.memory.role = creepRoles.HARVESTER;
      harvester.memory.sourceIndex = index;
    }
  });

  // Run harvester logic
  harvesters.forEach(harvester => {
    if (harvester.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      const sourceIndex = harvester.memory.sourceIndex;
      const source = sources[sourceIndex];
      if (source) {
        if (harvester.harvest(source) === ERR_NOT_IN_RANGE) {
          harvester.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    } else {
      const targets = room.find(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN
      });
      const spawn = Game.spawns['Spawn1'];
      if (spawn && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (harvester.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          harvester.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  });

  // Run upgrader logic
  upgraders.forEach(upgrader => {
    if (upgrader.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      const source = sources[0];
      if (source) {
        if (upgrader.harvest(source) === ERR_NOT_IN_RANGE) {
          upgrader.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
      }
    } else {
      if (controller) {
        if (upgrader.upgradeController(controller) === ERR_NOT_IN_RANGE) {
          upgrader.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  });
}

// Module exports for testing
module.exports = {
  creepRoles,
  runHarvestAndUpgradeLogic,
  main,
  getDependencyDepth,
  renderDependencyGraph,
  getLandmarks,
  addLandmark,
  removeLandmark,
  isLatitudeValid,
  isLongitudeValid,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  getUniqueLandmarks,
  validateLink,
  handleFakeLinks,
  addLandmarkRegionToElement,
  displayModuleStructure
};

// Main module for calculator operations
// Main entry point for dependency visualization tool

const fs = require('fs');
const path = require('path');

/**
 * Calculates the depth of dependency tree
 * @param {Object} dependencies - The dependency object
 * @param {string} currentKey - Current key being processed
 * @returns {number} Maximum depth of the dependency tree
 */
function getDependencyDepth(dependencies, currentKey = '') {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  
  let maxDepth = 0;
  const keys = Object.keys(dependencies);
  
  keys.forEach(key => {
    const value = dependencies[key];
    if (typeof value === 'object' && value !== null) {
      const nestedDepth = getDependencyDepth(value, key);
      maxDepth = Math.max(maxDepth, nestedDepth + 1);
    }
  });
  
  return maxDepth;
}

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
// TODO: Address accessibility issues from insight report

/**
 * Renders a dependency graph as ASCII art for debugging purposes.
 * @param {Object} dependencies - The dependency object
 * @param {string} prefix - Current prefix for indentation
 * @param {boolean} isLast - Whether this is the last item at current level
 * @returns {string} ASCII representation of the dependency graph
 */
function renderDependencyGraph(dependencies, prefix = '', isLast = true) {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }
  
  let output = '';
  const keys = Object.keys(dependencies);
  
  keys.forEach((key, index) => {
    const isLastItem = index === keys.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const value = dependencies[key];
    
    output += prefix + connector + key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      output += '/\n';
      const extension = isLast ? '    ' : '│   ';
      output += renderDependencyGraph(value, prefix + extension, isLastItem);
    } else {
      output += ' -> ' + value + '\n';
    }
  });
  
  return output;
}

function newFunction() {
  // Add your new function implementation here
}

function greet(name) {
  return `Hello, ${name}!`;
}

// NEW FUNCTION ADDED FROM ORIGIN/MAIN
function newAccessibleFunction() {
  // Add your new function implementation here
  return true;
}

function addLandmarkRegionToElement(element, role, label) {
  // Existing function preserved
  if (!element) return;
  element.setAttribute('role', role);
  if (label) {
    element.setAttribute('aria-label', label);
  }
}

// Internal storage for landmark regions
const landmarks = [];

// Function to add a landmark, using the following order: validate and add to storage
function addLandmark(landmark) {
  if (validateLandmark(landmark)) {
    landmarks.push(landmark);
    return true;
  }
  return false;
}

// Function to get all landmarks
function getLandmarks() {
  return [...landmarks];
}

// Function to remove a landmark by ID
function removeLandmark(id) {
  const index = landmarks.findIndex(landmark => landmark.id === id);
  if (index !== -1) {
    landmarks.splice(index, 1);
    return true;
  }
  return false;
}

function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') return false;
  const validRoles = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'banner', 'complementary', 'contentinfo', 'form', 'search'];
  if (landmark.role && !validRoles.includes(landmark.role)) return false;
  return true;
}

function isLatitudeValid(lat) {
  // Existing validation function preserved
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
}

function isLongitudeValid(lng) {
  // Existing validation function preserved
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return 'en';
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Navigate within page');
  return button;
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table || table.nodeType !== Node.ELEMENT_NODE || table.tagName !== 'TABLE') {
    return false;
  }
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.getAttribute('summary') !== null || table.getAttribute('aria-describedby') !== null;
  
  return hasCaption || hasSummary;
}

function validateTableStructure(table) {
  if (!validateTableAccessibility(table)) {
    return false;
  }
  
  const hasTbody = table.querySelector('tbody') !== null;
  const rows = table.querySelectorAll('tr');
  
  for (let row of rows) {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      return false;
    }
  }
  
  return hasTbody || rows.length > 0;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svg, context) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  const desc = svg.querySelector('desc');
  
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  if (desc && desc.textContent.trim() && context) {
    return context;
  }
  
  return svg.getAttribute('aria-label') || svg.id || '';
}

function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria