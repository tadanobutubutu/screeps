// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

// Preserve existing functionality
module.exports = {
  // Existing exports preserved
};

// main.js - Combined utility and accessibility features

// TODO: Implement tower defense

/**
 * Counts the number of dependencies declared in a given module source.
 * Supports both CommonJS (`require(...)`) and ES Modules (`import ... from ...`,
 * `import '...'`) dependency syntaxes. Duplicate dependencies are counted only once.
 *
 * @param {string} source - The source code of the module to analyze.
 * @returns {number} The count of unique dependencies found in the source.
 */
function countDependencies(source) {
  if (typeof source !== 'string' || source.length === 0) {
    return 0;
  }

  const dependencies = new Set();

  // Match ES Module import statements:
  //   import foo from 'mod';
  //   import { a, b } from 'mod';
  //   import * as foo from 'mod';
  //   import 'mod';
  const importRegex = /import\s+(?:(?:[\w*${}\s,]+\s+from\s+)|)(['"])([^'"]+)\1/g;
  let importMatch;
  while ((importMatch = importRegex.exec(source)) !== null) {
    dependencies.add(importMatch[2]);
  }

  // Match CommonJS require(...) calls, including dynamic require('mod').
  const requireRegex = /require\(\s*(['"])([^'"]+)\1\s*\)/g;
  let requireMatch;
  while ((requireMatch = requireRegex.exec(source)) !== null) {
    dependencies.add(requireMatch[2]);
  }

  return dependencies.size;
}

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();
const uniqueIds = [];

/**
 * Creates a new tower object
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type (basic, sniper, splash)
 * @returns {Object} Tower object
 */
function createTower(x, y, type = 'basic') {
    const towerConfigs = {
        basic: { damage: 10, range: 100, fireRate: 1, cost: 50 },
        sniper: { damage: 50, range: 200, fireRate: 0.5, cost: 100 },
        splash: { damage: 20, range: 80, fireRate: 0.8, splashRadius: 50, cost: 75 }
    };
    
    const config = towerConfigs[type] || towerConfigs.basic;
    
    return {
        id: `tower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x,
        y,
        type,
        damage: config.damage,
        range: config.range,
        fireRate: config.fireRate,
        splashRadius: config.splashRadius || 0,
        cost: config.cost,
        lastFired: 0,
        targetId: null
    };
}

/**
 * Spawns an enemy at the start position
 * @param {number} health - Enemy health
 * @param {number} speed - Enemy speed (pixels per frame)
 * @param {number} reward - Currency reward on kill
 * @param {Array} path - Array of {x, y} waypoints
 * @returns {Object} Enemy object
 */
function spawnEnemy(health = 100, speed = 1, reward = 10, path = []) {
    const startPos = path.length > 0 ? path[0] : { x: 0, y: 0 };
    
    return {
        id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        health,
        maxHealth: health,
        speed,
        reward,
        path,
        pathIndex: 0,
        x: startPos.x,
        y: startPos.y,
        isDead: false,
        reachedEnd: false
    };
}

/**
 * Checks if a position is within range of a tower
 * @param {number} towerX - Tower X coordinate
 * @param {number} towerY - Tower Y coordinate
 * @param {number} targetX - Target X coordinate
 * @param {number} targetY - Target Y coordinate
 * @param {number} range - Range radius
 * @returns {boolean} True if target is in range
 */
function isPositionInRange(towerX, towerY, targetX, targetY, range) {
    const dx = targetX - towerX;
    const dy = targetY - towerY;
    return (dx * dx + dy * dy) <= (range * range);
}

/**
 * Calculates damage to an enemy considering armor
 * @param {number} baseDamage - Base damage amount
 * @param {number} armor - Enemy armor value
 * @returns {number} Actual damage dealt
 */
function calculateDamage(baseDamage, armor = 0) {
    const reduction = Math.min(armor * 0.06, 0.75);
    return Math.max(Math.floor(baseDamage * (1 - reduction)), 1);
}

/**
 * Gets all enemies within a tower's range
 * @param {Object} tower - Tower object
 * @param {Array} enemies - Array of enemy objects
 * @returns {Array} Array of enemies in range
 */
function getEnemiesInRange(tower, enemies) {
    return enemies.filter(enemy => {
        if (enemy.isDead) return false;
        return isPositionInRange(tower.x, tower.y, enemy.x, enemy.y, tower.range);
    });
}

/**
 * Checks if player can afford a tower
 * @param {string} towerType - Type of tower
 * @param {number} currentCurrency - Player's current currency
 * @returns {boolean} True if player can afford
 */
function canAffordTower(towerType, currentCurrency) {
    const costs = { basic: 50, sniper: 100, splash: 75 };
    return currentCurrency >= (costs[towerType] || 50);
}

/**
 * Places a tower on the map
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} type - Tower type
 * @returns {Object|null} Created tower or null if invalid
 */
function addTowerToMap(x, y, type = 'basic') {
    if (!canAffordTower(type, towerDefenseState.currency)) {
        return null;
    }
    
    const tower = createTower(x, y, type);
    towerDefenseState.towers.push(tower);
    towerDefenseState.currency -= tower.cost;
    
    return tower;
}

/**
 * Removes dead enemies from the enemy list
 * @param {Array} enemies - Array of enemy objects
 * @returns {Array} Filtered array without dead enemies
 */
function removeDeadEnemies(enemies) {
    return enemies.filter(enemy => !enemy.isDead && !enemy.reachedEnd);
}

/**
 * Starts a new wave of enemies
 * @param {number} waveNumber - Wave number
 * @param {Array} enemyTypes - Array of enemy type configs
 * @returns {Array} Array of spawned enemies
 */
function startWave(waveNumber, enemyTypes = []) {
    towerDefenseState.wave = waveNumber;
    const spawnedEnemies = [];
    
    const baseHealth = 50 + (waveNumber * 20);
    const baseSpeed = 1 + (waveNumber * 0.1);
    const enemyCount = 5 + Math.floor(waveNumber * 1.5);
    
    for (let i = 0; i < enemyCount; i++) {
        const delay = i * 1000;
        const enemy = spawnEnemy(
            baseHealth + (i * 10),
            Math.min(baseSpeed, 5),
            10 + Math.floor(waveNumber * 2),
            [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }]
        );
        spawnedEnemies.push(enemy);
        towerDefenseState.enemies.push(enemy);
    }
    return result;
}

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Implementation to address accessibility issues from an insight report.
  // Apply specific accessibility fixes here based on the report's structure.
  // For now, we simply return the report unchanged.
  return insightReport;
}

/*
 * Helper to manage focus within a container
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Finds the optimal position for a tower based on coverage
 * @param {Array} enemies - Array of enemy objects
 * @param {Array} validPositions - Array of valid {x, y} positions
 * @param {number} range - Tower range
 * @returns {Object|null} Best position or null
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';

  // Create navigation landmark
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';

  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });

  // Append landmarks to the body if they were created
  if (main) document.body.appendChild(main);
  if (nav) document.body.appendChild(nav);
  if (header) document.body.appendChild(header);
  if (footer) document.body.appendChild(footer);
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-expanded]');
  collapsibles.forEach(collapsible => {
    if (collapsible.getAttribute('aria-expanded') === 'true') {
      collapsible.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('input, select, textarea');

  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (control.id && !control.getAttribute('aria-label')) {
      const label = document.querySelector(`label[for="${control.id}"]`) || null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

// Function to add ARIA live regions for dynamic content updates
function addLiveRegionForDynamicContent() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'alert');
  document.body.appendChild(liveRegion);
}

/**
 * Adds the lang attribute to the HTML element for proper screen reader support.
 * This is essential for accessibility (REACT_015) as it helps screen readers
 * use the correct pronunciation and language settings.
 *
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr'). Defaults to 'en'.
 * @returns {void}
 */
function addLangAttribute(langCode = 'en') {
  const html = document.documentElement;
  html.setAttribute('lang', langCode);
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Add lang attribute to HTML element (REACT_015)
  addLangAttribute();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks([]);
  
  // Improve keyboard navigation
  improveKeyboardNavigation();
  
  // Add live region for dynamic content
  addLiveRegionForDynamicContent();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion,
    addLangAttribute
  };
}

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addProperLandmarkRegions,
    addProperAccountManagement,
    addAriaToFormControls,
    ensureUniqueLandmarkId,
    uniqueLandmarks,
    setupKeyboardNavigation,
    addressAccessibilityIssues,
    trapFocus,
    ensureUniqueLandmarks,
    createAnnouncer,
    prefersReducedMotion,
    improveKeyboardNavigation,
    addLiveRegionForDynamicContent,
    initializeAccessibility,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    someFunction,
    countDependencies
  };
}