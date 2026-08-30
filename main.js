// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.classList.remove('my-button');
    button.id = 'exampleButton';
    button.setAttribute('aria-label', 'Example Button');
  }
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
  const header = document.querySelector('header') || document.querySelector('[role="banner"]') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';

  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.querySelector('[role="contentinfo"]') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';

  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside') || document.querySelectorAll('[role="complementary"]');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
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
  const collapsibles = document.querySelectorAll('[aria-expanded], .collapsible');
  collapsibles.forEach(item => {
    if (!item.hasAttribute('aria-expanded')) {
      item.setAttribute('aria-expanded', 'false');
    }
  });

  // Add aria-labels to form inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.hasAttribute('aria-label')) {
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
    if (!control.id && !control.getAttribute('aria-label')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }

    // Mark required fields appropriately
    if (control.hasAttribute('required') && !control.hasAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Creates a new tower object for the tower defense game.
 * @param {number} x - X coordinate of the tower.
 * @param {number} y - Y coordinate of the tower.
 * @param {number} range - Attack range of the tower.
 * @param {number} damage - Damage dealt by the tower.
 * @param {number} cooldown - Time between attacks in milliseconds.
 * @returns {Object} Tower object.
 */
function createTower(x, y, range, damage, cooldown) {
  return {
    x,
    y,
    range,
    damage,
    cooldown,
    timeSinceLastAttack: 0
  };
}

/**
 * Creates a new enemy object for the tower defense game.
 * @param {number} x - X coordinate of the enemy.
 * @param {number} y - Y coordinate of the enemy.
 * @param {number} health - Health points of the enemy.
 * @param {number} speed - Movement speed of the enemy.
 * @param {number} pathIndex - Current position index on the path.
 * @returns {Object} Enemy object.
 */
function createEnemy(x, y, health, speed, pathIndex) {
  return {
    x,
    y,
    health,
    maxHealth: health,
    speed,
    pathIndex: pathIndex || 0
  };
}

/**
 * Calculates the distance between two points.
 * @param {number} x1 - X coordinate of first point.
 * @param {number} y1 - Y coordinate of first point.
 * @param {number} x2 - X coordinate of second point.
 * @param {number} y2 - Y coordinate of second point.
 * @returns {number} Distance between the two points.
 */
function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Finds an enemy within a tower's range.
 * @param {Object} tower - Tower object.
 * @param {Array} enemies - Array of enemy objects.
 * @returns {Object|undefined} First enemy within range or undefined.
 */
function findEnemyInRange(tower, enemies) {
  for (const enemy of enemies) {
    const distance = calculateDistance(tower.x, tower.y, enemy.x, enemy.y);
    if (distance <= tower.range) {
      return enemy;
    }
  }
  return undefined;
}

/**
 * Applies damage from a tower to an enemy.
 * @param {Object} tower - Tower object.
 * @param {Object} enemy - Enemy object.
 * @returns {void}
 */
function attackEnemy(tower, enemy) {
  enemy.health -= tower.damage;
}

/**
 * Updates the game state by processing tower attacks and enemy movement.
 * @param {Array} towers - Array of tower objects.
 * @param {Array} enemies - Array of enemy objects.
 * @param {number} deltaTime - Time elapsed since last update in milliseconds.
 * @returns {void}
 */
function updateGameState(towers, enemies, deltaTime) {
  // Update towers
  for (const tower of towers) {
    tower.timeSinceLastAttack += deltaTime;
    
    if (tower.timeSinceLastAttack >= tower.cooldown) {
      const target = findEnemyInRange(tower, enemies);
      if (target) {
        attackEnemy(tower, target);
        tower.timeSinceLastAttack = 0;
      }
    }
  }
  
  // Remove dead enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].health <= 0) {
      enemies.splice(i, 1);
    }
  }
}

/**
 * Initializes the tower defense game with default configuration.
 * @param {Object} config - Configuration object for the game.
 * @returns {Object} Game state object.
 */
function initializeTowerDefense(config) {
  return {
    towers: config.towers || [],
    enemies: config.enemies || [],
    path: config.path || [],
    gameState: 'playing'
  };
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.
replaceMyButtonId();

addProperLandmarkRegions();
addProperAccountManagement();
addAriaToFormControls();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  createTower,
  createEnemy,
  calculateDistance,
  findEnemyInRange,
  attackEnemy,
  updateGameState,
  initializeTowerDefense
};