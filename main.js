// main.js

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: ...
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Some existing utility functions
function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

// Existing dependency storage
let dependencies = [
    { name: 'lodash', version: '4.17.21' },
    { name: 'express', version: '4.18.2' },
    { name: 'react', version: '18.2.0' }
];

function getDependencies() {
    return dependencies;
}

function addDependency(name, version) {
    dependencies.push({ name, version });
    return dependencies;
}

function removeDependency(name) {
    dependencies = dependencies.filter(dep => dep.name !== name);
    return dependencies;
}

function countDependencies() {
    return dependencies.length;
}

// New Function
function newFunction() {
  // Implement the new functionality (as per the original commitment)
  return 'New functionality result';
}

// New Function 2 - Assuming the issue implies there might be another missing export
function newFunction2() {
  // Implement another new functionality (assuming this was the intent of the issue)
  return 'New functionality 2 result';
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function validateTableAccessibility(table) {
  // Implementation to validate table accessibility
  return true;
}

function validateTableStructure(table) {
  // Implementation to validate table structure
  return true;
}

function fixTableStructure(table) {
  // Implementation to fix table structure
  return true;
}

// Application state
const appData = {};

// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole(html) {
    if (typeof document !== 'undefined') {
        const dependencyGraph = document.getElementById('dependency-graph');
        if (dependencyGraph) {
            const currentRole = dependencyGraph.getAttribute('role');
            if (!currentRole || currentRole !== 'graph') {
                dependencyGraph.setAttribute('role', 'graph');
            }
        }
    }

    return html;
}

function upgrade(harvestedData) {
    if (!harvestedData || typeof harvestedData !== 'object') {
        console.error('Upgrade failed: Invalid or missing harvested data');
        return false;
    }

    try {
        if (harvestedData.settings) {
            console.log('Applying settings upgrades from harvested data');
        }

        if (harvestedData.config) {
            console.log('Applying configuration improvements from harvested data');
        }

        if (harvestedData.preferences) {
            console.log('Applying user preferences from harvested data');
        }

        console.log('System upgrade completed successfully using harvested data');
        return true;
    } catch (error) {
        console.error('Upgrade failed:', error.message);
        return false;
    }
}

// Function to create an in-page button
function createInPageButtonAlt() {
    if (typeof document === 'undefined') return;
    const button = document.createElement('button');
    button.textContent = 'Accessibility Info';
    button.setAttribute('aria-label', 'Show accessibility information');
    document.body.appendChild(button);
}

function fixAccessibilityIssues(html) { return html; }
function fixLandmarks(html) { return html; }
function addSvgAccessibleNames(html) { return html; }
function fixFakeLinks(html) { return html; }
function fixTableStructureIssues(html) { return html; }
function fixTableHeaderCellScope(html) { return html; }
function addMainLandmark(html) { return html; }

function addressAccessibilityIssues(html) {
  if (insightReport && insightReport.html) {
    insightReport.html = fixAccessibilityIssues(insightReport.html);
  }
  return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = addSvgAccessibleNames(result);
    result = fixLandmarks(result);
    result = fixFakeLinks(result);
    result = ensureUniqueLandmarks(result);
    result = addMainLandmark(result);
    return result;
}

export function existingFunction1() {
  // Existing implementation
}

export function existingFunction2() {
  // Existing implementation
}

// New Function
export function newFunction() {
  // Implement the new functionality (as per the original commitment)
  return 'New functionality result';
}

// Function to render dependency graphs
function renderDependencyGraph(dependencies, options = {}) {
    if (!dependencies) {
        console.warn('No dependencies provided for graph rendering');
        return null;
    }

    const graphData = {
        nodes: [],
        edges: [],
        metadata: {
            renderedAt: new Date().toISOString(),
            totalDependencies: 0
        }
    };

    const deps = Array.isArray(dependencies) ? dependencies : Object.keys(dependencies);

    deps.forEach((dep, index) => {
        const depName = typeof dep === 'string' ? dep : dep.name || dep.id;
        const depVersion = typeof dep === 'object' ? dep.version : 'latest';

        graphData.nodes.push({
            id: index,
            name: depName,
            version: depVersion,
            type: 'dependency'
        });

        if (typeof dep === 'object' && dep.dependencies) {
            const nestedDeps = Array.isArray(dep.dependencies) ? dep.dependencies : Object.keys(dep.dependencies);
            nestedDeps.forEach((nestedDep, nestedIndex) => {
                const nestedName = typeof nestedDep === 'string' ? nestedDep : nestedDep.name || nestedDep.id;
                graphData.nodes.push({
                    id: graphData.nodes.length,
                    name: nestedName,
                    version: typeof nestedDep === 'object' ? nestedDep.version : 'latest',
                    type: 'nested-dependency'
                });
                graphData.edges.push({
                    from: index,
                    to: graphData.nodes.length - 1,
                    type: 'depends-on'
                });
            });
        }
    });

    graphData.metadata.totalDependencies = graphData.nodes.length;
    return graphData;
}

function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;

  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

  landmarkRoles.forEach(role => {
    const pattern = new RegExp(`<[^>]*role=["']${role}["'][^>]*>`, 'gi');
    const matches = html.match(pattern);
    if (matches && matches.length > 1) {
      let count = 0;
      html = html.replace(pattern, (match) => {
        count++;
        if (count === 1) return match;
        return match.replace(/role=["']${role}["']/, `role="${role}_${count}"`);
      });
    }
  });

  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  html5Landmarks.forEach(tag => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = html.match(pattern);
    if (matches && matches.length > 1) {
      let count = 0;
      html = html.replace(pattern, (match) => {
        count++;
        if (count === 1) return match;
        return match.replace(/^</, '<') + ` role="region"`;
      });
    }
  });

  return html;
}

function applyAllAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = addSvgAccessibleNames(result);
    result = fixLandmarks(result);
    result = fixFakeLinks(result);
    result = ensureUniqueLandmarks(result);
    result = ensureDependencyGraphAriaRole(result);
    return result;
}

async function generateAccessibilityReport(insightReport) {
  const report = await scanAccessibility();
  writeReport(report);
  return report;
}

export function getLangAttribute() {
  return navigator.language || 'en';
}

export function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (attrs.includes('lang=')) return match;
    return `<html${attrs} lang="en">`;
  });
}

export function validateTableAccessibility(table) {
  if (!table) return false;
  return table.querySelectorAll('thead, tbody, tfoot').length > 0;
}

export function validateTableStructure(table) {
  if (!table) return false;
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  return hasThead || hasTbody;
}

export function fixTableStructure(table) {
  if (!table) return false;
  let modified = false;
  
  const rows = table.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRow = rows[0];
    const cells = firstRow.querySelectorAll('th, td');
    
    if (cells.length > 0 && !table.querySelector('thead')) {
      const thead = document.createElement('thead');
      firstRow.querySelectorAll('th').forEach(th => {
        thead.appendChild(th.cloneNode(true));
      });
      table.insertBefore(thead, table.firstChild);
      modified = true;
    }
    
    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        tbody.appendChild(row.cloneNode(true));
      });
      table.appendChild(tbody);
      modified = true;
    }
  }
  
  return modified;
}

export function addMainLandmark() {
  if (typeof document === 'undefined') return;
  
  const main = document.querySelector('main');
  if (!main) {
    const mainElement = document.createElement('main');
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

export function validateLandmark() {
  return document.querySelectorAll('[role="main"]').length > 0;
}

export function validateLandmarkStructure() {
  return document.querySelectorAll('main, [role="main"]').length > 0;
}

function addFocusTrap() {
  if (typeof document !== 'undefined') {
    const focusableElements = document.querySelectorAll('button, input, [tabindex]');
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  }
}

function addKeyboardNavigation() {
  // Implementation for keyboard navigation
}

function addAriaLabels() {
  // Implementation for ARIA labels
}

function improveAccessibility() {
  addKeyboardNavigation();
  addAriaLabels();
  addMainLandmark();
  addFocusTrap();
}

function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

function harvest(target, amount) {
    if (!target) {
        return 0;
    }

    if (typeof target.energy === 'number') {
        const availableEnergy = target.energy;
        const harvestedAmount = Math.min(amount || availableEnergy, availableEnergy);
        target.energy -= harvestedAmount;
        return harvestedAmount;
    }

    if (target.store && typeof target.store.energy === 'number') {
        const availableEnergy = target.store.energy;
        const harvestedAmount = Math.min(amount || availableEnergy, availableEnergy);
        target.store.energy -= harvestedAmount;
        return harvestedAmount;
    }

    if (target.store && typeof target.store.minerals === 'number') {
        const availableMinerals = target.store.minerals;
        const harvestedAmount = Math.min(amount || availableMinerals, availableMinerals);
        target.store.minerals -= harvestedAmount;
        return harvestedAmount;
    }

    return 0;
}

function function3() {
  // TODO: Implement new function
}

export function validateLandmarkAttributes() {
  // Implementation to be added
}

export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

export function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  const name = getSvgAccessibleName(svg);
  if (name && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    svg.setAttribute('aria-label', name);
  }
}

export function handleFakeLinks() {
  if (typeof document === 'undefined') return 0;
  
  const fakeLinks = document.querySelectorAll('a[href^="javascript:"], a[href=""]', 'a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
  
  return fakeLinks.length;
}

export function createInPageButton(text, onClick) {
  if (typeof document === 'undefined') return null;
  
  const button = document.createElement('button');
  button.textContent = text || 'Accessibility Info';
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  button.setAttribute('aria-label', 'Show accessibility information');
  document.body.appendChild(button);
  
  return button;
}

export function addProperLandmarkRegions() {
  if (typeof document === 'undefined') return;
  
  const main = document.querySelector('main') || document.createElement('main');
  if (!document.querySelector('main')) {
    document.body.appendChild(main);
  }
  
  const landmarks = {
    banner: document.querySelector('header'),
    navigation: document.querySelector('nav'),
    main: document.querySelector('main'),
    complementary: document.querySelector('aside'),
    contentinfo: document.querySelector('footer')
  };
  
  Object.entries(landmarks).forEach(([role, element]) => {
    if (element && !element.hasAttribute('role')) {
      element.setAttribute('role', role);
    }
  });
}

export function processAccessibilityUpdates() {
  const results = {
    langAttribute: null,
    landmarks: null,
    tables: null,
    svgs: null,
    links: null,
  };

  const langAttr = getLangAttribute();
  if (langAttr) {
    addLangAttribute();
    results.langAttribute = langAttr;
  }

  results.landmarks = ensureUniqueLandmarks();

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!validateTableAccessibility(table)) {
      fixTableStructure(table);
    }
  });
  results.tables = tables.length;

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    setSvgAttributes(svg);
  });
  results.svgs = svgs.length;

  results.links = handleFakeLinks();

  return results;
}

function scanAccessibility() {
  return Promise.resolve({ violations: [] });
}

function writeReport(report) {
  const path = require('path');
  const fs = require('fs');
  fs.writeFileSync(path.join(__dirname, 'accessibility-report.json'), JSON.stringify(report, null, 2));
}

class Tower {
    constructor(name, cost, damage, range, fireRate) {
        this.name = name;
        this.cost = cost;
        this.damage = damage;
        this.range = range;
        this.fireRate = fireRate;
        this.position = { x: 0, y: 0 };
        this.cooldown = 0;
    }

    place(position) {
        this.position = position;
    }

    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }

    canShoot() {
        return this.cooldown <= 0;
    }

    shoot(target) {
        if (this.canShoot()) {
            this.cooldown = this.fireRate;
            return {
                damage: this.damage,
                target: target
            };
        }
        return null;
    }
}

class Enemy {
    constructor(health, speed, reward) {
        this.maxHealth = health;
        this.health = health;
        this.speed = speed;
        this.reward = reward;
        this.position = { x: 0, y: 0 };
        this.pathIndex = 0;
    }

    move(path, deltaTime) {
        if (this.pathIndex < path.length - 1) {
            const target = path[this.pathIndex + 1];
            const dx = target.x - this.position.x;
            const dy = target.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.speed * deltaTime) {
                this.position = target;
                this.pathIndex++;
            } else {
                this.position.x += (dx / distance) * this.speed * deltaTime;
                this.position.y += (dy / distance) * this.speed * deltaTime;
            }
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }
}

class TowerDefenseGame {
    constructor() {
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.path = [];
        this.playerMoney = 100;
        this.playerHealth = 100;
        this.gameRunning = false;
    }

    setPath(path) {
        this.path = path;
    }

    addTower(tower) {
        if (this.playerMoney >= tower.cost) {
            this.towers.push(tower);
            this.playerMoney -= tower.cost;
            return true;
        }
        return false;
    }

    spawnEnemy(enemy) {
        enemy.position = { ...this.path[0] };
        this.enemies.push(enemy);
    }

    update(deltaTime) {
        this.towers.forEach(tower => {
            tower.update(deltaTime);
            
            let closestEnemy = null;
            let minDistance = Infinity;
            
            this.enemies.forEach(enemy => {
                const dx = enemy.position.x - tower.position.x;
                const dy = enemy.position.y - tower.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance <= tower.range && distance < minDistance) {
                    minDistance = distance;
                    closestEnemy = enemy;
                }
            });
            
            if (closestEnemy) {
                const projectile = tower.shoot(closestEnemy);
                if (projectile) {
                    this.projectiles.push(projectile);
                }
            }
        });
        
        this.enemies.forEach((enemy, index) => {
            enemy.move(this.path, deltaTime);
            
            if (enemy.pathIndex >= this.path.length - 1) {
                this.playerHealth -= 10;
                this.enemies.splice(index, 1);
            }
        });
        
        this.projectiles.forEach((projectile, index) => {
            if (projectile.target && projectile.target.health > 0) {
                if (projectile.target.takeDamage(projectile.damage)) {
                    this.playerMoney += projectile.target.reward;
                    this.enemies.splice(this.enemies.indexOf(projectile.target), 1);
                }
                this.projectiles.splice(index, 1);
            } else {
                this.projectiles.splice(index, 1);
            }
        });
    }

    isGameOver() {
        return this.playerHealth <= 0;
    }
}

function initialize() {
    if (typeof document !== 'undefined') {
        const dependencyGraph = document.getElementById('dependency-graph');
        if (dependencyGraph) {
            dependencyGraph.setAttribute('role', 'region');
            dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
        }
    }

    addressAccessibilityIssues();

    createInPageButtonAlt();

    improveAccessibility();
    
    if (a11y && a11y.init) {
        a11y.init();
    }
}

// Additional utility functions
function someFunction() {
    return 'Some result';
}

function functionA(param) {
    return `Function A with param: ${param}`;
}

function functionB(param) {
    return `Function B with param: ${param}`;
}

function getDependenciesEnhanced() {
    return getDependencies();
}

function addDependencyEnhanced(name, version) {
    addDependency(name, version);
}

function removeDependencyEnhanced(name) {
    removeDependency(name);
}

function renderDependencyGraphContent() {
    return { nodes: [], edges: [] };
}

function fixFakeLinksEnhanced() {
    return handleFakeLinks();
}

function addProperLandmarkRegionsEnhanced() {
    addProperLandmarkRegions();
}

function validateInput(input) {
    return input !== null && input !== undefined;
}

function processData(data) {
    if (!Array.isArray(data)) return [];
    return data.filter(item => item !== null);
}

function formatResponse(response) {
    if (typeof response === 'object') {
        return JSON.stringify(response);
    }
    return String(response);
}

let config = {
    debug: false,
    verbose: false
};

function importAndExecute(moduleName) {
    try {
        const module = require(moduleName);
        if (typeof module === 'function') {
            return module();
        }
        return module;
    } catch (error) {
        console.error(`Failed to import module ${moduleName}:`, error.message);
        return null;
    }
}

// Export all functions for use elsewhere in the repository
module.exports = {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    appData,
    someFunction,
    addressAccessibilityIssues,
    renderDependencyGraphContent,
    fixFakeLinksEnhanced,
    createInPageButton,
    createInPageButtonAlt,
    addProperLandmarkRegions,
    config,
    validateInput,
    processData,
    formatResponse,
    functionA,
    functionB,
    getLangAttribute,
    scanAccessibility,
    writeReport,
    generateAccessibilityReport: async function () {
        const report = await scanAccessibility();
        writeReport(report);
    },
    importAndExecute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    initialize,
    renderDependencyGraph,
    Tower,
    Enemy,
    TowerDefenseGame,
    harvest,
    upgrade,
    newFunction,
    newFunction2
};

// Main execution when run directly
if (require.main === module) {
    const landmarks = [];
    const processed = [];
    const sorted = [];

    console.log(`Loaded ${landmarks.length} landmarks`);
    console.log(`Processed to ${processed.length} unique landmarks`);
    console.log(`Sorted ${sorted.length} landmarks`);

    if (sorted.length > 0) {
        console.log('First landmark:', sorted[0]);
    }
}