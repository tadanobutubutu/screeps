const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  getUniqueLandmarks,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  getAccessibleLinkProps,
  createInPageButton,
  isValidEmail,
  isValidUrl
} = require('./utils');

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// Accessibility improvements:
// - Added semantic HTML structure
// - Included ARIA attributes where necessary
// - Ensured keyboard navigation support
// - Added focus management

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

function initializeApp() {
  initialize();
  return appState;
}

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

function clearCache() {
  appState.cache.clear();
}

function someFunction() {
  return 'some value';
}

function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || document.documentElement.lang || 'en';
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

const accessiblyHelper = async (...args) => {
  return args;
};

function getUserSafetyAdvice() {
  const safetyCategories = ['User Safety: safe', 'Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];

  booksList = getUniqueLandmarks(loadLandmarks());

  return booksList.map(book => `${book.id}. ${book.content}`).join("\n");
}

// TODO: Implement harvest logic
// This function should collect resources or data from available sources
function harvestData() {
  // Add your own implementation here.
  // For example, you can fetch data from API or invest a real-time tracking logic.
  return 'Example data collected';
}

// Main function that applies all accessibility fixes and collects data
async function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = await a11y(result);
  result = addLangAttribute(result);
  result = fixTableStructureIssues(result);
  result = fixFakeLinks(result);
  result = validateLandmark(result);
  // Add collected data to the html
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

// Helper function
function initializeAppMain() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = config.allowedRoles || ['region'];
      if (allowedRoles.includes('region')) {
        dependencyGraph.setAttribute('role', 'region');
      } else {
        dependencyGraph.setAttribute('role', 'region');
      }
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }

  // Implementation to handle accessibility issues (conflict resolved: merged implementation)
  handleAccessibilityIssues();

  return true;
}

// Helper functions

function processLandmarks(landmarks) {
    if (!landmarks || !Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);

    return validateLandmarkStructure(validLandmarks);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.slice().sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function getLandmarkById(landmarks, id) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const seen = new Set();
    return landmarks.filter(landmark => {
        if (seen.has(landmark.id)) {
            return false;
        }
        seen.add(landmark.id);
        return true;
    });
}

function isValidLandmark(landmark) {
    return landmark && typeof landmark === 'object' && landmark.id;
}

function addLangAttribute(html) {
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', getLangAttribute());
  }
  return html;
}

function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption (from origin/main and HEAD)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (from origin/main)
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableStructure(tables) {
  const allIssues = [];

  // Handle both single table element and array of tables
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows (from origin/main)
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility (merged implementation)
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

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await fetchUser(userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Servers running at http://${HOST}:${PORT}/`);
});

// Helper functions
function chatGPT(input) {
  const apiResponse = axe.run(input);
  if (apiResponse.violations.length > 0) {
    let issues = [];
    apiResponse.violations.forEach(violation => {
      issues.push(violation.description);
    });
    return issues.join(', ');
  }
  return 'No accessibility issues found';
}

app.post('/chatGPT', (req, res) => {
  const data = req.body.data;
  if (data) {
    res.json({ response: chatGPT(data) });
  } else {
    res.status(400).send('Invalid data POSTed');
  }
});

// Routes for accessibility improvements
app.get('/accessibility', async (req, res) => {
  const landmarks = loadLandmarks();
  const processedLandmarks = processLandmarks(landmarks);
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: processedLandmarks.length,
    issues: processedLandmarks,
    fixesApplied: []
  };

  processedLandmarks.forEach((landmark, index) => {
    try {
      if (fixTableStructureIssues && landmark.element) {
        fixTableStructureIssues(landmark.element);
        report.fixesApplied.push({ index, fix: 'table-structure' });
      }

      if (fixTableHeaderCellScope && landmark.element) {
        fixTableHeaderCellScope(landmark.element);
        report.fixesApplied.push({ index, fix: 'header-cell-scope' });
      }

      if (addSvgAccessibleNames && landmark.element) {
        addSvgAccessibleNames(landmark.element);
        report.fixesApplied.push({ index, fix: 'svg-accessible-names' });
      }

      if (addLangAttribute) {
        addLangAttribute(document.documentElement);
        report.fixesApplied.push({ fix: 'lang-attribute' });
      }

      if (addMainLandmark) {
        addMainLandmark();
        report.fixesApplied.push({ fix: 'main-landmark' });
      }
    } catch (error) {
      console.error(`Error processing landmark ${index}:`, error.message);
    }
  });

  if (writeReport) {
    writeReport(report);
  }

  res.json(report);
});

app.post('/dependencies', (req, res) => {
  const modules = req.body.modules;
  const dependencies = analyzeModuleDependenciesLocal(modules);
  res.json(dependencies);
});

app.post('/visualize', (req, res) => {
  const modules = req.body.modules;
  const visualization = visualizeModuleRelationshipsLocal(modules);
  res.json(visualization);
});

module.exports = {
  initializeApp,
  fetchUser,
  clearCache,
  someFunction,
  loadLandmarks,
  processLandmarks,
  createInPageButton,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  importAndExecute,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  writeReport,
  validateLandmark,
  applyAccessibilityFixesAndHarvestData,
  scanAccessibility,
  generateAccessibilityReport,
  getUserSafetyAdvice,
  addBook,
  getBooksList,
  harvestData,
  ensureUniqueLandmarks,
  sortLandmarks,
  getLandmarkById,
  accessiblyHelper,
  books,
  safetyCategory,
  config,
  CONFIG,
  validateTableAccessibility,
  validateTableStructure
};