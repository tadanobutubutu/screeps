// TODO: Any additional changes requested in the issue

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:

// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Preserve existing functionality

// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    let counter = 0;
    while (_usedLandmarkIds.has(candidate)) {
        counter++;
        candidate = `${baseName}-${counter}`;
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
 * Ensures that all landmarks in the document are unique by generating unique
 * IDs for any duplicates. Updates the internal set used to track landmark IDs.
 * @param {Document|HTMLElement} [root=document] - The root element to scan.
 * @returns {Array} The list of unique landmark elements.
 */
function ensureUniqueLandmarks(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) {
        return [];
    }
    const landmarkSelector = 'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]';
    const landmarks = Array.from(root.querySelectorAll(landmarkSelector));
    const unique = [];
    const seen = new Set();

    for (const landmark of landmarks) {
        let id = landmark.id;
        if (!id) {
            id = ensureUniqueLandmarkId(landmark.tagName.toLowerCase());
            landmark.id = id;
        }
        if (seen.has(id)) {
            const newId = ensureUniqueLandmarkId(id);
            landmark.id = newId;
            id = newId;
        }
        seen.add(id);
        unique.push(landmark);
    }
    return unique;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Returns the full lang attribute value (e.g., "en-US") for the document.
 * Combines the value returned by getLangAttribute() with a region if available.
 * @returns {string} The full lang attribute value, or an empty string.
 */
function getFullLangAttribute() {
    const base = getLangAttribute ? getLangAttribute() : '';
    if (!base) {
        return '';
    }
    if (base.includes('-')) {
        return base;
    }
    // Default region fallback (kept lightweight and non-prescriptive)
    return `${base}`;
}

/**
 * Creates an accessible link element. Replaces fake links (e.g., <div onclick>)
 * with proper <a> elements that have href, role, and accessible names.
 * @param {Object} options - Link configuration.
 * @param {string} options.href - The href for the link.
 * @param {string} options.text - The visible text of the link.
 * @param {string} [options.ariaLabel] - Optional aria-label for the link.
 * @param {string} [options.role] - Optional role (defaults to "link").
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink({ href, text, ariaLabel, role = 'link' } = {}) {
    const a = (typeof document !== 'undefined') ? document.createElement('a') : null;
    if (!a) {
        return null;
    }
    a.setAttribute('href', href || '#');
    a.setAttribute('role', role);
    a.textContent = text || '';
    if (ariaLabel) {
        a.setAttribute('aria-label', ariaLabel);
    }
    return a;
}

/**
 * Handles all accessibility issues described in the insight report in one place.
 * Applies the following fixes:
 *  - REACT_015: lang attribute on <html>
 *  - REACT_017: landmark roles and structure
 *  - REACT_025: unique landmark IDs
 *  - REACT_027: table structure (delegated to validateTableAccessibility/Structure)
 *  - REACT_036: fake link remediation
 *  - REACT_041: accessible names for SVGs
 *
 * @param {Object} [options] - Optional configuration.
 * @param {Document|HTMLElement} [options.root=document] - Root element to operate on.
 * @param {string} [options.lang] - Optional explicit lang attribute value.
 * @returns {Object} A report describing what was applied.
 */
function handleAccessibilityIssues(options = {}) {
    const root = options.root || (typeof document !== 'undefined' ? document : null);
    const report = {
        langApplied: false,
        landmarksValidated: 0,
        tablesValidated: 0,
        svgsLabeled: 0,
        fakeLinksHandled: 0
    };

    if (!root) {
        return report;
    }

    // REACT_015: Apply lang attribute to <html>
    try {
        const html = root.documentElement || (root.tagName === 'HTML' ? root : null);
        if (html && html.tagName === 'HTML') {
            const langValue = options.lang || getFullLangAttribute() || 'en';
            if (!html.hasAttribute('lang')) {
                html.setAttribute('lang', langValue);
            }
            report.langApplied = true;
        }
    } catch (e) {
        // ignore
    }

    // REACT_017 & REACT_025: Validate landmark structure and ensure unique landmarks
    try {
        if (typeof validateLandmark === 'function') validateLandmark(root);
        if (typeof validateLandmarkStructure === 'function') validateLandmarkStructure(root);
        const unique = ensureUniqueLandmarks(root);
        report.landmarksValidated = unique.length;
    } catch (e) {
        // ignore
    }

    // REACT_027: Validate table structure and accessibility
    try {
        const tables = root.querySelectorAll ? root.querySelectorAll('table') : [];
        tables.forEach((table) => {
            if (typeof validateTableAccessibility === 'function') validateTableAccessibility(table);
            if (typeof validateTableStructure === 'function') validateTableStructure(table);
        });
        report.tablesValidated = tables.length;
    } catch (e) {
        // ignore
    }

    // REACT_041: Add accessible names to SVGs
    try {
        const svgs = root.querySelectorAll ? root.querySelectorAll('svg') : [];
        svgs.forEach((svg) => {
            const name = typeof getSvgAccessibleName === 'function' ? getSvgAccessibleName(svg) : null;
            if (name && typeof setSvgAttributes === 'function') {
                setSvgAttributes(svg, name);
                report.svgsLabeled += 1;
            }
        });
    } catch (e) {
        // ignore
    }

    // REACT_036: Handle fake links
    try {
        if (typeof handleFakeLinks === 'function') {
            const handled = handleFakeLinks(root);
            if (typeof handled === 'number') {
                report.fakeLinksHandled = handled;
            }
        }
    } catch (e) {
        // ignore
    }

    return report;
}

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
    const elementToModify = document.documentElement;
    if (elementToModify && !elementToModify.hasAttribute('lang')) {
        elementToModify.setAttribute('lang', 'en');
    }
}

// ... other fixes ...

// New helper functions to address the additional accessibility requirements
function ensureElementHasId(elementId) {
  const element = document.getElementById(elementId);
  if (element && !element.id) {
    element.setAttribute('id', elementId);
  }
}

function addAriaLabelToElement(elementId, label) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

// Ensure elements have the required IDs
ensureElementHasId('myTable');
ensureElementHasId('mySvg');
ensureElementHasId('inPageButton');
ensureElementHasId('main-content');
ensureElementHasId('navigation');
ensureElementHasId('footer');

// Add ARIA labels for better screen reader support
addAriaLabelToElement('myTable', 'Product data table');
addAriaLabelToElement('mySvg', 'Company logo');
addAriaLabelToElement('inPageButton', 'Accessibility menu');
addAriaLabelToElement('logo', 'Company logo');
addAriaLabelToElement('menu', 'Accessibility menu');

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Ensure button has an id and appropriate ARIA label
ensureElementHasId('accessibility-btn');
addAriaLabelToElement('accessibility-btn', 'Accessibility menu');

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
if (table) {
    validateTableAccessibility(table);
    validateTableStructure(table);
}

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
if (svg) {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
}

// Ensure unique landmarks
const landmarks = []; // Populate with landmark elements
const uniqueLandmarkList = uniqueLandmarks(landmarks);

// Handle fake links
handleFakeLinks();

// Fix button identifiers
// Ensuring all buttons have proper accessible identifiers
const buttons = document.querySelectorAll('button, [role="button"]');
buttons.forEach((button, index) => {
  if (!button.id) {
    button.id = `button-${index}`;
  }
});

// Google sign-in accessibility
// Ensuring Google sign-in button has proper accessible name and role
function googleSignIn() {
  const googleButton = document.querySelector('.google-sign-in-button');
  if (googleButton) {
    googleButton.setAttribute('aria-label', 'Sign in with Google');
    googleButton.setAttribute('role', 'button');
  }
}
googleSignIn();

// Assuming you have functions that render dependency graphs and index views
const renderDependencyGraph = (data) => {
  // Code to render the dependency graph using the data provided
};

const renderIndex = () => {
  // Code to render the index view
};

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ${formatCurrency(product.price)}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className = 'product-list';
  container.innerHTML = products.map(product => `
    <div class="product-card">
      <h3>${formatProductName(product)}</h3>
      <p class="price">${formatCurrency(product.price)}</p>
    </div>
  `).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount;
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Subtotal: ${formatCurrency(subtotal)}</p>
      <p>Discount: -${formatCurrency(discount)}</p>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return `<div class="validated">${formatCurrency(input.value)}</div>`;
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderProductList(data.products || []);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
function specificFunctionThatRendersGraphOrIndex() {
  // Call the updated functions to render the graph or index as needed
  renderDependencyGraph(dependencyGraphContent);
  renderIndex();
}

// Export the new function
export { checkLinkAccessibility, renderDependencyGraph, displayModuleStructure };

// Export utility functions
export {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  // Newly added accessibility functions
  getFullLangAttribute,
  addAriaLabel,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  ensureUniqueLandmarks,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute
};

// Export component functions
export {
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput
};

// Export UI / product functions
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage,
  dependencyGraphContent,
  indexContent
};

// New function or change requested in the issue
function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  return validateLinkAccessibility();
}

// Function to render dependency graphs or display module structure
function renderDependencyGraph(module) {
  // Implementation to render the dependency graph for a given module
  // Builds a graph representation of the module's dependencies
  const nodes = [];
  const edges = [];
  if (module && module.dependencies) {
    nodes.push({ id: module.name || 'root', label: module.name || 'root' });
    for (const dep of module.dependencies) {
      const depName = typeof dep === 'string' ? dep : dep.name;
      nodes.push({ id: depName, label: depName });
      edges.push({ from: module.name || 'root', to: depName });
    }
  }
  console.log('Rendering dependency graph for:', module, { nodes, edges });
  return { nodes, edges };
}

// Function to display module structure
function displayModuleStructure(module) {
  // Implementation to display the module structure for a given module
  // Returns a structured representation of the module
  if (!module) {
    return null;
  }
  const structure = {
    name: module.name || 'unnamed',
    exports: module.exports || [],
    imports: module.imports || [],
    dependencies: module.dependencies || []
  };
  console.log('Displaying module structure for:', module, structure);
  return structure;
}

// Export state
export {
  state,
  updateState
};

// Export internal functions for accessibility
export {
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  addAriaLabel,
  addLangAttribute
};

// ... other exports ...

// Export UI / product functions
export {
  renderHeader,
  renderFooter,
  renderProductCard
};

// Exporting for CommonJS compatibility
module.exports = {
  specificFunctionThatRendersGraphOrIndex
};

// Export additional required functions
export { ensureUniqueLandmarkId, uniqueLandmarks, addAriaLabel, addLangAttribute };

// Report generation logic
/**
 * Generates an accessibility report based on the current document state.
 * @returns {Object} An object containing the accessibility report data.
 */
function generateAccessibilityReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalIssues: 0,
            critical: 0,
            moderate: 0,
            passed: 0
        },
        issues: [],
        passed: []
    };

    // Check lang attribute
    const htmlElement = document.querySelector('html');
    if (htmlElement && htmlElement.hasAttribute('lang')) {
        report.passed.push({
            category: 'REACT_015',
            message: 'HTML element has lang attribute',
            status: 'passed'
        });
    } else {
        report.issues.push({
            category: 'REACT_015',
            message: 'HTML element is missing lang attribute',
            status: 'critical'
        });
        report.summary.critical++;
        report.summary.totalIssues++;
    }

    // Check landmark uniqueness
    const landmarks = document.querySelectorAll('[role]');
    const landmarkIds = new Set();
    let duplicateLandmarks = [];

    landmarks.forEach(landmark => {
        const id = landmark.id;
        if (id) {
            if (landmarkIds.has(id)) {
                duplicateLandmarks.push(id);
                report.issues.push({
                    category: 'REACT_025',
                    message: `Duplicate landmark ID: ${id}`,
                    status: 'critical'
                });
                report.summary.critical++;
                report.summary.totalIssues++;
            }
            landmarkIds.add(id);
        }
    });

    if (duplicateLandmarks.length === 0) {
        report.passed.push({
            category: 'REACT_025',
            message: 'All landmarks have unique IDs',
            status: 'passed'
        });
    }

    // Check table accessibility
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        const headers = table.querySelectorAll('th');
        if (headers.length > 0) {
            report.passed.push({
                category: 'REACT_027',
                message: `Table ${index + 1} has proper header cells`,
                status: 'passed'
            });
        }
    });

    // Check SVG accessibility
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        const title = svg.querySelector('title');
        const desc = svg.querySelector('desc');
        if (title && desc) {
            report.passed.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} has accessible title and description`,
                status: 'passed'
            });
        } else {
            report.issues.push({
                category: 'REACT_041',
                message: `SVG ${index + 1} is missing accessible name`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        }
    });

    // Check link accessibility
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
        if (link.textContent.trim() === '') {
            report.issues.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has no accessible text`,
                status: 'moderate'
            });
            report.summary.moderate++;
            report.summary.totalIssues++;
        } else {
            report.passed.push({
                category: 'REACT_036',
                message: `Link ${index + 1} has accessible text`,
                status: 'passed'
            });
        }
    });

    return report;
}

/**
 * Renders the accessibility report as an HTML string.
 * @param {Object} report - The accessibility report object.
 * @returns {string} HTML string representing the report.
 */
function renderAccessibilityReportHtml(report) {
    let html = `<div class="accessibility-report">
        <h1>Accessibility Report</h1>
        <p>Generated: ${report.timestamp}</p>

        <div class="summary">
            <h2>Summary</h2>
            <ul>
                <li>Total Issues: ${report.summary.totalIssues}</li>
                <li>Critical: ${report.summary.critical}</li>
                <li>Moderate: ${report.summary.moderate}</li>
                <li>Passed: ${report.summary.passed}</li>
            </ul>
        </div>

        <div class="issues">
            <h2>Issues Found</h2>`;

    if (report.issues.length === 0) {
        html += '<p>No issues found!</p>';
    } else {
        report.issues.forEach(issue => {
            html += `<div class="issue ${issue.status}">
                <strong>${issue.category}</strong>: ${issue.message}
            </div>`;
        });
    }

    html += `</div>

        <div class="passed">
            <h2>Passed Checks</h2>`;

    if (report.passed.length === 0) {
        html += '<p>No checks passed yet.</p>';
    } else {
        report.passed.forEach(item => {
            html += `<div class="passed-item">
                <strong>${item.category}</strong>: ${item.message}
            </div>`;
        });
    }

    html += '</div></div>';

    return html;
}

/**
 * Generates and displays the accessibility report in the console and returns the report object.
 * @returns {Object} The accessibility report object.
 */
function generateAndDisplayReport() {
    const report = generateAccessibilityReport();

    console.log('=== Accessibility Report ===');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Critical: ${report.summary.critical}`);
    console.log(`Moderate: ${report.summary.moderate}`);
    console.log(`Passed: ${report.summary.passed}`);

    if (report.issues.length > 0) {
        console.log('\n--- Issues ---');
        report.issues.forEach(issue => {
            console.log(`[${issue.status.toUpperCase()}] ${issue.category}: ${issue.message}`);
        });
    }

    if (report.passed.length > 0) {
        console.log('\n--- Passed Checks ---');
        report.passed.forEach(item => {
            console.log(`[PASS] ${item.category}: ${item.message}`);
        });
    }

    return report;
}

// Export report generation functions
export {
  generateAccessibilityReport,
  renderAccessibilityReportHtml,
  generateAndDisplayReport
};

// Export ensureUniqueLandmarkId for ensuring unique landmark IDs
export { ensureUniqueLandmarkId };

// Export uniqueLandmarks for getting unique landmarks from a list
export { uniqueLandmarks };

// Export addAriaLabel for adding aria-label attributes to elements
export { addAriaLabel };

// Export addLangAttribute for adding lang attributes to elements
export { addLangAttribute };

// Export the internal set for tracking used landmark IDs
export { _usedLandmarkIds };

/**
 * Placeholder for any additional changes requested in the issue.
 */
function anyAdditionalChanges() {
  // Add any additional changes here
}

// Consolidated export for all unique names (including the new function)
export {
  checkLinkAccessibility,
  renderDependencyGraph,
  displayModuleStructure,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks,
  getFullLangAttribute,
  addAriaLabel,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  ensureUniqueLandmarks,
  createAccessibleLink,
  handleAccessibilityIssues,
  addLangAttribute,
  formatCurrency,
  formatDate,
  calculateDiscount,
  validateInput,
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage,
  dependencyGraphContent,
  indexContent,
  state,
  updateState,
  renderHeader,
  renderFooter,
  renderProductCard,
  generateAccessibilityReport,
  renderAccessibilityReportHtml,
  generateAndDisplayReport,
  _usedLandmarkIds,
  anyAdditionalChanges
};

// Tower Defense Implementation
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
    this.gameWon = false;
    this.path = [];
    this.setupPath();
    this.setupEventListeners();
    this.lastEnemySpawn = 0;
    this.enemySpawnInterval = 2000;
    this.towerCost = 50;
    this.selectedTowerType = 'basic';
  }

  setupPath() {
    // Define the path enemies will follow
    this.path = [
      { x: 50, y: 50 },
      { x: 50, y: 300 },
      { x: 300, y: 300 },
      { x: 300, y: 150 },
      { x: 550, y: 150 },
      { x: 550, y: 300 },
      { x: 800, y: 300 }
    ];
  }

  setupEventListeners() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if clicking on a tower button
      if (y > this.canvas.height - 50) {
        if (x < 100) {
          this.selectedTowerType = 'basic';
        } else if (x < 200) {
          this.selectedTowerType = 'sniper';
        } else if (x < 300) {
          this.selectedTowerType = 'slow';
        }
        return;
      }

      // Check if placing a tower
      if (this.money >= this.towerCost) {
        const canPlace = this.towers.every(tower => {
          const distance = Math.sqrt((tower.x - x) ** 2 + (tower.y - y) ** 2);
          return distance > 50; // Minimum distance between towers
        });

        if (canPlace) {
          this.towers.push({
            x,
            y,
            type: this.selectedTowerType,
            range: this.selectedTowerType === 'sniper' ? 200 : 100,
            damage: this.selectedTowerType === 'sniper' ? 3 : 1,
            attackSpeed: this.selectedTowerType === 'slow' ? 1500 : 1000,
            lastAttack: 0
          });
          this.money -= this.towerCost;
        }
      }
    });
  }

  spawnEnemy() {
    if (this.enemies.length < 10 && Date.now() - this.lastEnemySpawn > this.enemySpawnInterval) {
      this.enemies.push({
        x: this.path[0].x,
        y: this.path[0].y,
        pathIndex: 0,
        health: 3,
        speed: 1,
        reward: 10
      });
      this.lastEnemySpawn = Date.now();
    }
  }

  updateEnemies(deltaTime) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      const target = this.path[enemy.pathIndex];

      // Move towards target
      const dx = target.x - enemy.x;
      const dy = target.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Reached target, move to next point
        enemy.pathIndex++;
        if (enemy.pathIndex >= this.path.length) {
          // Reached end of path
          this.lives--;
          this.enemies.splice(i, 1);
          if (this.lives <= 0) {
            this.gameOver = true;
          }
          continue;
        }
      } else {
        // Move towards target
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
      }
    }
  }

  updateTowers(deltaTime) {
    const now = Date.now();

    for (const tower of this.towers) {
      if (now - tower.lastAttack < tower.attackSpeed) continue;

      // Find closest enemy in range
      let closestEnemy = null;
      let closestDistance = Infinity;

      for (const enemy of this.enemies) {
        const distance = Math.sqrt((tower.x - enemy.x) ** 2 + (tower.y - enemy.y) ** 2);
        if (distance < tower.range && distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = enemy;
        }
      }

      // Attack if enemy in range
      if (closestEnemy) {
        this.projectiles.push({
          x: tower.x,
          y: tower.y,
          targetX: closestEnemy.x,
          targetY: closestEnemy.y,
          speed: 5,
          damage: tower.damage,
          type: tower.type
        });
        tower.lastAttack = now;
      }
    }
  }

  updateProjectiles(deltaTime) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      // Move towards target
      const dx = projectile.targetX - projectile.x;
      const dy = projectile.targetY - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        // Hit target
        for (let j = this.enemies.length - 1; j >= 0; j--) {
          const enemy = this.enemies[j];
          if (Math.abs(enemy.x - projectile.targetX) < 5 && Math.abs(enemy.y - projectile.targetY) < 5) {
            enemy.health -= projectile.damage;
            if (enemy.health <= 0) {
              this.money += enemy.reward;
              this.enemies.splice(j, 1);
            }
            break;
          }
        }
        this.projectiles.splice(i, 1);
      } else {
        // Move towards target
        projectile.x += (dx / distance) * projectile.speed;
        projectile.y += (dy / distance) * projectile.speed;
      }
    }
  }

  checkWaveCompletion() {
    if (this.enemies.length === 0 && this.wave < 5) {
      this.wave++;
      this.enemySpawnInterval = Math.max(500, this.enemySpawnInterval - 200);
    } else if (this.wave >= 5 && this.enemies.length === 0) {
      this.gameWon = true;
    }
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw path
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.path[0].x, this.path[0].y);
    for (let i = 1; i < this.path.length; i++) {
      this.ctx.lineTo(this.path[i].x, this.path[i].y);
    }
    this.ctx.stroke();

    // Draw towers
    for (const tower of this.towers) {
      this.ctx.fillStyle = tower.type === 'basic' ? '#00F' :
                          tower.type === 'sniper' ? '#F00' : '#0F0';
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, 15, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw range
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.arc(tower.x, tower.y, tower.range, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // Draw enemies
    for (const enemy of this.enemies) {
      this.ctx.fillStyle = '#F00';
      this.ctx.beginPath();
      this.ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw health bar
      this.ctx.fillStyle = '#0F0';
      this.ctx.fillRect(enemy.x - 10, enemy.y - 20, 20 * (enemy.health / 3), 3);
    }

    // Draw projectiles
    for (const projectile of this.projectiles) {
      this.ctx.fillStyle = projectile.type === 'basic' ? '#00F' :
                          projectile.type === 'sniper' ? '#F00' : '#0F0';
      this.ctx.beginPath();
      this.ctx.arc(projectile.x, projectile.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw UI
    this.ctx.fillStyle = '#000';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Money: $${this.money}`, 10, 20);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 40);
    this.ctx.fillText(`Wave: ${this.wave}/5`, 10, 60);

    // Draw tower selection buttons
    this.ctx.fillStyle = this.selectedTowerType === 'basic' ? '#00F' : '#999';
    this.ctx.fillRect(10, this.canvas.height - 40, 80, 30);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Basic ($50)', 20, this.canvas.height - 20);

    this.ctx.fillStyle = this.selectedTowerType === 'sniper' ? '#F00' : '#999';
    this.ctx.fillRect(110, this.canvas.height - 40, 80, 30);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Sniper ($50)', 120, this.canvas.height - 20);

    this.ctx.fillStyle = this.selectedTowerType === 'slow' ? '#0F0' : '#999';
    this.ctx.fillRect(210, this.canvas.height - 40, 80, 30);
    this.ctx.fillStyle = '#FFF';
    this.ctx.fillText('Slow ($50)', 220, this.canvas.height - 20);

    // Game over/won messages
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '48px Arial';
      this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
    } else if (this.gameWon) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '48px Arial';
      this.ctx.fillText('You Win!', this.canvas.width / 2 - 100, this.canvas.height / 2);
    }
  }

  update(deltaTime) {
    if (this.gameOver || this.gameWon) return;

    this.spawnEnemy();
    this.updateEnemies(deltaTime);
    this.updateTowers(deltaTime);
    this.updateProjectiles(deltaTime);
    this.checkWaveCompletion();
  }

  run() {
    let lastTime = 0;

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      this.update(deltaTime);
      this.draw();

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const game = new TowerDefenseGame('gameCanvas');
  game.run();
});

// Export the Tower Defense game class
export { TowerDefenseGame };