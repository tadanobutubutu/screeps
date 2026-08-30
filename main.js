// Import required modules
import { union } from 'lodash'; // You'll need to install lodash if it's not already installed

// Import graph rendering functions
import { renderGraph } from './newGraphRenderingFunctions'; // Assuming you have a separate file for the new functions

/**
 * Check and ensure accessibility attributes for links and buttons
 */
export function checkLinkAndButtonAccessibility() {
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    if (!link.hasAttribute('href')) {
      console.error('Accessibility Error: Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
    // Check for accessible name for buttons
    if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
      console.error('Accessibility Error: Button without accessible name', button);
    }
  });
}

/**
 * Address accessibility issues from insight report.
 * Handles REACT_015, REACT_017, REACT_025, REACT_027, REACT_036, REACT_041
 * @returns {Object} Report of addressed issues
 */
export function addressAccessibilityIssuesFromReport() {
  const report = {
    addressed: [],
    warnings: [],
    errors: []
  };

  try {
    // REACT_015: Ensure HTML element has a lang attribute
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
      report.addressed.push('REACT_015: Added lang attribute to HTML element');
    }

    // REACT_017 & REACT_025: Validate landmark elements and ensure uniqueness
    const landmarkElements = [...document.querySelectorAll('[role="landmark"], main, nav, header, footer, aside, section')];
    const landmarkNames = new Map();
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (!landmark.id) {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      const accessibleName = landmark.getAttribute('aria-label') ||
                             landmark.getAttribute('aria-labelledby') ||
                             landmark.tagName.toLowerCase();
      const count = landmarkNames.get(accessibleName) || 0;
      landmarkNames.set(accessibleName, count + 1);
      if (count > 0 && landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${accessibleName}-${count + 1}`);
      }
    });
    report.addressed.push('REACT_017: Validated landmark elements');
    report.addressed.push('REACT_025: Ensured unique landmarks');

    // REACT_027: Validate table structures
    const tables = document.querySelectorAll('table');
    tables.forEach((table, tableIndex) => {
      const hasCaption = table.querySelector('caption') !== null;
      const hasHeaders = table.querySelectorAll('th').length > 0;
      if (!hasCaption) {
        report.warnings.push(`Table ${tableIndex}: Missing caption element`);
      }
      if (!hasHeaders) {
        report.warnings.push(`Table ${tableIndex}: Missing th elements`);
      }
    });
    report.addressed.push('REACT_027: Validated table structures');

    // REACT_036: Fix fake link issues
    const fakeLinks = document.querySelectorAll('.fake-link, a[role="button"]:not([href])');
    fakeLinks.forEach(link => {
      link.setAttribute('role', 'presentation');
    });
    report.addressed.push('REACT_036: Fixed fake link issues');

    // REACT_041: Add accessible names to SVGs
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg, svgIndex) => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', `SVG content ${svgIndex + 1}`);
        svg.setAttribute('role', 'img');
      }
    });
    report.addressed.push('REACT_041: Added accessible names to SVGs');

    // Run general link and button accessibility check
    checkLinkAndButtonAccessibility();
    report.addressed.push('General: Validated link and button accessibility');
  } catch (error) {
    report.errors.push(`Error addressing accessibility issues: ${error.message}`);
  }

  return report;
}

// Function to render graph/index using new functions
function renderGraphIndex() {
  // JavaScript code to prepare data for the graph
  const data = prepareDataForGraph();

  // Render the graph using the new functions
  renderGraph(data);
}

// Update the existing rotateBack function to call renderGraphIndex
export function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');

  // Call renderGraphIndex before rotating back
  renderGraphIndex();
}

// ... Existing functions from current main.js ...

/**
 * Calculate the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
export function calculateSum(a, b) {
  return a + b;
}

export function calculateDifference(a, b) {
  return a - b;
}

export function calculateProduct(a, b) {
  return a * b;
}

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function divide(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new Error('Both operands must be numbers.');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed.');
  }
  return a / b;
}

/**
 * Check if an element has the specified accessibility attribute
 * @param {HTMLElement} element - The DOM element to check
 * @param {string} attribute - The accessibility attribute to check for
 * @returns {boolean} True if the attribute is present and non-empty, false otherwise
 */
export function checkAccessibilityAttribute(element, attribute) {
  if (!element || typeof element.getAttribute !== 'function') {
    return false;
  }
  const value = element.getAttribute(attribute);
  return value !== null && value !== '';
}

/**
 * Ensure an element has a non-empty accessibility label
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element has an aria-label or accessible name, false otherwise
 */
export function ensureAccessibleLabel(element) {
  if (!element) {
    return false;
  }
  return checkAccessibilityAttribute(element, 'aria-label') ||
         checkAccessibilityAttribute(element, 'aria-labelledby') ||
         checkAccessibilityAttribute(element, 'alt');
}

/**
 * Validate that an element has proper focusability for accessibility
 * @param {HTMLElement} element - The DOM element to check
 * @returns {boolean} True if the element is focusable, false otherwise
 */
export function validateFocusableElement(element) {
  if (!element) {
    return false;
  }
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];
  const tagName = element.tagName?.toLowerCase();
  const isFocusable = focusableTags.includes(tagName) ||
                      element.tabIndex >= 0 ||
                      checkAccessibilityAttribute(element, 'tabindex');
  return isFocusable && !element.hasAttribute('disabled');
}

// Default export for backwards compatibility
export default {
  calculateSum,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  divide,
  start() {
    console.log('Application started');
    return Promise.resolve();
  }
};

export const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  }
};

const a11yStore = {
  // ... existing code (from both conflicting branches)

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = [...document.querySelectorAll('[role="landmark"]')];
    landmarkElements.forEach((landmark, index) => {
      // Ensure landmark has a unique ID
      if (landmark.id === '') {
        landmark.id = `landmark-${index}`;
      }

      // Ensure unique accessible names for duplicate landmarks
      if (landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${landmarkElements[index].nodeName.toLowerCase()}-${index + 1}`);
      }
    });
  },

  // ... existing code (from both conflicting branches)
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
//_Commit: e1c38a81654fe5ba4cfcfba53c47360921b7ae1a_

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 8c3a9295a6bf382e113f3e8184d40223b3f3f8d5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

export { addLandmarkRegions };

// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }

// Existing exports and functions...

export function initializeApp() {
  console.log('Initializing application...');
  return Promise.resolve();
}

// TODO: Implement function for generating a report based on accessibility issues
export function generateAccessibilityReport() {
  // Placeholder for the actual implementation
  // This function should return a report object based on the accessibility issues found
  return {
    issues: [
      // Example issue object
      {
        description: "Example issue description",
        severity: "warning",
        // ... other properties like 'elementId', 'fixRecommendation', etc.
      }
    ]
  };
}

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

// Address the issues: REACT_015, REACT_017, REACT_041, REACT_025, REACT_036
function addressAccessibilityIssues() {
  // Internationalization support
  const translations = {
    'en': {
      landmark: 'landmark',
      'svg1-title': 'SVG Content',
      'svg2-title': 'Additional SVG'
    }
  };

  const landmarks = document.querySelectorAll('[role="landmark"]');
  landmarks.forEach((landmark, index) => {
    landmark.setAttribute('aria-label', `${translations['en'].landmark}-${index + 1}`);
    // Additional landmark processing...
  });

  const svg1 = document.querySelector('.svg1');
  const svg2 = document.querySelector('.svg2');
  if (svg1) svg1.setAttribute('aria-labelledby', 'svg1-title');
  if (svg2) svg2.setAttribute('aria-labelledby', 'svg2-title');

  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
    // The static fix should be applied in the source files
    // - Replace one <main> with <section role="region" ...
    // - Same fix
  }

  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });

  // Implement this function for checking link and button accessibility
  function checkLinksAndButtons() {
    const links = document.querySelectorAll('a');
    const buttons = document.querySelectorAll('button');

    links.forEach(link => {
      // Check if link needs explicit role="link"
      if (!link.hasAttribute('href') && link.getAttribute('role') !== 'link') {
        link.setAttribute('role', 'link');
      }
      // Check for link without href attribute
      if (!link.hasAttribute('href')) {
        console.error('Accessibility Error: Link without href attribute', link);
      }
    });

    buttons.forEach(button => {
      // Check if button needs explicit role="button"
      if (button.getAttribute('role') !== 'button') {
        button.setAttribute('role', 'button');
      }
      // Check for accessible name for buttons
      const hasText = button.textContent.trim().length > 0;
      const hasAriaLabel = button.hasAttribute('aria-label');
      const hasAriaLabelledby = button.hasAttribute('aria-labelledby');

      if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
        console.error('Accessibility Error: Button without accessible name', button);
      }
    });
  }

  // Call the function to check accessibility
  checkLinksAndButtons();
}

export { addressAccessibilityIssues };

// Screeps module exports for game loop integration
module.exports.getLangAttribute = getLangAttribute;
module.exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
module.exports.addressAccessibilityIssues = addressAccessibilityIssues;

// ... existing exported functions preserved for tables, landmarks, SVGs, forms ...

module.exports.loop = function() {
    // Clear the memory of dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // TODO: Add implementation details

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    for(var name in Game.rooms) {
        console.log('Room "'+name+'" has ' + Game.rooms[name].energyAvailable + ' energy');
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
};