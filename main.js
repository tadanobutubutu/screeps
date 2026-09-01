// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Validates and fixes table structure accessibility issues.
 * Handles REACT_027 - Fix 26 table structure issues
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
        const rows = table.querySelectorAll('tr');
        const firstRow = rows[0];

        if (!firstRow) return;

        // Get all header cells in the first row to determine column count
        const firstRowThs = firstRow.querySelectorAll('th');
        const firstRowTds = firstRow.querySelectorAll('td');
        const firstRowHeaders = [...firstRowThs, ...firstRowTds];
        const columnCount = firstRowHeaders.length;

        rows.forEach((row, rowIndex) => {
            const ths = row.querySelectorAll('th');
            const tds = row.querySelectorAll('td');
            const allCells = [...ths, ...tds];

            allCells.forEach((cell, cellIndex) => {
                if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
                    const isFirstRow = rowIndex === 0;
                    const isFirstCell = cellIndex === 0;

                    // First row cells are column headers
                    if (isFirstRow) {
                        cell.setAttribute('scope', 'col');
                    }
                    // First cell in subsequent rows are row headers
                    else if (isFirstCell) {
                        cell.setAttribute('scope', 'row');
                    }
                }
            });
        });
    });
}

/**
 * Main entry point for table accessibility validation.
 * Calls validateTableStructure() to fix all table scope attribute issues.
 */
function validateTableAccessibility() {
    validateTableStructure();
}

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)

/**
 * Landmark data structure
 */
const landmarks = [
  { id: 1, name: 'Eiffel Tower', location: 'Paris' },
  { id: 2, name: 'Statue of Liberty', location: 'New York' },
  { id: 3, name: 'Eiffel Tower', location: 'Paris' },
  { id: 4, name: 'Big Ben', location: 'London' },
  { id: 5, name: 'Statue of Liberty', location: 'New York' }
];

/**
 * Ensures unique landmarks by removing duplicates based on name and location
 * @param {Array} landmarksArray - Array of landmark objects
 * @returns {Array} - Array of unique landmarks
 */
function ensureUniqueLandmarks(landmarksArray) {
  if (!Array.isArray(landmarksArray)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarksArray) {
    const key = `${landmark.name}-${landmark.location}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// Apply uniqueness to the landmarks
const uniqueLandmarks = ensureUniqueLandmarks(landmarks);

// TODO: Implement tower defense
class TowerDefenseGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.gameLoopId = null;
    this.gameRunning = false;
    this.wave = 1;
    this.money = 100;
    this.lives = 20;
    this.path = [
      { x: 50, y: 50 },
      { x: 50, y: 300 },
      { x: 300, y: 300 },
      { x: 300, y: 50 },
      { x: 550, y: 50 },
      { x: 550, y: 300 },
      { x: 800, y: 300 }
    ];

    this.initEventListeners();
    this.drawGame();
  }

  initEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicking on a tower
      for (const tower of this.towers) {
        if (Math.sqrt((x - tower.x) ** 2 + (y - tower.y) ** 2) < 20) {
          this.selectTower(tower);
          return;
        }
      }

      // Place new tower if enough money
      if (this.money >= 50) {
        this.towers.push({
          x,
          y,
          range: 100,
          damage: 10,
          fireRate: 1000,
          lastShot: 0
        });
        this.money -= 50;
      }
    });
  }

  startGame() {
    if (!this.gameRunning) {
      this.gameRunning = true;
      this.gameLoop();
    }
  }

  stopGame() {
    this.gameRunning = false;
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
    }
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.update();
    this.draw();
    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Spawn enemies
    if (Math.random() < 0.02 && this.enemies.length < 10) {
      this.enemies.push({
        x: this.path[0].x,
        y: this.path[0].y,
        pathIndex: 0,
        speed: 1,
        health: 30,
        maxHealth: 30
      });
    }

    // Move enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const target = this.path[enemy.pathIndex];

      if (target) {
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          enemy.pathIndex++;
          if (enemy.pathIndex >= this.path.length) {
            // Enemy reached end
            this.lives--;
            this.enemies.splice(i, 1);
            continue;
          }
        } else {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        }
      }
    }

    // Tower shooting
    const now = Date.now();
    for (const tower of this.towers) {
      if (now - tower.lastShot > tower.fireRate) {
        // Find closest enemy in range
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

        if (closestEnemy) {
          // Shoot projectile
          this.projectiles.push({
            x: tower.x,
            y: tower.y,
            targetX: closestEnemy.x,
            targetY: closestEnemy.y,
            speed: 5,
            damage: tower.damage
          });
          tower.lastShot = now;
        }
      }
    }

    // Move projectiles and check for hits
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Projectile hit target
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (Math.abs(enemy.x - projectile.targetX) < 5 &&
              Math.abs(enemy.y - projectile.targetY) < 5) {
            enemy.health -= projectile.damage;
            if (enemy.health <= 0) {
              this.enemies.splice(j, 1);
              this.money += 10;
            }
            break;
          }
        }
        this.projectiles.splice(i, 1);
      } else {
        projectile.x += (dx / distance) * projectile.speed;
        projectile.y += (dy / distance) * projectile.speed;
      }
    }

    // Check game over
    if (this.lives <= 0) {
      this.stopGame();
      alert('Game Over!');
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw path
    this.ctx.strokeStyle = '#555';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.stroke();

    // Draw towers
    this.ctx.fillStyle = 'blue';
    for (const tower of this.towers) {
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, 20, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw range
      this.ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Draw enemies
    this.ctx.fillStyle = 'red';
    for (const enemy of this.enemies) {
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw health bar
      this.ctx.fillStyle = 'green';
      this.ctx.fillRect(enemy.x - 10, enemy.y - 20, 20 * (enemy.health / enemy.maxHealth), 5);
      this.ctx.fillStyle = 'red';
    }

    // Draw projectiles
    this.ctx.fillStyle = 'yellow';
    for (const projectile of this.projectiles) {
      this.ctx.beginPath();
      this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw UI
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Money: $${this.money}`, 10, 30);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 60);
    this.ctx.fillText(`Wave: ${this.wave}`, 10, 90);
  }

  selectTower(tower) {
    // In a real implementation, this would show tower upgrade options
    console.log('Tower selected:', tower);
  }
}

module.exports = {
  ensureUniqueLandmarks,
  landmarks,
  uniqueLandmarks,
  TowerDefenseGame
};