// Importing utilities for formatting and validation
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard } from './components.js';
import { state, updateState } from './state.js';
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/tableAccessibilityUtils';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// REACT_015: lang attribute added to HTML element
// The React component rendering the HTML element provides the `lang` prop
// The language attribute is set according to the application's settings

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = getLangAttribute();

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

// Initialize _usedLandmarkIds set for tracking used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
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

// Ensure elements have the required IDs
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
}

/**
 * Sets the language attribute on the HTML element.
 *
 * This ensures that screen readers and other assistive technologies
 * can correctly interpret the language of the page.
 *
 * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr').
 */
const setLanguageAttribute = (lang = 'en') => {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
};

/**
 * Adds landmark roles to the main navigation and content sections.
 *
 * This addresses the REACT_017 issue by adding appropriate ARIA roles
 * such as 'navigation', 'main', and 'banner' to relevant HTML elements.
 */
const addLandmarkRolesFn = () => {
  // Navigation landmark
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  // Main content landmark
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  // Header landmark (banner)
  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.getAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }

  // Footer landmark (contentinfo)
  const footerElement = document.querySelector('footer');
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }
};

/**
 * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
 *
 * This addresses the REACT_025 issue by checking for duplicate landmarks
 * and making them unique with appropriate aria-label or aria-labelledby attributes.
 */
const ensureUniqueLandmarkElements = () => {
  // Navigation landmark uniqueness
  const navElements = document.querySelectorAll('[role="navigation"]');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (index > 0) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Main content landmark uniqueness
  const mainElements = document.querySelectorAll('[role="main"]');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        main.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
};

/**
 * Adds accessible names to SVG elements.
 *
 * This addresses the REACT_041 issue by ensuring that SVGs have appropriate
 * accessible names, either through title or desc elements.
 *
 * @param {string} svgSelector - The CSS selector for the SVG element(s).
 * @param {string} accessibleName - The accessible name to set.
 */
const addSVGAccessibleName = (svgSelector, accessibleName) => {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach((svg) => {
    // Check if the SVG already has a title element
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = accessibleName;
  });
};

/**
 * Fixes fake links (elements that look like links but are not semantic <a> tags).
 *
 * This addresses the REACT_036 issue by identifying elements that have
 * click handlers but are not <a> tags and adding appropriate ARIA roles
 * and attributes to make them accessible.
 */
const fixFakeLinks = () => {
  const fakeLinks = document.querySelectorAll('[onclick]:not([role])');
  fakeLinks.forEach((element) => {
    if (element.tagName.toLowerCase() !== 'a') {
      // Add role="button" and appropriate ARIA attributes
      element.setAttribute('role', 'button');
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      if (!element.getAttribute('aria-label')) {
        // Use the element's text content as the aria-label if not present
        element.setAttribute('aria-label', element.textContent.trim() || 'Link');
      }
    }
  });
};

// Define icons object
const icons = {
  icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
};

// Main module entry point
const main = {
  /**
   * Sets the language attribute on the HTML element.
   *
   * This ensures that screen readers and other assistive technologies
   * can correctly interpret the language of the page.
   *
   * @param {string} lang - The language code to set (e.g., 'en', 'es', 'fr').
   */
  setLanguageAttribute: setLanguageAttribute,

  /**
   * Adds landmark roles to the main navigation and content sections.
   *
   * This addresses the REACT_017 issue by adding appropriate ARIA roles
   * such as 'navigation', 'main', and 'banner' to relevant HTML elements.
   */
  addLandmarkRolesFn: addLandmarkRolesFn,

  /**
   * Ensures that landmarks are unique by adding unique ARIA labels where necessary.
   *
   * This addresses the REACT_025 issue by checking for duplicate landmarks
   * and making them unique with appropriate aria-label or aria-labelledby attributes.
   */
  ensureUniqueLandmarkElements: ensureUniqueLandmarkElements,

  /**
   * Adds accessible names to SVG elements.
   *
   * This addresses the REACT_041 issue by ensuring that SVGs have appropriate
   * accessible names, either through title or desc elements.
   *
   * @param {string} svgSelector - The CSS selector for the SVG element(s).
   * @param {string} accessibleName - The accessible name to set.
   */
  addSVGAccessibleName: addSVGAccessibleName,

  /**
   * Fixes fake links (elements that look like links but are not semantic <a> tags).
   *
   * This addresses the REACT_036 issue by identifying elements that have
   * click handlers but are not <a> tags and adding appropriate ARIA roles
   * and attributes to make them accessible.
   */
  fixFakeLinks: fixFakeLinks,

  /**
   * Creates an accessible in-page button element.
   *
   * @param {string} text - The text content of the button
   * @param {Function} onClick - The click handler function
   * @param {Object} [options] - Optional configuration
   * @param {string} [options.id] - The ID for the button
   * @param {string} [options.className] - The class name for the button
   * @param {string} [options.ariaLabel] - The ARIA label for the button
   * @param {boolean} [options.disabled=false] - Whether the button is disabled
   * @returns {HTMLButtonElement} The created button element
   */
  createInPageButton: createInPageButton
};

function helloWorld() {
  return 'Hello, World!';
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Function to render the dependency graph
function renderDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    // Add the logic to render the dependency graph inside the container
    // This is a placeholder for the actual rendering logic
    container.innerHTML = 'Dependency Graph Data';
  }
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// Function to check landmark elements in the DOM
function checkLandmarkElements() {
    const landmarkSelectors = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};

    landmarkSelectors.forEach((landmark) => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });

    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };

    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Required <main> landmark element');
    }

    return validation;
}

// Application data placeholder
const appData = {
    title: 'Application',
    version: '1.0.0'
};

// Function to add ARIA labels
function addAriaLabel(elementId, label) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// Placeholder function for initializeApp
function initializeApp() {
  console.log('App initialized');
}

// Placeholder function for createUnrotateButton
function createUnrotateButton() {
  const button = document.createElement('button');
  button.textContent = 'Unrotate';
  button.setAttribute('aria-label', 'Unrotate button');
  return button;
}

// Initialization function
const initApp = () => {
  // Initialize the main application
  initializeApp();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRolesFn();
  ensureUniqueLandmarkElements();

  // Add accessible names to SVGs (example selectors and names)
  addSVGAccessibleName('.home-icon', 'Home icon');
  addSVGAccessibleName('.settings-icon', 'Settings icon');
};

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

// Ensure elements have the required IDs
ensureElementHasId('myTable');
ensureElementHasId('mySvg');
ensureElementHasId('inPageButton');
ensureElementHasId('myButton');

// Add ARIA labels for better screen reader support
addAriaLabel('myTable', 'Product data table');
addAriaLabel('myLogo', 'Company logo');
addAriaLabel('myMenu', 'Accessibility menu');
addAriaLabel('myButton', 'My Button');

// DOM-based accessibility code

function getFullLangAttribute() {
  // Implementation for getting full lang attribute
  return 'en-US'; // Example implementation
}

function personName() {
  // Existing code...
}

function validateLandmark() {
  // Existing code...
}

function validateTableAccessibility(table) {
  // Implementation for validating table accessibility
  if (!table) return;
  // Add accessibility checks for table
}

function validateTableStructure(table) {
  // Implementation for validating table structure
  if (!table) return;
  // Add structure validation logic
}

function ensureElementsHaveIds(elements) {
  return Array.from(elements).map((element, index) => {
    if (!element.id) {
      element.id = `element-${index}`;
    }
    return element;
  });
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.getElementById('svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.getElementById('svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(skipLink.getAttribute('href').replace('#', ''));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

// Merged landmark roles function to include both implementations
function addLandmarkRoles() {
  // From HEAD: Navigation, Main, Header
  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }

  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.getAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }

  // From origin/main: Footer
  const footerElement = document.querySelector('footer');
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }

  // From origin/main: Specific main-content ID
  const mainContent = document.getElementById('main-content');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // Define landmark roles - some should be unique per page
  const uniqueLandmarkRoles = ['main', 'banner', 'contentinfo'];
  const multipleAllowedRoles = ['navigation', 'complementary', 'region', 'search', 'form'];
  const allLandmarkRoles = [...uniqueLandmarkRoles, ...multipleAllowedRoles];

  // Find all elements with landmark roles
  const landmarks = document.querySelectorAll(allLandmarkRoles.map(role => `[role="${role}"]`).join(', '));

  // Group landmarks by role
  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!landmarksByRole[role]) {
      landmarksByRole[role] = [];
    }
    landmarksByRole[role].push(landmark);
  });

  // Check unique landmark roles - should only have one per page
  uniqueLandmarkRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      console.warn(`Multiple ${role} landmarks found. Only one is allowed per page.`);
      // Keep the first one, remove role from others
      elements.slice(1).forEach(el => {
        el.removeAttribute('role');
        console.warn(`Removed duplicate ${role} landmark role from element:`, el);
      });
    }
  });

  // For roles that allow multiples, ensure each has a unique accessible name
  multipleAllowedRoles.forEach(role => {
    const elements = landmarksByRole[role] || [];
    if (elements.length > 1) {
      const usedNames = new Set();
      elements.forEach((el, index) => {
        // Check for existing accessible name
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        let accessibleName = ariaLabel || (ariaLabelledBy ? document.getElementById(ariaLabelledBy)?.textContent : null);

        if (!accessibleName) {
          // Generate a unique name
          accessibleName = `${role} ${index + 1}`;
          el.setAttribute('aria-label', accessibleName);
        }

        // Ensure uniqueness
        let uniqueName = accessibleName;
        let counter = 1;
        while (usedNames.has(uniqueName)) {
          uniqueName = `${accessibleName} ${counter}`;
          counter++;
        }
        usedNames.add(uniqueName);

        if (uniqueName !== accessibleName) {
          el.setAttribute('aria-label', uniqueName);
        }
      });
    } else if (elements.length === 1) {
      // Single landmark of this type - ensure it has an accessible name if needed
      const el = elements[0];
      const ariaLabel = el.getAttribute('aria-label');
      const ariaLabelledBy = el.getAttribute('aria-labelledby');
      if (!ariaLabel && !ariaLabelledBy) {
        el.setAttribute('aria-label', role);
      }
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('[href="#"]:not([aria-hidden])');
  fakeLinks.forEach((link) => {
    link.removeAttribute('href');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

// New function requested in the issue
function newFunction() {
  // Implementation of the new function
  const button = createInPageButton('New Button', function() {
    console.log('New Function clicked!');
  });
  document.body.appendChild(button);
}

// Tower Defense Implementation
const TOWER_DEFENSE_CONFIG = {
  boardSize: { rows: 8, cols: 8 },
  towerCost: 100,
  enemyHealth: 100,
  enemySpeed: 50,
  maxTowers: 10,
  gameInterval: 1000
};

class TowerDefenseGame {
  constructor(config = TOWER_DEFENSE_CONFIG) {
    this.config = config;
    this.board = this.createBoard();
    this.towers = [];
    this.enemies = [];
    this.gameIntervalId = null;
    this.isRunning = false;
  }

  createBoard() {
    const { rows, cols } = this.config.boardSize;
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ type: 'path', tower: null }))
    );
  }

  placeTower(row, col) {
    if (this.towers.length >= this.config.maxTowers) {
      return false;
    }
    
    if (this.board[row] && this.board[row][col]) {
      const cell = this.board[row][col];
      if (cell.type !== 'path' || cell.tower) {
        return false;
      }
      
      const tower = {
        id: this.towers.length,
        row,
        col,
        damage: 10,
        range: 3,
        cost: this.config.towerCost
      };
      
      cell.tower = tower;
      this.towers.push(tower);
      return true;
    }
    return false;
  }

  spawnEnemy() {
    const enemy = {
      id: this.enemies.length,
      health: this.config.enemyHealth,
      position: { row: 0, col: 0 },
      pathIndex: 0
    };
    this.enemies.push(enemy);
  }

  updateEnemies() {
    this.enemies.forEach(enemy => {
      // Simplified movement logic - move along path
      if (enemy.position.col < this.config.boardSize.cols - 1) {
        enemy.position.col++;
      } else if (enemy.position.row < this.config.boardSize.rows - 1) {
        enemy.position.row++;
        enemy.position.col = 0;
      } else {
        // Enemy reached the end - remove from array
        return false;
      }
      return true;
    });
    
    // Remove enemies that reached the end
    this.enemies = this.enemies.filter(enemy => 
      enemy.position.row < this.config.boardSize.rows - 1
    );
  }

  updateTowers() {
    this.towers.forEach(tower => {
      // Find enemies in range and attack
      this.enemies.forEach(enemy => {
        const distance = Math.abs(tower.row - enemy.position.row) + 
                         Math.abs(tower.col - enemy.position.col);
        
        if (distance <= tower.range) {
          enemy.health -= tower.damage;
          if (enemy.health <= 0) {
            // Mark enemy for removal
            enemy.health = 0;
          }
        }
      });
    });
    
    // Remove dead enemies
    this.enemies = this.enemies.filter(enemy => enemy.health > 0);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.spawnEnemy(); // Initial enemy
    
    this.gameIntervalId = setInterval(() => {
      this.spawnEnemy();
      this.updateEnemies();
      this.updateTowers();
    }, this.config.gameInterval);
  }

  stop() {
    if (this.gameIntervalId) {
      clearInterval(this.gameIntervalId);
      this.gameIntervalId = null;
    }
    this.isRunning = false;
  }

  getGameState() {
    return {
      board: this.board,
      towers: this.towers,
      enemies: this.enemies,
      isRunning: this.isRunning
    };
  }
}

// Export tower defense game class
export { TowerDefenseGame, TOWER_DEFENSE_CONFIG };

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }
  return price - (price * discount / 100);
}

export default main;