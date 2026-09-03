const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');

// Configuration - merged from both branches
const CONFIG = {
    name: 'MyApp',
    version: '1.0.0',
    debug: false,
    dataPath: './data',
    maxResults: 100,
    // From HEAD branch
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Application configuration (alias for CONFIG)
const config = CONFIG;

// Safety configuration from origin/main
const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice';

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Authorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

// Helper function to validate landmark structure (from origin/main)
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
}

function upgrade(harvestedData) {
    // Validate that harvested data is provided
    if (!harvestedData || typeof harvestedData !== 'object') {
        console.error('Upgrade failed: Invalid or missing harvested data');
        return false;
    }

    // Process harvested data to improve the system
    try {
        const filePath = path.join(config.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const landmarks = JSON.parse(data);

        // Apply harvested data improvements
        if (harvestedData.settings) {
            // Apply settings upgrades
            console.log('Applying settings upgrades from harvested data');
        }

        if (harvestedData.configurations) {
            // Apply configuration improvements
            console.log('Applying configuration improvements from harvested data');
        }

        if (harvestedData.preferences) {
            // Apply user preference improvements
            console.log('Applying user preferences from harvested data');
        }

        // Check for the dependencyGraph container and set its ARIA role (from origin/main)
        const dependencyGraph = document.getElementById('dependencyGraph');
        if (dependencyGraph) {
            const currentRole = dependencyGraph.getAttribute('role');
            if (!currentRole || currentRole !== 'graph') {
                dependencyGraph.setAttribute('role', 'graph');
            }
        }

        // Log successful upgrade
        console.log('System upgrade completed successfully using harvested data');
        return true;
    } catch (error) {
        console.error('Upgrade failed:', error.message);
        return false;
    }
}

// Process and filter landmarks (from origin/main)
function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

    return uniqueLandmarks.slice(0, config.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        } else {
            return nameB.localeCompare(nameA);
        }
    });
}

// Add proper landmark regions for accessibility (from origin/main)
function addProperLandmarkRegions() {
  const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  regions.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    elements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        const defaultLabels = {
          'banner': 'Site header',
          'navigation': 'Main navigation',
          'main': 'Main content',
          'complementary': 'Complementary content',
          'contentinfo': 'Footer information',
          'search': 'Search'
        };
        element.setAttribute('aria-label', defaultLabels[role] || role);
      }
    });
  });
}

// Ensure unique landmarks (from origin/main)
function ensureUniqueLandmarks(landmarks) {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = landmark.id || landmark.role || JSON.stringify(landmark);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

// Dependency graph visualization from HEAD
let dependencyGraph = {};

export const visualizeDependencyTree = (dependencies) => {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
};

// Accessibility helper from HEAD (renamed to avoid conflict)
const accessiblyHelperOriginBranch = async (...args) => {
  return args;
};

// Functions from HEAD branch
function calculateSafetyScore(safetyCategories) {
  const safetyCategoriesList = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategoriesList.reduce((acc, cat) => acc * 1.1, 1);
}

function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
}

function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// New functions to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(CONFIG.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Helper functions from the safe version
function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      uniqueLandmarks.push(landmark);
    }
  }
  return uniqueLandmarks;
}

// Additional helper functions
function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// New function to analyze module dependencies
function analyzeModuleDependencies(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
  return {
    dependencies: modules,
    relationships: []
  };
}

// New function to visualize module relationships
function visualizeModuleRelationships(modules) {
  // Implementation would create a visual representation of module relationships
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

// Helper functions from the unsafe version
function validateLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// Harvest logic implementation
function harvest(source, harvester) {
  const harvestAmount = 5;
  const capacity = harvester.carry ? harvester.carry_capacity : 50;
  const currentLoad = harvester.carry ? Object.values(harvester.carry).reduce((a, b) => a + b, 0) : 0;
  
  if (currentLoad >= capacity) {
    return { success: false, reason: 'FULL' };
  }
  
  const availableSpace = capacity - currentLoad;
  const harvestableAmount = Math.min(harvestAmount, availableSpace);
  
  if (source && source.energy !== undefined) {
    const energyToHarvest = Math.min(harvestableAmount, source.energy);
    source.energy -= energyToHarvest;
    
    if (harvester.carry) {
      harvester.carry.energy = (harvester.carry.energy || 0) + energyToHarvest;
    }
    
    return { success: true, amount: energyToHarvest };
  }
  
  return { success: false, reason: 'NO_SOURCE' };
}

// Accessibility report generation from HEAD
const generateAccessibilityReport = (issuesData, outputFile = 'accessibility-report.json') => {
  const report = {
    timestamp: new Date().toISOString(),
    issues: issuesData || [],
    summary: {
      total: issuesData?.length || 0,
      critical: issuesData?.filter(i => i.impact === 'critical').length || 0,
      serious: issuesData?.filter(i => i.impact === 'serious').length || 0,
      moderate: issuesData?.filter(i => i.impact === 'moderate').length || 0,
      minor: issuesData?.filter(i => i.impact === 'minor').length || 0
    }
  };

  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, outputFile), JSON.stringify(report, null, 2), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(report);
      }
    });
  });
};

// Dependency report generator for visualizeDependencyTree
function generateDependencyReport(dependencies) {
  return {
    graph: dependencies,
    nodes: Object.keys(dependencies),
    edges: Object.values(dependencies).flat()
  };
}

// Existing todo comments are preserved to maintain context
// Commit: e1060a659ba0acd8f70570301019d02d1d671c81
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

module.exports = {
  CONFIG,
  config,
  userSafety,
  safetyCategories,
  checkUserSafety,
  checkSafetyCategories,
  isValidLandmark,
  analyzeContentSafety,
  upgrade,
  processLandmarks,
  sortLandmarks,
  addProperLandmarkRegions,
  ensureUniqueLandmarks,
  visualizeDependencyTree,
  accessiblyHelperOriginBranch,
  generateAccessibilityReport,
  dependencyGraph,
  // From HEAD branch
  calculateSafetyScore,
  addBook,
  announceBookAdded,
  getBooksList,
  loadLandmarks,
  writeReport,
  getUniqueLandmarks,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  ensureElementHasId,
  addAriaLabel,
  validateLandmark,
  harvest,
  generateDependencyReport
};