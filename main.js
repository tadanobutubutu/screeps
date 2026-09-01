const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Import dependency graph and index content modules
const dependencyGraphContent = require('./dependencyGraphContent');
const indexContent = require('./indexContent');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  // Validate input
  if (typeof htmlContent !== 'string') {
    throw new Error('HTML content must be a string');
  }

  const warnings = [];
  const foundLandmarks = {};

  // Check for each landmark element in the HTML content
  LANDMARK_ELEMENTS.forEach(landmark => {
    // Use case-insensitive regex to find landmark elements
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    }
  });

  // Check for required main landmark
  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  // Check for duplicate landmarks (potential issue)
  LANDMARK_ELEMENTS.forEach(landmark => {
    if (foundLandmarks[landmark] > 1) {
      warnings.push(`Multiple ${landmark} elements found`);
    }
  });

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation (combined with new approach)
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`];
  const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Rendering improved using indexContent directly
function renderIndexView() {
  return indexContent;
}

// Tower Defense Game Implementation
class TowerDefense {
  // ... (The existing code remains as is)
}

// Factory function to create a new TowerDefense game instance
function createTowerDefenseGame(path = []) {
  const game = new TowerDefense();
  game.init(path);
  return game;
}

// Tower type definitions (add TOWER_TYPES as a property of the exported Module)
const TOWER_TYPES = {
  basic: { damage: 10, range: 100, fireRate: 1000, cost: 50, label: 'Basic Tower' },
  sniper: { damage: 50, range: 250, fireRate: 500, cost: 100, label: 'Sniper Tower' },
  cannon: { damage: 25, range: 150, fireRate: 800, cost: 75, label: 'Cannon Tower' },
  ice: { damage: 5, range: 120, fireRate: 600, cost: 60, label: 'Ice Tower', slows: true }
};

// Enemy type definitions (add ENEMY_TYPES as a property of the exported Module)
const ENEMY_TYPES = {
  basic: { health: 100, speed: 1, reward: 50, label: 'Basic Enemy' },
  fast: { health: 50, speed: 2.5, reward: 25, label: 'Fast Enemy' },
  tank: { health: 300, speed: 0.7, reward: 100, label: 'Tank Enemy' },
  boss: { health: 1000, speed: 0.4, reward: 500, label: 'Boss Enemy' }
};

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  // ... (The existing code remains as is)
};

// New function to handle dynamic content updates (add updateLiveRegion as a property of the a11yStore object)
a11yStore.updateLiveRegion = function(message, priority = 'polite') {
  if (!this.liveRegion) return;
  this.announce(message, priority);
};

// New function to check landmark elements (add checkLandmarkElements as a method of the document object)
document.checkLandmarkElements = function(htmlContent) {
  return checkLandmarkElements(htmlContent);
};

// New function to add SVG accessibility props (add addSvgAccessibilityProps as a method of the document object)
document.addSvgAccessibilityProps = function(svg) {
  a11yStore.addSVGAccessibilityProps(svg);
};

module.exports = {
  checkLandmarkElements,
  createInPageButton,
  countDependencies,
  a11yStore,
  addLandmarkRegions,
  addressAccessibilityIssues,
  LANDMARK_ELEMENTS,
  getLangAttribute: a11yStore.getLangAttribute.bind(a11yStore),
  updateLiveRegion,
  addSvgAccessibilityProps,
  preserveExistingCode,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  checkLandmarkElementsInDom,
  renderIndexView,
  TOWER_TYPES,
  ENEMY_TYPES
};