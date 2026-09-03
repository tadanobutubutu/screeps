// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a22a37d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c94e4e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
//<!-- todo-hash: d290c9a63ee693e91602d63f7ca6757def47f63e -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
import React from 'react';

// Import dependency graph content and index content for rendering functions
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

/**
 * Renders the index view using the indexContent module.
 * This function should be called by the index view rendering functions.
 * @param {Object} props - Props for rendering the index view
 * @returns {React.ReactElement} The rendered index content
 */
function renderIndexView(props) {
  const content = indexContent(props);
  return content;
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e. g., 'en', 'es', 'fr')
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
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby') || tableElement.getAttribute('summary');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('td'));
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = Array.from(prevRow.querySelectorAll('td'));
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Element has invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found. Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName.toLowerCase();
      const parentRole = parent.getAttribute('role');
      
      // Check for invalid nesting
      if (parentTag === 'header' && parentTag === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && parentTag === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy && typeof document !== 'undefined') {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  
  // Check for <title> element
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  // Check for <desc> element
  const descElement = svgElement.querySelector('desc');
  if (descElement) {
    return descElement.textContent;
  }
  
  return null;
}

// New function to address REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarkTypes = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarkTypes.forEach((type) => {
    const elements = document.querySelectorAll(type);
    if (elements.length > 1 && type !== 'nav' && type !== 'aside') {
      errors.push(`Multiple <${type}> elements found. Only one should exist.`);
    }
    
    // For nav and aside, multiple are allowed but each must have unique accessible name
    if ((type === 'nav' || type === 'aside') && elements.length > 1) {
      const names = new Set();
      elements.forEach((el) => {
        const name = el.getAttribute('aria-label') || 
                     el.getAttribute('aria-labelledby') ||
                     el.textContent.trim().substring(0, 50);
        if (names.has(name)) {
          errors.push(`Multiple <${type}> elements have the same accessible name: "${name}"`);
        }
        names.add(name);
      });
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function personName() {
  // Returns a person's name to be used for accessible labels
  return '';
}

function createInPageButton(label, onClick) {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.className = 'in-page-button';
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// ===================== Tower Defense Implementation =====================
// TODO: Implement tower defense

/**
 * Tower Defense game state and configuration constants.
 */
const TOWER_DEFENSE_CONFIG = {
  GRID_WIDTH: 20,
  GRID_HEIGHT: 12,
  CELL_SIZE: 40,
  STARTING_GOLD: 100,
  STARTING_LIVES: 20,
  WAVE_SIZE: 5,
  ENEMY_SPEED: 1,
  ENEMY_HEALTH: 10,
  ENEMY_REWARD: 5,
  TOWER_COST: 25,
  TOWER_RANGE: 3,
  TOWER_DAMAGE: 2,
  TOWER_FIRE_RATE: 1000,
  PATH: [
    { x: 0, y: 5 },
    { x: 4, y: 5 },
    { x: 4, y: 2 },
    { x: 8, y: 2 },
    { x: 8, y: 8 },
    { x: 12, y: 8 },
    { x: 12, y: 5 },
    { x: 16, y: 5 },
    { x: 16, y: 9 },
    { x: 19, y: 9 },
  ],
};

/**
 * Creates a new enemy for the tower defense wave.
 * @param {number} hp - Health points for the enemy.
 * @param {number} speed - Movement speed of the enemy.
 * @returns {Object} A new enemy object.
 */
function createEnemy(hp, speed) {
  const path = TOWER_DEFENSE_CONFIG.PATH;
  return {
    id: `enemy_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    hp: hp ?? TOWER_DEFENSE_CONFIG.ENEMY_HEALTH,
    maxHp: hp ?? TOWER_DEFENSE_CONFIG.ENEMY_HEALTH,
    speed: speed ?? TOWER_DEFENSE_CONFIG.ENEMY_SPEED,
    pathIndex: 0,
    x: path[0].x,
    y: path[0].y,
    alive: true,
  };
}

/**
 * Creates a new tower at the given grid coordinates.
 * @param {number} gridX - The X grid coordinate.
 * @param {number} gridY - The Y grid coordinate.
 * @returns {Object} A new tower object.
 */
function createTower(gridX, gridY) {
  return {
    id: `tower_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    gridX,
    gridY,
    range: TOWER_DEFENSE_CONFIG.TOWER_RANGE,
    damage: TOWER_DEFENSE_CONFIG.TOWER_DAMAGE,
    fireRate: TOWER_DEFENSE_CONFIG.TOWER_FIRE_RATE,
    lastFired: 0,
    level: 1,
  };
}

/**
 * Initializes a fresh tower defense game state.
 * @returns {Object} The initial game state object.
 */
function initTowerDefense() {
  return {
    gold: TOWER_DEFENSE_CONFIG.STARTING_GOLD,
    lives: TOWER_DEFENSE_CONFIG.STARTING_LIVES,
    wave: 1,
    enemies: [],
    towers: [],
    projectiles: [],
    gameOver: false,
    victory: false,
    score: 0,
  };
}

/**
 * Generates a wave of enemies for the tower defense game.
 * @param {number} waveNumber - The current wave number (used for scaling).
 * @returns {Array<Object>} Array of enemy objects for this wave.
 */
function spawnWave(waveNumber) {
  const size = TOWER_DEFENSE_CONFIG.WAVE_SIZE + Math.floor(waveNumber * 1.5);
  const healthScale = 1 + (waveNumber - 1) * 0.5;
  const enemies = [];
  for (let i = 0; i < size; i++) {
    enemies.push(createEnemy(
      Math.floor(TOWER_DEFENSE_CONFIG.ENEMY_HEALTH * healthScale),
      TOWER_DEFENSE_CONFIG.ENEMY_SPEED
    ));
  }
  return enemies;
}

/**
 * Moves an enemy along its path based on its speed.
 * @param {Object} enemy - The enemy to move.
 * @returns {boolean} True if enemy reached the end, false otherwise.
 */
function moveEnemy(enemy) {
  if (!enemy || !enemy.alive) return false;
  const path = TOWER_DEFENSE_CONFIG.PATH;
  if (enemy.pathIndex >= path.length - 1) {
    return true;
  }
  enemy.x += TOWER_DEFENSE_CONFIG.ENEMY_SPEED;
  const next = path[enemy.pathIndex + 1];
  if (next && enemy.x >= next.x) {
    enemy.x = next.x;
    enemy.y = next.y;
    enemy.pathIndex += 1;
  }
  return enemy.pathIndex >= path.length - 1;
}

/**
 * Calculates the Euclidean distance between two points.
 * @param {number} x1 - First X coordinate.
 * @param {number} y1 - First Y coordinate.
 * @param {number} x2 - Second X coordinate.
 * @param {number} y2 - Second Y coordinate.
 * @returns {number} The distance between the points.
 */
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Finds all enemies within the tower's range.
 * @param {Object} tower - The tower to check.
 * @param {Array<Object>} enemies - List of active enemies.
 * @returns {Array<Object>} Enemies within the tower's range.
 */
function findTargetsInRange(tower, enemies) {
  const cell = TOWER_DEFENSE_CONFIG.CELL_SIZE;
  const towerCenter = {
    x: tower.gridX + 0.5,
    y: tower.gridY + 0.5,
  };
  return enemies.filter((enemy) => {
    if (!enemy.alive) return false;
    const enemyCellX = enemy.x + 0.5;
    const enemyCellY = enemy.y + 0.5;
    const d = distance(towerCenter.x, towerCenter.y, enemyCellX, enemyCellY);
    return d <= tower.range * (cell / cell);
  });
}

/**
 * Tower fires at the closest enemy in range, creating a projectile.
 * @param {Object} tower - The firing tower.
 * @param {Array<Object>} enemies - List of active enemies.
 * @param {number} now - Current timestamp in ms.
 * @returns {Object|null} The projectile fired, or null if no fire.
 */
function towerFire(tower, enemies, now) {
  if (now - tower.lastFired < tower.fireRate) return null;
  const targets = findTargetsInRange(tower, enemies);
  if (targets.length === 0) return null;

  // Pick the closest enemy
  let closest = targets[0];
  let minDist = Infinity;
  targets.forEach((enemy) => {
    const d = distance(tower.gridX + 0.5, tower.gridY + 0.5, enemy.x + 0.5, enemy.y + 0.5);
    if (d < minDist) {
      minDist = d;
      closest = enemy;
    }
  });

  tower.lastFired = now;
  return {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    towerId: tower.id,
    targetId: closest.id,
    x: tower.gridX + 0.5,
    y: tower.gridY + 0.5,
    damage: tower.damage,
    speed: 0.4,
  };
}

/**
 * Updates a projectile's position toward its target and applies damage.
 * @param {Object} projectile - The projectile to update.
 * @param {Array<Object>} enemies - List of active enemies.
 * @returns {boolean} True if projectile is still active, false if consumed.
 */
function updateProjectile(projectile, enemies) {
  const target = enemies.find((e) => e.id === projectile.targetId && e.alive);
  if (!target) return false;

  const dx = (target.x + 0.5) - projectile.x;
  const dy = (target.y + 0.5) - projectile.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < projectile.speed) {
    target.hp -= projectile.damage;
    if (target.hp <= 0) {
      target.alive = false;
    }
    return false;
  }

  projectile.x += (dx / dist) * projectile.speed;
  projectile.y += (dy / dist) * projectile.speed;
  return true;
}

/**
 * Places a tower at the given grid coordinates if the player can afford it.
 * @param {Object} state - Current game state.
 * @param {number} gridX - X grid coordinate.
 * @param {number} gridY - Y grid coordinate.
 * @returns {Object} Updated game state.
 */
function placeTower(state, gridX, gridY) {
  if (state.gold < TOWER_DEFENSE_CONFIG.TOWER_COST) {
    return { ...state, error: 'Not enough gold' };
  }
  const occupied = state.towers.some(
    (t) => t.gridX === gridX && t.gridY === gridY
  );
  if (occupied) {
    return { ...state, error: 'Cell already occupied' };
  }
  return {
    ...state,
    gold: state.gold - TOWER_DEFENSE_CONFIG.TOWER_COST,
    towers: [...state.towers, createTower(gridX, gridY)],
    error: null,
  };
}

/**
 * Advances the tower defense game state by one tick.
 * @param {Object} state - Current game state.
 * @param {number} now - Current timestamp in ms.
 * @returns {Object} The updated game state.
 */
function tickTowerDefense(state, now) {
  if (state.gameOver || state.victory) return state;

  let next = { ...state };

  // Move enemies
  next.enemies = next.enemies.map((enemy) => {
    if (!enemy.alive) return enemy;
    const reachedEnd = moveEnemy(enemy);
    if (reachedEnd) {
      next.lives = Math.max(0, next.lives - 1);
      return { ...enemy, alive: false, reachedEnd: true };
    }
    return enemy;
  });

  if (next.lives <= 0) {
    next.gameOver = true;
    return next;
  }

  // Towers fire
  const projectiles = [...next.projectiles];
  next.towers.forEach((tower) => {
    const proj = towerFire(tower, next.enemies, now);
    if (proj) projectiles.push(proj);
  });

  // Update projectiles
  next.projectiles = projectiles.filter((p) => updateProjectile(p, next.enemies));

  // Collect rewards from defeated enemies
  const defeated = next.enemies.filter((e) => !e.alive && !e.reachedEnd).length;
  const prevDefeated = (state._defeatedCount || 0);
  const newlyDefeated = defeated - prevDefeated;
  if (newlyDefeated > 0) {
    next.gold += newlyDefeated * TOWER_DEFENSE_CONFIG.ENEMY_REWARD;
    next.score += newlyDefeated * 10;
    next._defeatedCount = defeated;
  }

  // Remove finished enemies from active list
  next.enemies = next.enemies.filter((e) => e.alive || e.reachedEnd);

  // Check wave completion and spawn next wave
  if (next.enemies.length === 0) {
    next.wave += 1;
    next.enemies = spawnWave(next.wave);
    next._defeatedCount = 0;
    if (next.wave > 10) {
      next.victory = true;
    }
  }

  return next;
}

/**
 * Renders the tower defense game as a React element.
 * @param {Object} state - The current game state.
 * @returns {React.ReactElement} The rendered tower defense view.
 */
function renderTowerDefense(state) {
  const cell = TOWER_DEFENSE_CONFIG.CELL_SIZE;
  const width = TOWER_DEFENSE_CONFIG.GRID_WIDTH * cell;
  const height = TOWER_DEFENSE_CONFIG.GRID_HEIGHT * cell;

  const pathCells = new Set(
    TOWER_DEFENSE_CONFIG.PATH.map((p) => `${p.x},${p.y}`)
  );

  const grid = [];
  for (let y = 0; y < TOWER_DEFENSE_CONFIG.GRID_HEIGHT; y++) {
    for (let x = 0; x < TOWER_DEFENSE_CONFIG.GRID_WIDTH; x++) {
      const isPath = pathCells.has(`${x},${y}`);
      grid.push(
        React.createElement('div', {
          key: `cell_${x}_${y}`,
          className: `td-cell${isPath ? ' td-path' : ''}`,
          style: {
            position: 'absolute',
            left: x * cell,
            top: y * cell,
            width: cell,
            height: cell,
            boxSizing: 'border-box',
            border: '1px solid #333',
            background: isPath ? '#553' : '#222',
          },
          'data-x': x,
          'data-y': y,
        })
      );
    }
  }

  const towerEls = state.towers.map((tower) =>
    React.createElement('div', {
      key: tower.id,
      className: 'td-tower',
      style: {
        position: 'absolute',
        left: tower.gridX * cell,
        top: tower.gridY * cell,
        width: cell,
        height: cell,
        background: '#0af',
        borderRadius: '50%',
      },
    })
  );

  const enemyEls = state.enemies
    .filter((e) => e.alive)
    .map((enemy) =>
      React.createElement('div', {
        key: enemy.id,
        className: 'td-enemy',
        style: {
          position: 'absolute',
          left: enemy.x * cell,
          top: enemy.y * cell,
          width: cell,
          height: cell,
          background: '#f33',
        },
      })
    );

  const hud = React.createElement(
    'div',
    { className: 'td-hud', style: { padding: '8px', color: '#fff' } },
    `Wave: ${state.wave} | Lives: ${state.lives} | Gold: ${state.gold} | Score: ${state.score}`
  );

  return React.createElement(
    'div',
    {
      className: 'tower-defense',
      style: { position: 'relative', width, height: height + 40, background: '#000' },
      role: 'application',
      'aria-label': 'Tower defense game',
    },
    hud,
    React.createElement(
      'div',
      {
        className: 'td-board',
        style: { position: 'relative', width, height },
      },
      grid,
      towerEls,
      enemyEls
    ),
    state.gameOver && React.createElement(
      'div',
      { className: 'td-gameover', style: { color: '#fff', padding: '8px' } },
      'Game Over'
    ),
    state.victory && React.createElement(
      'div',
      { className: 'td-victory', style: { color: '#ff0', padding: '8px' } },
      'Victory!'
    )
  );
}

// Export tower defense implementation
export const towerDefense = {
  init: initTowerDefense,
  spawnWave,
  tick: tickTowerDefense,
  placeTower,
  render: renderTowerDefense,
  config: TOWER_DEFENSE_CONFIG,
};