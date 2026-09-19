// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

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

// Helper to manage focus within a container
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

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

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

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();
  
  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
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

/**
 * Harvests resources from a given source
 * @param {Object} source - The resource source object
 * @param {number} amount - Amount to harvest
 * @param {Object} gameState - The current game state
 * @returns {Object} - Updated game state with harvested resources
 */
function harvest(source, amount, gameState) {
  const updatedGameState = deepClone(gameState);
  
  if (!source || !source.resources || !updatedGameState.resources) {
    return updatedGameState;
  }
  
  const resourcesToAdd = {};
  for (const resourceType in source.resources) {
    if (source.resources.hasOwnProperty(resourceType)) {
      resourcesToAdd[resourceType] = source.resources[resourceType] * amount;
    }
  }
  
  for (const resourceType in resourcesToAdd) {
    if (resourcesToAdd.hasOwnProperty(resourceType)) {
      if (!updatedGameState.resources[resourceType]) {
        updatedGameState.resources[resourceType] = 0;
      }
      updatedGameState.resources[resourceType] += resourcesToAdd[resourceType];
    }
  }
  
  if (source.harvestTime && updatedGameState.lastHarvestTime !== undefined) {
    updatedGameState.lastHarvestTime = Date.now();
  }
  
  return updatedGameState;
}

/**
 * Upgrades a building or feature
 * @param {string} upgradeType - Type of upgrade to perform
 * @param {Object} gameState - The current game state
 * @param {Object} upgradesConfig - Configuration for available upgrades
 * @returns {Object} - Updated game state with applied upgrades
 */
function upgrade(upgradeType, gameState, upgradesConfig) {
  const updatedGameState = deepClone(gameState);
  
  if (!upgradesConfig || !upgradesConfig[upgradeType]) {
    return updatedGameState;
  }
  
  const upgrade = upgradesConfig[upgradeType];
  
  if (!updatedGameState.resources || !upgrade.cost) {
    return updatedGameState;
  }
  
  let canAfford = true;
  for (const resourceType in upgrade.cost) {
    if (upgrade.cost.hasOwnProperty(resourceType)) {
      if (!updatedGameState.resources[resourceType] || 
          updatedGameState.resources[resourceType] < upgrade.cost[resourceType]) {
        canAfford = false;
        break;
      }
    }
  }
  
  if (!canAfford) {
    return updatedGameState;
  }
  
  for (const resourceType in upgrade.cost) {
    if (upgrade.cost.hasOwnProperty(resourceType)) {
      updatedGameState.resources[resourceType] -= upgrade.cost[resourceType];
    }
  }
  
  if (upgrade.effect) {
    for (const effectType in upgrade.effect) {
      if (upgrade.effect.hasOwnProperty(effectType)) {
        if (effectType === 'levels') {
          if (!updatedGameState.levels) {
            updatedGameState.levels = {};
          }
          if (!updatedGameState.levels[upgradeType]) {
            updatedGameState.levels[upgradeType] = 0;
          }
          updatedGameState.levels[upgradeType] += 1;
        } else if (effectType === 'production') {
          if (!updatedGameState.production) {
            updatedGameState.production = {};
          }
          if (!updatedGameState.production[upgradeType]) {
            updatedGameState.production[upgradeType] = {};
          }
          for (const stat in upgrade.effect[effectType]) {
            if (upgrade.effect[effectType].hasOwnProperty(stat)) {
              if (!updatedGameState.production[upgradeType][stat]) {
                updatedGameState.production[upgradeType][stat] = 0;
              }
              updatedGameState.production[upgradeType][stat] += upgrade.effect[effectType][stat];
            }
          }
        }
      }
    }
  }
  
  return updatedGameState;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    harvest,
    upgrade
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
  });
}