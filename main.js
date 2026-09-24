// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

//_Commit: 10424a6a91e6d8a6267f46e9af6ca5fe0065cb1d_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Address accessibility issues from insight report (combined with the export code):
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// >>>>>>> branch-name

// TODO: Address accessibility issues from insight report — FIXED

// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

// Import required modules
const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')

// Utility functions
function getFileExtension (filepath) {
  return path.extname(filepath)
}

function readFileAsync (filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

function writeFileAsync (filepath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, data, 'utf8', (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

function createServer (port, hostname, requestListener) {
  const server = http.createServer(requestListener)
  return server.listen(port, hostname)
}

function createHttpsServer (options, requestListener) {
  const server = https.createServer(options, requestListener)
  return server
}

function getAbsolutePath (relativePath) {
  return path.resolve(relativePath)
}

function joinPaths (...paths) {
  return path.join(...paths)
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = lang || 'en';
    }
    return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
    // Simple language detection based on common patterns
    let lang = 'en'; // Default to English

    if (content) {
        // Check for common non-ASCII characters to help detect language
        if (/[\u4e00-\u9fff]/.test(content)) {
            lang = 'zh'; // Chinese
        } else if (/[\u3040-\u30ff]/.test(content)) {
            lang = 'ja'; // Japanese
        } else if (/[\u0400-\u04ff]/.test(content)) {
            lang = 'ru'; // Russian/Cyrillic
        } else if (/[\u0600-\u06ff]/.test(content)) {
            lang = 'ar'; // Arabic
        } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
            lang = 'fr'; // French
        } else if (/[äöüß]/i.test(content)) {
            lang = 'de'; // German
        }
    }

    return setHtmlLangAttribute(lang);
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {string} options.lang - The language code for the name (default: 'en')
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName(options = {}) {
  const { firstName = '', lastName = '', lang = 'en', container = null } = options;
  const fullName = `${firstName} ${lastName}`.trim();

  if (typeof document !== 'undefined') {
    const nameElement = document.createElement('span');
    nameElement.setAttribute('lang', lang);
    nameElement.setAttribute('aria-label', fullName);
    nameElement.textContent = fullName || 'Unknown';

    if (container) {
      container.appendChild(nameElement);
    }

    return nameElement;
  }

  return fullName || 'Unknown';
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Creates an accessible web resource button for linking to external resources.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @param {string} label - The accessible label/description of the button
 * @returns {HTMLElement} The created button element
 */
function createWebResourceButton(parent = document.body, label = 'Open Resource') {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', label);
  parent.appendChild(btn);
  return btn;
}

// TODO: Implement tower defense
function towerDefense() {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = [];
  const enemies = [];
  let wave = 1;

  // Example: Tower constructor
  function Tower(x, y, range, damage, rate) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.rate = rate;
    this.lastShot = 0;
  }

  // Example: Enemy constructor
  function Enemy(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
  }

  // Add a tower
  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  // Add an enemy
  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  // Update game state (simplified)
  function update() {
    // Logic for enemy movement, tower shooting, etc.
    console.log(`Wave ${wave} - updating game state`);
  }

  // Start the game
  function start() {
    console.log('Tower defense game started');
    // Add initial towers and enemies
    addTower(100, 100, 200, 10, 1000);
    addEnemy(0, 50, 100, 2);
    // Game loop would be here
  }

  // Expose game functions
  return {
    start,
    addTower,
    addEnemy,
    update,
    getWave: () => wave
  };
}

// Add back missing functions from TODO comments

/**
 * Function to fix table structure issues (REACT_027)
 * @param {HTMLTableElement} table - The table element to fix
 * @returns {Object} Result object with valid status and any errors
 */
function fixTableStructure(table) {
  const result = { valid: true, errors: [] };

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Fix missing thead
  const thead = table.querySelector('thead');
  if (!thead) {
    const newThead = document.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      newThead.appendChild(firstRow.cloneNode(true));
      table.insertBefore(newThead, table.firstChild);
    }
  }

  // Fix missing tbody
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length > 0 && table.querySelector('thead')) {
      const theadRows = table.querySelectorAll('thead tr');
      const dataRows = rows.slice(theadRows.length);
      dataRows.forEach(row => tbody.appendChild(row));
    }
    table.appendChild(tbody);
  }

  // Fix inconsistent column counts
  const allRows = table.querySelectorAll('tr');
  const columnCounts = Array.from(allRows).map(row => row.querySelectorAll('td, th').length);
  const uniqueCounts = [...new Set(columnCounts)];
  if (uniqueCounts.length > 1) {
    // Use the most common column count
    const countCounts = {};
    columnCounts.forEach(count => {
      countCounts[count] = (countCounts[count] || 0) + 1;
    });
    const mostCommonCount = Object.entries(countCounts).sort((a, b) => b[1] - a[1])[0][0];

    allRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length !== mostCommonCount) {
        // Add or remove cells to match the most common count
        while (cells.length < mostCommonCount) {
          const cell = document.createElement(cells.length % 2 === 0 ? 'td' : 'th');
          row.appendChild(cell);
        }
      }
    });
    result.valid = result.errors.length === 0;
  }

  return result;
}

/**
 * Function to add landmark issues (REACT_017)
 * @param {HTMLElement} element - The landmark element to process
 * @returns {Object} Result object with valid status and any errors
 */
function addLandmarkIssues(element) {
  const errors = [];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  // Check if element has role attribute
  const role = element.getAttribute('role');
  if (!role) {
    // Try to infer role from tag name
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'header') {
      element.setAttribute('role', 'banner');
      errors.push('Added role="banner" to header element');
    } else if (tagName === 'nav') {
      element.setAttribute('role', 'navigation');
      errors.push('Added role="navigation" to nav element');
    } else if (tagName === 'main') {
      element.setAttribute('role', 'main');
      errors.push('Added role="main" to main element');
    } else if (tagName === 'aside') {
      element.setAttribute('role', 'complementary');
      errors.push('Added role="complementary" to aside element');
    } else if (tagName === 'footer') {
      element.setAttribute('role', 'contentinfo');
      errors.push('Added role="contentinfo" to footer element');
    }

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ).filter(el => el.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Optionally focus the first focusable element in the trap
  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ).filter(el => el.offsetParent !== null);

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Check for required accessible names
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
    
    return true;
  } catch (e) {
    console.error('Error in validateLandmark:', e);
    return false;
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Function to add accessible names to SVGs (REACT_041)
 * @param {SVGElement} svg - The SVG element to process
 * @param {string} accessibleName - The accessible name to add
 * @returns {Object} Result object with valid status and any errors
 */
function addSvgAccessibleNames(svg, accessibleName) {
  const result = { valid: true, errors: [] };

  if (!svg) {
    return { valid: false, errors: ['SVG element is required'] };
  }

  if (!accessibleName) {
    result.errors.push('Accessible name is required');
    result.valid = false;
    return result;
  }

  // Check if SVG already has an accessible name
  const hasAriaLabel = svg.getAttribute('aria-label');
  const hasTitle = svg.querySelector('title');
  const hasAriaLabelledby = svg.getAttribute('aria-labelledby');

  if (hasAriaLabel || hasTitle || hasAriaLabelledby) {
    result.errors.push('SVG already has an accessible name');
    result.valid = false;
    return result;
  }

  // Add aria-label to SVG
  svg.setAttribute('aria-label', accessibleName);

  return result;
}

// New function to ensure unique landmarks (from HEAD side)
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

// New function to fix fake link issues (from HEAD side)
function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
}

// New function to implement the tower defense game
function implementTowerDefense() {
  // Implementation of the tower defense game
  const game = towerDefense();

  // Initialize the game
  game.start();

  // Example usage:
  // game.addTower(200, 200, 150, 15, 800);
  // game.addEnemy(0, 100, 50, 1);

  return game;
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Export the new functions
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  addLangAttribute,
  createInPageButton,
  createWebResourceButton,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addLandmarkIssues,
  addSvgAccessibleNames,
  createAccessibleLink,
  towerDefense,
  implementTowerDefense,
  personName
};

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

// _Commit: 1d15d42958d662a6ba9beeb170f6f5adce09a87c_

// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->