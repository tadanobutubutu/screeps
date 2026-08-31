import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import { App } from './App';
import './styles.css';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Configuration and state
let config = {};
let appState = {};

// Initialize function
function initialize() {
  config = { apiUrl: process.env.API_URL || 'default', timeout: 5000 };
  appState = { initialized: true };
}

function initializeAppWrapper() {
  initialize();
}

function processData(data) {
  return data;
}

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState = {};
}

function validateInput(input) {
  return input && input.length > 0;
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

// Tower Defense System (pure JS, no React dependencies)
function createTowerDefenseSystem() {
  const towers = [];
  const enemies = [];
  let score = 0;
  let lives = 10;
  const gridSize = 8;
  
  function createTower(x, y, type = 'basic') {
    const tower = {
      id: `tower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      type,
      damage: type === 'basic' ? 10 : type === 'sniper' ? 25 : 5,
      range: type === 'basic' ? 2 : type === 'sniper' ? 5 : 1,
      fireRate: type === 'basic' ? 1000 : type === 'sniper' ? 2000 : 500,
      lastFired: 0
    };
    towers.push(tower);
    return tower;
  }
  
  function createEnemy(pathIndex = 0, health = 100) {
    const enemy = {
      id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pathIndex,
      health,
      maxHealth: health,
      speed: 1,
      x: pathIndex,
      y: 0,
      reward: 10
    };
    enemies.push(enemy);
    return enemy;
  }
  
  function getTowersInRange(x, y) {
    return towers.filter(tower => {
      const distance = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      return distance <= tower.range;
    });
  }
  
  function damageEnemy(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0) {
      score += enemy.reward;
      return true;
    }
    return false;
  }
  
  function moveEnemies() {
    enemies.forEach(enemy => {
      if (enemy.pathIndex < gridSize - 1) {
        enemy.pathIndex += enemy.speed;
      } else {
        lives -= 1;
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }
    });
  }
  
  function updateTowers(currentTime) {
    enemies.forEach(enemy => {
      const inRangeTowers = getTowersInRange(enemy.pathIndex, enemy.y);
      inRangeTowers.forEach(tower => {
        if (currentTime - tower.lastFired >= tower.fireRate) {
          const destroyed = damageEnemy(enemy, tower.damage);
          tower.lastFired = currentTime;
          if (destroyed) {
            const index = enemies.indexOf(enemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      });
    });
  }
  
  function getScore() {
    return score;
  }
  
  function getLives() {
    return lives;
  }
  
  function getAllTowers() {
    return [...towers];
  }
  
  function getAllEnemies() {
    return [...enemies];
  }
  
  function isGameOver() {
    return lives <= 0;
  }
  
  return {
    createTower,
    createEnemy,
    getTowersInRange,
    damageEnemy,
    moveEnemies,
    updateTowers,
    getScore,
    getLives,
    getAllTowers,
    getAllEnemies,
    isGameOver,
    gridSize
  };
}

// Accessibility utilities
function ensureAriaAttributes() {
  const lang = getLangAttribute();
  
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
  
  return {
    lang: lang,
    accessible: true
  };
}

function generateAccessibilityReport() {
  return { timestamp: new Date().toISOString(), issues: [] };
}

function wrapPrimaryContentInMain(parent) {
  // ... original function implementation ...
}

function addLangAttribute() {
  const lang = getLangAttribute();
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

function createInPageButton() {
  // Implementation for creating in-page button
}

function isValidLandmark(landmark) {
  return landmark && landmark.role;
}

function loadLandmarks() {
  return [];
}

function processLandmarks(landmarks) {
  return landmarks;
}

function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => a.id.localeCompare(b.id));
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(l => l.id === id);
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function formatResponse(data) {
  return { success: true, data };
}

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  // Validate name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  // Validate latitude
  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  // Validate longitude
  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

const initApp = () => {
  // Initialize the main application
  initializeAppWrapper();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks([]);

  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
};

function setLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

function addLandmarkRoles() {
  // Implementation for adding landmark roles
}

function fixFakeLinks() {
  // Implementation for fixing fake links
}

// Check if the environment is secure before initializing
if (typeof isSecureContext === 'function' && isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return appData.version;
}

// Book management utilities (adapted for Node.js)
function generateKey(book) {
  return book.id || `${book.title.substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

function countDependencies() {
  const dependencies = ['express', 'effector-sw'];
  return dependencies.length;
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }
  
  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Export all functions for Node.js/CommonJS
export {
  config: CONFIG,
  App,
  someFunction: function() {
    return 'some value';
  },
  helper: function(input) {
    return input ? input.toUpperCase() : '';
  },
  formatDate,
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  initializeApp: initializeAppWrapper,
  validateLinkAccessibility,
  handleFakeLinks,
  generateAccessibilityReport,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addLangAttribute,
  createInPageButton,
  validateInput,
  processData,
  formatResponse,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  landmarkConfig: CONFIG,
  // Tower defense exports
  createTowerDefenseSystem,
  // Book management exports
  generateKey,
  sortByTitle,
  sortByAuthor,
  countDependencies,
  main,
  checkLandmarkElement,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  initApp,
  landmarks,
  appData,
  icons,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent
};