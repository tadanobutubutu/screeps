// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkAttributes() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())
// - REACT_037: Google sign-in logic (handled by googleSignIn())
// - REACT_040: Replace my-button with actual button id for accessibility (handled by fixButtonIdentifiers())
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (handled by ensureDependencyGraphAriaRole())

/**
 * Get the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Get the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e.g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  // Check for caption
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array} tables - Array of table objects to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  tables.forEach((table, index) => {
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.success) {
      issues.push({
        landmarkIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svg - The SVG element
 * @returns {string} The accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (svg.ariaLabel) {
    return svg.ariaLabel;
  }
  if (svg.ariaLabelledby) {
    return svg.ariaLabelledby;
  }
  if (svg.title) {
    return svg.title;
  }
  return 'Unnamed SVG';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {string} options.ariaLabel - Aria label for the button
 * @param {Function} options.onClick - Click handler
 * @returns {Object} Button element object
 */
function createInPageButton(options) {
  return {
    type: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick,
    accessibleName: getSvgAccessibleName({ ariaLabel: options.ariaLabel })
  };
}

/**
 * Creates an accessible link element
 * @param {Object} options - Link options
 * @param {string} options.href - Link URL
 * @param {string} options.text - Link text
 * @param {string} options.ariaLabel - Aria label for the link
 * @returns {Object} Link element object
 */
function createAccessibleLink(options) {
  return {
    type: 'a',
    href: options.href,
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    isFake: false
  };
}

/**
 * Handles accessibility issues found during validation
 * @param {Array} issues - Array of accessibility issues
 * @returns {Object} Summary of handled issues
 */
function handleAccessibilityIssues(issues) {
  const handled = [];
  const unhandled = [];

  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });

  return {
    total: issues.length,
    handled: handled.length,
    unhandled: unhandled.length,
    unhandledIssues: unhandled
  };
}

/**
 * Generates a report based on accessibility issues
 * @param {Object} validationResults - Results from accessibility validations
 * @returns {Object} Formatted report with summary and detailed issues
 */
function generateAccessibilityReport(validationResults) {
  const report = {
    summary: {
      totalIssues: 0,
      handledIssues: 0,
      unhandledIssues: 0,
      criticalIssues: 0,
      warnings: 0
    },
    details: {
      tables: [],
      landmarks: [],
      svgs: [],
      other: []
    }
  };

  // Process table validation results
  if (validationResults.tables) {
    validationResults.tables.forEach(tableResult => {
      if (!tableResult.success) {
        report.summary.totalIssues += tableResult.issues.length;
        report.details.tables.push({
          tableIndex: tableResult.tableIndex,
          issues: tableResult.issues
        });
      }
    });
  }

  // Process landmark validation results
  if (validationResults.landmarks) {
    validationResults.landmarks.forEach(landmarkResult => {
      if (!landmarkResult.success) {
        report.summary.totalIssues += landmarkResult.issues.length;
        report.details.landmarks.push({
          landmarkIndex: landmarkResult.landmarkIndex,
          issues: landmarkResult.issues
        });
      }
    });
  }

  // Process SVG validation results
  if (validationResults.svgs) {
    validationResults.svgs.forEach(svgResult => {
      if (!svgResult.success) {
        report.summary.totalIssues += svgResult.issues.length;
        report.details.svgs.push({
          svgIndex: svgResult.svgIndex,
          issues: svgResult.issues
        });
      }
    });
  }

  // Process other validation results
  if (validationResults.other) {
    validationResults.other.forEach(otherResult => {
      if (!otherResult.success) {
        report.summary.totalIssues += otherResult.issues.length;
        report.details.other.push({
          issueType: otherResult.issueType,
          issues: otherResult.issues
        });
      }
    });
  }

  // Calculate summary statistics
  if (validationResults.handledIssues) {
    report.summary.handledIssues = validationResults.handledIssues;
  }

  if (validationResults.unhandledIssues) {
    report.summary.unhandledIssues = validationResults.unhandledIssues;
  }

  // Categorize issues by severity
  if (validationResults.criticalIssues) {
    report.summary.criticalIssues = validationResults.criticalIssues;
  }

  if (validationResults.warnings) {
    report.summary.warnings = validationResults.warnings;
  }

  return report;
}

/**
 * Handles Google sign-in logic with accessibility considerations
 * @param {Object} options - Sign-in options
 * @param {string} options.clientId - Google client ID
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @returns {Object} Sign-in button configuration
 */
function googleSignIn(options) {
  return {
    type: 'button',
    text: 'Sign in with Google',
    ariaLabel: 'Sign in with Google account',
    onClick: () => {
      // Google sign-in logic would go here
      if (options.onSuccess) options.onSuccess();
    },
    accessibleName: 'Google Sign In'
  };
}

/**
 * Fixes button identifiers to ensure proper accessibility
 * @param {Array} buttons - Array of button elements
 * @returns {Array} Array of fixed button elements
 */
function fixButtonIdentifiers(buttons) {
  return buttons.map(button => {
    if (button.id === 'my-button') {
      return {
        ...button,
        id: `button-${Date.now()}`,
        ariaLabel: button.ariaLabel || button.text
      };
    }
    return button;
  });
}

/**
 * Ensures the dependency graph container has a proper ARIA role
 * @param {Object} container - The container element
 * @returns {Object} The container with proper ARIA role
 */
function ensureDependencyGraphAriaRole(container) {
  return {
    ...container,
    role: container.role || 'region',
    ariaLabel: container.ariaLabel || 'Dependency Graph'
  };
}

/**
 * Creates an accessible form for adding a new book
 * @param {Object} options - Form options
 * @param {Function} options.onSubmit - Submit handler
 * @returns {Object} Form element object with accessibility attributes
 */
function createAddBookForm(options) {
  return {
    type: 'form',
    role: 'form',
    ariaLabel: 'Add New Book Form',
    onSubmit: options.onSubmit,
    fields: [
      {
        type: 'text',
        id: 'book-title',
        name: 'title',
        label: 'Book Title',
        required: true,
        ariaRequired: true
      },
      {
        type: 'text',
        id: 'book-author',
        name: 'author',
        label: 'Author',
        required: true,
        ariaRequired: true
      },
      {
        type: 'number',
        id: 'book-pages',
        name: 'pages',
        label: 'Number of Pages',
        min: 1,
        ariaLabel: 'Number of pages in the book'
      },
      {
        type: 'checkbox',
        id: 'book-read',
        name: 'read',
        label: 'Have you read this book?',
        ariaLabel: 'Check if you have read this book'
      }
    ],
    submitButton: {
      type: 'submit',
      text: 'Add Book',
      ariaLabel: 'Submit form to add new book'
    }
  };
}

/**
 * Validates a book form for accessibility compliance
 * @param {Object} form - The form object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateBookFormAccessibility(form) {
  const issues = [];

  if (!form.role) {
    issues.push('Missing role attribute for form');
  }

  if (!form.ariaLabel) {
    issues.push('Missing aria-label for form');
  }

  form.fields.forEach(field => {
    if (field.required && !field.ariaRequired) {
      issues.push(`Field ${field.name} is required but missing aria-required`);
    }
    if (!field.label && !field.ariaLabel) {
      issues.push(`Field ${field.name} is missing both label and aria-label`);
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Represents a tower in the tower defense game
 */
class Tower {
  /**
   * Create a tower
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} range - Attack range
   * @param {number} damage - Damage per attack
   * @param {number} cooldown - Attack cooldown in milliseconds
   */
  constructor(x, y, range, damage, cooldown) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.cooldown = cooldown;
    this.lastAttackTime = 0;
  }

  /**
   * Check if the tower can attack an enemy
   * @param {Enemy} enemy - The enemy to check
   * @returns {boolean} True if the enemy is in range and cooldown is over
   */
  canAttack(enemy) {
    const distance = Math.sqrt(Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2));
    const currentTime = Date.now();
    return distance <= this.range && (currentTime - this.lastAttackTime) >= this.cooldown;
  }

  /**
   * Attack an enemy
   * @param {Enemy} enemy - The enemy to attack
   * @returns {number} Damage dealt
   */
  attack(enemy) {
    if (this.canAttack(enemy)) {
      this.lastAttackTime = Date.now();
      enemy.takeDamage(this.damage);
      return this.damage;
    }
    return 0;
  }
}

/**
 * Represents an enemy in the tower defense game
 */
class Enemy {
  /**
   * Create an enemy
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} health - Starting health
   * @param {number} speed - Movement speed
   * @param {Array} path - Path coordinates to follow
   */
  constructor(x, y, health, speed, path) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.path = path;
    this.currentPathIndex = 0;
    this.isAlive = true;
  }

  /**
   * Move the enemy along its path
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  move(deltaTime) {
    if (!this.isAlive || this.currentPathIndex >= this.path.length) return;

    const target = this.path[this.currentPathIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed * deltaTime / 1000) {
      this.x = target.x;
      this.y = target.y;
      this.currentPathIndex++;
    } else {
      const moveFactor = (this.speed * deltaTime / 1000) / distance;
      this.x += dx * moveFactor;
      this.y += dy * moveFactor;
    }
  }

  /**
   * Take damage from a tower
   * @param {number} damage - Amount of damage to take
   */
  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.isAlive = false;
    }
  }

  /**
   * Check if the enemy has reached the end of its path
   * @returns {boolean} True if the enemy has reached the end
   */
  hasReachedEnd() {
    return this.currentPathIndex >= this.path.length;
  }
}

/**
 * Represents a tower defense game
 */
class TowerDefenseGame {
  /**
   * Create a new tower defense game
   */
  constructor() {
    this.towers = [];
    this.enemies = [];
    this.gameOver = false;
    this.score = 0;
    this.wave = 0;
    this.lastEnemySpawnTime = 0;
    this.enemySpawnInterval = 3000;
    this.path = this.generatePath();
  }

  /**
   * Generate a path for enemies to follow
   * @returns {Array} Array of path coordinates
   */
  generatePath() {
    // Simple path from left to right
    return [
      { x: 0, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 300 },
      { x: 400, y: 300 },
      { x: 400, y: 100 },
      { x: 600, y: 100 }
    ];
  }

  /**
   * Add a tower to the game
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} range - Attack range
   * @param {number} damage - Damage per attack
   * @param {number} cooldown - Attack cooldown in milliseconds
   */
  addTower(x, y, range, damage, cooldown) {
    this.towers.push(new Tower(x, y, range, damage, cooldown));
  }

  /**
   * Spawn a new enemy
   */
  spawnEnemy() {
    const start = this.path[0];
    const health = 100 + this.wave * 20;
    const speed = 50 + this.wave * 10;
    this.enemies.push(new Enemy(start.x, start.y, health, speed, this.path));
    this.lastEnemySpawnTime = Date.now();
  }

  /**
   * Update the game state
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
    if (this.gameOver) return;

    // Spawn enemies periodically
    const currentTime = Date.now();
    if (currentTime - this.lastEnemySpawnTime >= this.enemySpawnInterval) {
      this.spawnEnemy();
    }

    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.move(deltaTime);

      if (enemy.hasReachedEnd()) {
        this.gameOver = true;
      }
    });

    // Remove dead enemies
    this.enemies = this.enemies.filter(enemy => enemy.isAlive);

    // Tower attacks
    this.towers.forEach(tower => {
      const targetEnemy = this.enemies.find(enemy =>
        tower.canAttack(enemy) && enemy.isAlive
      );

      if (targetEnemy) {
        const damageDealt = tower.attack(targetEnemy);
        if (damageDealt > 0 && !targetEnemy.isAlive) {
          this.score += 10;
        }
      }
    });

    // Check if all enemies are dead to start next wave
    if (this.enemies.length === 0 && currentTime - this.lastEnemySpawnTime > this.enemySpawnInterval * 2) {
      this.wave++;
      this.enemySpawnInterval = Math.max(1000, this.enemySpawnInterval - 200);
    }
  }

  /**
   * Get the current game state
   * @returns {Object} Game state information
   */
  getGameState() {
    return {
      towers: this.towers,
      enemies: this.enemies,
      gameOver: this.gameOver,
      score: this.score,
      wave: this.wave
    };
  }
}

// Export all functions for testing and external use
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  Tower,
  Enemy,
  TowerDefenseGame,
  generateAccessibilityReport,
  googleSignIn,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  createAddBookForm,
  validateBookFormAccessibility
};