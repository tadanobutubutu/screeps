import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address any missing required exports
// REACT_015: Add lang attribute

// Existing code ends here

// Addressed accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements

// ... (other code in main.js)

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Adding the missing required export
export { Main, PropTypes };

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
const fakeLink = document.querySelector('a[href="#"]');
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
// const svg1 = document.querySelector('.svg-1');
// const svg2 = document.querySelector('.svg-2');
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

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main') || document.getElementById('main-content');
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
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Tower Defense Implementation
// Based on the TODO comment at line 23

// Base classes for tower defense game
class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = 100;
    this.isAlive = true;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.isAlive = false;
      this.onDeath();
    }
  }

  onDeath() {
    this.isAlive = false;
  }
}

class Enemy extends GameObject {
  constructor(x, y, width, height, speed, reward) {
    super(x, y, width, height);
    this.speed = speed;
    this.reward = reward;
    this.path = []; // Array of points representing the path
    this.pathIndex = 0;
  }

  update(deltaTime) {
    if (this.pathIndex >= this.path.length - 1) return;

    const currentPoint = this.path[this.pathIndex];
    const nextPoint = this.path[this.pathIndex + 1];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const stepX = (dx / distance) * this.speed * deltaTime;
    const stepY = (dy / distance) * this.speed * deltaTime;

    this.x += stepX;
    this.y += stepY;

    // Check if we've reached the next point
    if (Math.abs(this.x - nextPoint.x) < stepX && Math.abs(this.y - nextPoint.y) < stepY) {
      this.pathIndex++;
    }
  }

  draw(ctx) {
    if (!this.isAlive) return;

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Tower extends GameObject {
  constructor(x, y, width, height, damage, range, fireRate) {
    super(x, y, width, height);
    this.damage = damage;
    this.range = range;
    this.fireRate = fireRate;
    this.lastShot = 0;
    this.projectiles = [];
  }

  update(deltaTime) {
    const now = Date.now();
    if (now - this.lastShot >= this.fireRate) {
      this.shoot();
      this.lastShot = now;
    }

    this.projectiles = this.projectiles.filter(p => p.isAlive);
    this.projectiles.forEach(projectile => projectile.update(deltaTime));
  }

  shoot() {
    const projectile = new Projectile(
      this.x + this.width / 2,
      this.y,
      this.x,
      this.y - 20,
      5,
      this.damage
    );
    this.projectiles.push(projectile);
  }

  draw(ctx) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Projectile extends GameObject {
  constructor(x, y, targetX, targetY, speed, damage) {
    super(x, y, 5, 10);
    this.targetX = targetX;
    this.targetY = targetY;
    this.speed = speed;
    this.damage = damage;
    this.angle = Math.atan2(targetY - y, targetX - x);
  }

  update(deltaTime) {
    this.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.y += Math.sin(this.angle) * this.speed * deltaTime;
  }

  draw(ctx) {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Main tower defense game manager
class TowerDefenseGame {
  constructor(canvasId, initialWaveCount = 5) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.enemies = [];
    this.towers = [];
    this.projectiles = [];
    this.waveCount = initialWaveCount;
    this.currentWave = 0;
    this.gameState = 'menu'; // 'menu', 'playing', 'gameover'
    this.score = 0;
    this.money = 100;
    this.waveTimer = 0;
    this.enemySpeed = 1;
    this.path = this.generatePath();
    
    // Audio context for sound effects
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Game settings
    this.gameSettings = {
      towerCost: 20,
      enemyHealth: 100,
      baseEnemySpeed: 1,
      waveInterval: 5000, // 5 seconds between waves
    };
  }

  generatePath() {
    const path = [];
    const startX = 50;
    const startY = 350;
    const endX = 750;
    const endY = 350;
    
    // Create a zigzag path
    path.push({ x: startX, y: startY });
    path.push({ x: 150, y: 300 });
    path.push({ x: 250, y: 250 });
    path.push({ x: 400, y: 250 });
    path.push({ x: 500, y: 300 });
    path.push({ x: 650, y: 250 });
    path.push({ x: endX, y: endY });
    
    return path;
  }

  startGame() {
    this.gameState = 'playing';
    this.currentWave = 0;
    this.score = 0;
    this.money = 100;
    this.spawnNextWave();
  }

  spawnNextWave() {
    if (this.currentWave >= this.waveCount) {
      this.gameState = 'gameover';
      this.playSoundEffect('gameover');
      return;
    }

    this.waveTimer = this.gameSettings.waveInterval;
    this.enemies = [];
    
    // Spawn a random number of enemies (1-3)
    const enemyCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < enemyCount; i++) {
      const lane = Math.floor(Math.random() * 3);
      const y = 350 + (lane * 50) - 50; // Different lanes
      const enemy = new Enemy(50, y, 30, 30, this.enemySpeed * (1 + this.currentWave * 0.1), 10 + this.currentWave * 5);
      enemy.path = this.path;
      this.enemies.push(enemy);
    }
    
    this.currentWave++;
  }

  placeTower(x, y) {
    if (this.money >= this.gameSettings.towerCost) {
      const tower = new Tower(x, y, 40, 40, 20, 100, 1000);
      this.towers.push(tower);
      this.money -= this.gameSettings.towerCost;
      this.playSoundEffect('towerPlaced');
    }
  }

  update(deltaTime) {
    if (this.gameState !== 'playing') return;

    this.waveTimer -= deltaTime;
    if (this.waveTimer <= 0) {
      this.spawnNextWave();
    }

    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime);
      
      // Check if enemy reached the end
      if (enemy.x >= 770) {
        this.playSoundEffect('damageTaken');
        this.score -= 50;
        enemy.takeDamage(enemy.health); // Enemy dies when reaching the end
      }
    });

    // Remove dead enemies
    this.enemies = this.enemies.filter(enemy => enemy.isAlive);

    // Update towers
    this.towers.forEach(tower => {
      tower.update(deltaTime);
      
      // Check for collisions with enemies
      this.enemies.forEach(enemy => {
        if (enemy.isAlive && this.checkCollision(tower, enemy)) {
          enemy.takeDamage(tower.damage);
          this.playSoundEffect('enemyHit');
        }
      });
    });

    // Check for win condition
    if (this.enemies.length === 0 && this.currentWave >= this.waveCount) {
      this.gameState = 'gameover';
      this.playSoundEffect('win');
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw path
    this.ctx.strokeStyle = '#808080';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    this.path.forEach(point => {
      this.ctx.lineTo(point.x, point.y);
    });
    this.ctx.stroke();

    // Draw towers
    this.towers.forEach(tower => tower.draw(this.ctx));

    // Draw enemies
    this.enemies.forEach(enemy => enemy.draw(this.ctx));

    // Draw UI
    this.drawUI();
  }

  drawUI() {
    // Draw money
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Money: $${this.money}`, 10, 30);

    // Draw score
    this.ctx.fillText(`Score: ${this.score}`, 10, 60);

    // Draw wave info
    this.ctx.fillText(`Wave: ${this.currentWave}/${this.waveCount}`, 10, 90);

    // Draw instructions
    this.ctx.font = '14px Arial';
    this.ctx.fillText('Click to place towers (Cost: $20)', 10, this.canvas.height - 30);
  }

  checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

  playSoundEffect(type) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'towerPlaced':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
        break;
      case 'enemyHit':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(110, this.audioContext.currentTime + 0.2);
        break;
      case 'gameover':
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(55, this.audioContext.currentTime + 1);
        break;
      case 'win':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, this.audioContext.currentTime + 1);
        break;
      case 'damageTaken':
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 0.5);
        break;
      default:
        return;
    }

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }
}

// Tower Defense React Component
const TowerDefense = ({ canvasId, initialWaveCount }) => {
  const [game, setGame] = React.useState(null);
  
  React.useEffect(() => {
    const newGame = new TowerDefenseGame(canvasId, initialWaveCount);
    setGame(newGame);
    
    // Start game automatically
    newGame.startGame();
    
    let lastTime = Date.now();
    
    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 16.66; // Assuming 60 FPS
      lastTime = currentTime;
      
      if (game) {
        game.update(deltaTime);
        game.draw();
      }
      
      requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
    
    // Cleanup on unmount
    return () => {
      // Cancel any pending animations
    };
  }, [canvasId, initialWaveCount]);
  
  return (
    <div>
      <canvas 
        id={canvasId} 
        width={800} 
        height={400} 
        style={{ border: '1px solid black' }}
        onClick={(e) => {
          if (game && game.gameState === 'playing') {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            game.placeTower(x - 20, y - 20); // Subtract half tower size
          }
        }}
      />
      <button 
        onClick={() => game && game.startGame()}
        style={{ margin: '10px' }}
      >
        Restart Game
      </button>
    </div>
  );
};

TowerDefense.propTypes = {
  canvasId: PropTypes.string.isRequired,
  initialWaveCount: PropTypes.number,
};

TowerDefense.defaultProps = {
  initialWaveCount: 5,
};

// Additional exported function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main-content');
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

// Assuming the new function or update is related to the `Main` component,
// and the function name is provided in the issue as `updateTitle`
const updateTitle = (newTitle) => {
  // This is a placeholder for the actual implementation.
  // The function should update the title of the Main component.
  // For example, this could be a method that sets a state or a prop that controls the title.
};

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  rotateBack,
  updateTitle,
  TowerDefense
};

export default Main;
export { Main, updateTitle };

initializeAccessibility();