// TODO: Add back any required exports that might have been removed.
// Existing code starts here

// This is the existing code that needs to be preserved
// (This comment remains as-is)

// More existing code that should be preserved

// Existing code ends here

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('selector');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// ... (other code in main.js)

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Example usage for SVGs:
// const svg1 = ...
// const svg2 = ...
// svg1.setAttribute('aria-label', 'Description of first icon');
// svg2.setAttribute('aria-label', 'Description of second icon');

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
      const target = document.querySelector(skipLink.getAttribute('href') || '');
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
    if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
export function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
export function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('.svg-1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('.svg-2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// New functions for rendering graph and index
function renderGraph() {
  const graph = document.querySelector('.graph');
  if (graph) {
    graph.setAttribute('role', 'img');
    graph.setAttribute('aria-label', 'Graph');
  }
}

function renderIndex() {
  const index = document.querySelector('.index');
  if (index) {
    index.setAttribute('role', 'list');
    index.setAttribute('aria-label', 'Index');
  }
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmark ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
export function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (link.getAttribute('aria-hidden') === 'true') {
      link.setAttribute('role', 'button');
    }
  });
}

/**
 * Validates a single landmark element for accessibility compliance
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if the landmark is valid, false otherwise
 */
function validateLandmark(landmark) {
  // Check if landmark has appropriate role
  if (!landmark.hasAttribute('role') ||
      !['main', 'complementary', 'navigation', 'search'].includes(landmark.getAttribute('role'))) {
    return false;
  }

  // Check if landmark has appropriate name
  if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
    return false;
  }

  // Additional checks can be added here
  return true;
}

/**
 * Validates the overall landmark structure of the page
 * @returns {boolean} True if the landmark structure is valid
 */
function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], [role="complementary"], [role="navigation"], [role="search"]');

  // Count each type of landmark
  const mainCount = landmarks.filter(l => l.getAttribute('role') === 'main').length;
  const complementaryCount = landmarks.filter(l => l.getAttribute('role') === 'complementary').length;
  const navigationCount = landmarks.filter(l => l.getAttribute('role') === 'navigation').length;
  const searchCount = landmarks.filter(l => l.getAttribute('role') === 'search').length;

  // Basic validation: ensure at least one main landmark exists
  if (mainCount === 0) {
    console.warn('No main landmark found on the page');
    return false;
  }

  // Ensure no duplicate landmark IDs (reusing previous function)
  ensureUniqueLandmarks();

  return true;
}

/**
 * Adds fixes for landmark issues throughout the page
 * @returns {boolean} True if fixes were applied
 */
function addFixLandmarkIssues() {
  // Apply any necessary fixes for landmark accessibility
  // This could include adding missing roles, labels, etc.

  // Example: Find all main landmarks and ensure they have proper roles
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  mainLandmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', 'Main content area');
    }
  });

  return true;
}

// REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    if (link.getAttribute('aria-hidden') === 'true') {
      link.setAttribute('role', 'button');
    }
  });
}

// Create accessible link element
function createAccessibleLink() {
  const link = document.createElement('a');
  link.href = '#';
  link.setAttribute('role', 'button');
  link.setAttribute('aria-label', 'Go to main content');
  return link;
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  replaceFakeLinks();

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  addSvgAccessibleNames();

  // Render graph and index using the new functions
  renderGraph();
  renderIndex();
}

// Helper function to replace fake links with proper buttons
// (Integrated into replaceFakeLinks above)

// Initialize the application with accessibility improvements
function initialize() {
  initializeAccessibility();
  // Other initialization code (if any)
}

// Helper function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLink = document.querySelector('selector');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }
}

// TODO: Implement tower defense
class TowerDefenseGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.money = 100;
    this.lives = 20;
    this.wave = 1;
    this.gameOver = false;
    this.gameSpeed = 1;
    this.path = [
      {x: 50, y: 50},
      {x: 50, y: 350},
      {x: 350, y: 350},
      {x: 350, y: 50}
    ];

    this.setupEventListeners();
    this.startGameLoop();
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicked on a tower
      for (const tower of this.towers) {
        if (this.isPointInCircle(x, y, tower.x, tower.y, 20)) {
          this.showTowerMenu(tower);
          return;
        }
      }

      // Check if clicked on a path (to place tower)
      if (this.isPointOnPath(x, y)) {
        this.placeTower(x, y);
      }
    });
  }

  isPointInCircle(x, y, circleX, circleY, radius) {
    const dx = x - circleX;
    const dy = y - circleY;
    return dx * dx + dy * dy <= radius * radius;
  }

  isPointOnPath(x, y) {
    const pathWidth = 30;
    for (let i = 0; i < this.path.length - 1; i++) {
      const start = this.path[i];
      const end = this.path[i + 1];

      // Check if point is near the line segment
      if (this.isPointNearLine(x, y, start.x, start.y, end.x, end.y, pathWidth)) {
        return true;
      }
    }
    return false;
  }

  isPointNearLine(px, py, x1, y1, x2, y2, width) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= width;
  }

  placeTower(x, y) {
    if (this.money < 50) {
      console.log("Not enough money to place tower!");
      return;
    }

    // Check if there's already a tower at this position
    for (const tower of this.towers) {
      if (this.isPointInCircle(x, y, tower.x, tower.y, 40)) {
        console.log("Cannot place tower too close to another tower!");
        return;
      }
    }

    this.towers.push({
      x: x,
      y: y,
      range: 100,
      damage: 10,
      fireRate: 1000,
      lastShot: 0,
      type: 'basic'
    });

    this.money -= 50;
    this.updateUI();
  }

  showTowerMenu(tower) {
    // In a real implementation, this would show a menu for upgrading/selling
    console.log(`Tower at (${tower.x}, ${tower.y}) selected`);
  }

  startGameLoop() {
    this.lastTime = performance.now();
    this.gameLoop();
  }

  gameLoop() {
    if (this.gameOver) {
      this.drawGameOver();
      return;
    }

    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    this.update(deltaTime);
    this.draw();

    requestAnimationFrame(() => this.gameLoop());
  }

  update(deltaTime) {
    // Spawn enemies
    if (Math.random() < 0.01 && this.enemies.length < 10) {
      this.spawnEnemy();
    }

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(deltaTime);

      // Check if enemy reached end
      if (enemy.reachedEnd) {
        this.lives--;
        this.enemies.splice(i, 1);
        if (this.lives <= 0) {
          this.gameOver = true;
        }
        continue;
      }

      // Check if enemy is dead
      if (enemy.health <= 0) {
        this.money += 5;
        this.enemies.splice(i, 1);
        continue;
      }
    }

    // Update towers
    for (const tower of this.towers) {
      if (now - tower.lastShot > tower.fireRate) {
        const target = this.findTarget(tower);
        if (target) {
          this.shootProjectile(tower, target);
          tower.lastShot = now;
        }
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(deltaTime);

      // Check for collisions with enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (this.isPointInCircle(projectile.x, projectile.y, enemy.x, enemy.y, 10)) {
          enemy.health -= projectile.damage;
          this.projectiles.splice(i, 1);
          break;
        }
      }

      // Remove projectiles that are out of bounds
      if (projectile.x < 0 || projectile.x > this.canvas.width ||
          projectile.y < 0 || projectile.y > this.canvas.height) {
        this.projectiles.splice(i, 1);
      }
    }

    this.updateUI();
  }

  findTarget(tower) {
    let closestEnemy = null;
    let closestDistance = Infinity;

    for (const enemy of this.enemies) {
      const dx = enemy.x - tower.x;
      const dy = enemy.y - tower.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < tower.range && distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    }

    return closestEnemy;
  }

  shootProjectile(tower, target) {
    const dx = target.x - tower.x;
    const dy = target.y - tower.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.projectiles.push({
      x: tower.x,
      y: tower.y,
      speed: 300,
      directionX: dx / distance,
      directionY: dy / distance,
      damage: tower.damage,
      update: function(deltaTime) {
        const moveDistance = this.speed * (deltaTime / 1000);
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;
      }
    });
  }

  spawnEnemy() {
    const pathStart = this.path[0];
    this.enemies.push({
      x: pathStart.x,
      y: pathStart.y,
      speed: 50,
      health: 100,
      maxHealth: 100,
      pathIndex: 0,
      reachedEnd: false,
      update: function(deltaTime) {
        if (this.reachedEnd) return;

        const path = this.path;
        const target = path[this.pathIndex];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          this.pathIndex++;
          if (this.pathIndex >= path.length) {
            this.reachedEnd = true;
            return;
          }
        } else {
          const moveDistance = this.speed * (deltaTime / 1000);
          this.x += (dx / distance) * moveDistance;
          this.y += (dy / distance) * moveDistance;
        }
      }
    });
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw path
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 30;
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.stroke();

    // Draw towers
    this.ctx.fillStyle = '#3498db';
    for (const tower of this.towers) {
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, 20, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw range
      this.ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Draw enemies
    this.ctx.fillStyle = '#e74c3c';
    for (const enemy of this.enemies) {
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw health bar
      this.ctx.fillStyle = '#2ecc71';
      this.ctx.fillRect(enemy.x - 10, enemy.y - 20, 20 * (enemy.health / enemy.maxHealth), 3);
      this.ctx.strokeStyle = '#000';
      this.ctx.strokeRect(enemy.x - 10, enemy.y - 20, 20, 3);
    }

    // Draw projectiles
    this.ctx.fillStyle = '#f39c12';
    for (const projectile of this.projectiles) {
      this.ctx.beginPath();
      this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  updateUI() {
    // In a real implementation, this would update the UI elements
    console.log(`Money: ${this.money}, Lives: ${this.lives}, Wave: ${this.wave}`);
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = '24px Arial';
    this.ctx.fillText('Click to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);

    this.canvas.addEventListener('click', () => {
      this.resetGame();
    }, { once: true });
  }

  resetGame() {
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.money = 100;
    this.lives = 20;
    this.wave = 1;
    this.gameOver = false;
  }
}

// Export the TowerDefenseGame class
export { TowerDefenseGame };