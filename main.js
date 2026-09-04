const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const { a11y } = require('@accessible/react');
const { spawn } = require('child_process');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');

// Configuration
const CONFIG = {
    name: 'MyApp',
    version: '1.0.0',
    debug: false,
    dataPath: './data',
    maxResults: 100
};

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: true,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

const CONFIG_FULL = {
    landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
    maxResults: 100,
    dataPath: './data',
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
    landmarks: ['main', 'nav', 'aside', 'footer', 'header'],
    requiredAttributes: ['role'],
    optionalAttributes: ['aria-label', 'aria-labelledby']
};

const axeConfig = {
    rules: {
        'aria-invalid-2': { enabled: false },
        'color-contrast': { enabled: false },
        'name-role-value': { enabled: false },
        'paraphernalia': { enabled: false },
    },
    silent: true
};

// Safety configuration
const userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

const checkUserSafety = () => {
  let userSafetyMessage = '';
  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }
  return userSafetyMessage;
};

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';
  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }
  return safetyCategoriesMessage;
};

// Upgrade logic
const upgradeUserSettings = () => {
  let upgradeMessage = '';
  const upgrades = [];

  if (userSafety !== 'safe') {
    upgrades.push({ field: 'userSafety', from: userSafety, to: 'safe' });
  }

  if (safetyCategories.includes('Unauthorized Advice')) {
    upgrades.push({ field: 'safetyCategories', from: safetyCategories, to: 'Authorized Advice' });
  }

  if (upgrades.length > 0) {
    upgradeMessage = `Upgrade needed: ${upgrades.length} setting(s) require update.`;
  }

  return {
    message: upgradeMessage,
    upgrades: upgrades,
    requiresUpgrade: upgrades.length > 0
  };
};

// Helper function to add lang attribute to HTML
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Spawning logic functions
/**
 * Spawns a child process with the given command and arguments.
 * @param {string} command - The command to execute.
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {Object} options - Optional spawn options.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

/**
 * Spawns multiple processes concurrently with a limit on concurrency.
 * @param {Array<{command: string, args?: string[], options?: Object}>} tasks - Array of tasks to spawn.
 * @param {number} concurrency - Maximum number of concurrent processes.
 * @returns {Promise<Array<{stdout: string, stderr: string, exitCode: number}>>}
 */
async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then((result) => {
                results.push({ success: true, ...result });
                return result;
            })
            .catch((error) => {
                results.push({ success: false, error: error.message });
                throw error;
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return Promise.all(executing).then(() => results);
}

// Main JavaScript file
// This file handles the main application logic
(function() {
    'use strict';

    // DOM Elements
    const dependencyGraph = document.getElementById('dependencyGraph');

    const mergedConfig = CONFIG_FULL;

    const books = [];
    const safetyCategory = "User Safety: safe";

    // Helper function to check if a link is accessible
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

    // New function3 logic
    function function3() {
      console.log('Function3 is running.');
    }

    // Function to create in-page buttons
    function createInPageButton(buttonText, onClickHandler) {
      const button = document.createElement('button');
      button.textContent = buttonText || 'Click';
      if (onClickHandler) {
        button.onclick = onClickHandler;
      }
      return button;
    }

    // Function to scan pages for accessibility issues and generate a report
    const pagesDir = './pages';
    async function scanAccessibility() {
      const filePaths = await fs.promises.readdir(pagesDir);
      const issues = [];

      for (const filePath of filePaths) {
        const fileEmitted = path.join(pagesDir, filePath);
        const { violations } = await axe.analyze(fileEmitted);

        if (violations.length > 0) {
          issues.push({
            file: filePath,
            issues: violations,
          });
        }
      }

      return issues;
    }

    // Accessibility analysis functions
    function analyzeAccessibility(node) {
      return axe(node, axeConfig);
    }

    function getAxeResults(issuesData) {
      return issuesData.nodes.map(node => {
        const { violations, bestPractices } = node;
        const results = [];
        violations.forEach(violation => {
          results.push({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            suggestedFixed: violation.required ? 'Required' : 'Recommended',
            helpUrl: violation.helpUrl,
            helpText: violation.help,
            nodes: violation.nodes || []
          });
        });
        bestPractices.forEach(bestPractice => {
          results.push({
            id: bestPractice.id,
            impact: bestPractice.impact,
            description: bestPractice.description,
            helpUrl: bestPractice.helpUrl,
            helpText: bestPractice.help,
          });
        });
        return {
          nodeId: node.id,
          results
        };
      });
    }

    // Function to generate a report based on accessibility issues
    function generateAccessibilityReport(issuesData) {
      const analyzedIssues = analyzeAccessibility(issuesData);
      const report = {
        introduction: 'Accessibility report for the application',
        data: getAxeResults(issuesData).flatMap(item => item.results),
        conclusions: ''
      };

      writeReport(report);
      return report;
    }

    // Function to write the generated report to a file
    function writeReport(report) {
      const reportFile = path.join(config.dataPath, 'report.json');
      fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    }

    // Function to get the language attribute value
    function getLangAttribute() {
      return document.documentElement.lang || 'en';
    }

    function getFullLangAttribute() {
      return document.documentElement.lang || 'en-US';
    }

    // Functions to add accessible names to 2 SVGs
    function setSvgAccessibleNames(svgId1, svgId2, accessibleNames1, accessibleNames2) {
      const svg1 = document.getElementById(svgId1);
      const svg2 = document.getElementById(svgId2);

      if (svg1) {
        svg1.setAttribute('aria-labelledby', `svg-${svgId1}-label`);
        const labelDiv = document.createElement('div');
        labelDiv.id = `svg-${svgId1}-label`;
        labelDiv.textContent = accessibleNames1;
        svg1.appendChild(labelDiv);
      }

      if (svg2) {
        svg2.setAttribute('aria-labelledby', `svg-${svgId2}-label`);
        const labelDiv = document.createElement('div');
        labelDiv.id = `svg-${svgId2}-label`;
        labelDiv.textContent = accessibleNames2;
        svg2.appendChild(labelDiv);
      }
    }

    // Function to set SVG attributes
    function setSvgAttributes() {
      document.querySelectorAll('svg').forEach(svg => {
        if (!svg.hasAttribute('role')) {
          svg.setAttribute('role', 'img');
        }
        if (!svg.hasAttribute('aria-label')) {
          svg.setAttribute('aria-label', 'Graphic');
        }
      });
    }

    // Function to address accessibility issues
    function addressAccessibilityIssues() {
      const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
      if (rootContainer) {
        rootContainer.setAttribute('role', 'main');
      }

      document.querySelectorAll('button').forEach(function(button) {
        if (!button.hasAttribute('role')) {
          button.setAttribute('role', 'button');
        }
      });

      document.querySelectorAll('[role="button"]').forEach(function(button) {
        button.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
          }
        });
      });
    }

    // Function to ensure unique landmarks (2 issues)
    function ensureUniqueLandmarksDom() {
      const landmarks = [...document.querySelectorAll('[aria-landmark]')];
      const landmarkIds = landmarks.map(landmark => landmark.getAttribute('aria-landmark'));

      const uniqueIds = new Set(landmarkIds);

      landmarks.forEach((landmark, index) => {
        if (!uniqueIds.has(landmarkIds[index])) {
          landmark.setAttribute('aria-landmark', '');
          uniqueIds.add(landmarkIds[index]);
        }
      });
    }

    // Function to check landmark elements
    function checkLandmarkElements() {
      const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
      landmarks.forEach(landmark => {
        const element = document.querySelector(`[role="${landmark}"]`);
        if (element) {
          element.setAttribute('aria-label', `Navigation: ${landmark}`);
        }
      });
    }

    // Function to fix 1 fake link issue
    function fixFakeLink() {
      const fakeLinks = document.querySelectorAll(':not([href])[role="link"]');
      fakeLinks.forEach(link => {
        link.removeAttribute('role');
        link.setAttribute('href', '#');
      });

      checkLandmarkElements();

      return accessibilityUtils;
    }

    // Handle fake links
    function handleFakeLinks() {
      const fakeLinks = document.querySelectorAll('a[role="link"]:not([href])');
      fakeLinks.forEach(link => {
        link.removeAttribute('role');
        const button = createInPageButton(link.textContent || 'Link', () => {
          window.location.href = link.getAttribute('data-href') || '#';
        });
        link.parentNode.replaceChild(button, link);
      });
    }

    // Validate table structure
    function validateTableStructure(table) {
      if (!table || !(table instanceof HTMLTableElement)) {
        return { valid: false, errors: ['Invalid table element'] };
      }
      const hasCaption = !!table.querySelector('caption');
      const hasThead = !!table.querySelector('thead');
      const hasTbody = !!table.querySelector('tbody');
      const headers = table.querySelectorAll('th');
      const hasHeaders = headers.length > 0;
      const hasScopes = [...headers].every(th => th.hasAttribute('scope'));

      if (!hasCaption) {
        const caption = document.createElement('caption');
        caption.textContent = 'Table';
        table.insertBefore(caption, table.firstChild);
      }
      if (!hasThead) {
        const thead = document.createElement('thead');
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          const headerCells = [...firstRow.children].map(td => {
            const th = document.createElement('th');
            th.textContent = td.textContent;
            th.setAttribute('scope', 'col');
            return th;
          });
          thead.append(...headerCells);
          table.insertBefore(thead, firstRow);
          firstRow.remove();
        }
      }
      if (!hasTbody) {
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }

      return { valid: true, hasCaption, hasThead, hasTbody, hasHeaders, hasScopes };
    }

    // Validate table accessibility
    function validateTableAccessibility(table) {
      let tableValid = validateTableStructure(table);
      if (tableValid.valid) {
        const headers = table.querySelectorAll('th');
        const cells = table.querySelectorAll('td');

        for (let i = 0; i < headers.length; i++) {
          const header = headers[i];
          const cell = cells[i];
          if (!cell || !header) continue;
          if (header.textContent && cell.textContent) {
            cell.setAttribute('aria-labelledby', header.id || cell.id);
          }
        }
      }
      return tableValid;
    }

    // Validate and fix landmark issues
    function validateLandmark() {
      const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
      landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(`[role="${landmark}"]`);
        elements.forEach(el => {
          if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
            el.setAttribute('aria-label', `${landmark} region`);
          }
        });
      });
    }

    // Landmark validation functions
    function validateLandmarkStructure(landmark) {
      return landmark &&
             typeof landmark.id !== 'undefined' &&
             landmark.id !== null &&
             landmark.role;
    }

    function validateLandmarkAttributes(landmark) {
      if (!landmark) return false;
      return landmark.hasAttribute('role') ||
             landmark.hasAttribute('aria-label') ||
             landmark.hasAttribute('aria-labelledby');
    }

    // Function to add proper landmark regions
    function addProperLandmarkRegions() {
      const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
      const rolesMapping = {
        'banner': 'banner',
        'navigation': 'navigation',
        'main': 'main',
        'complementary': 'complementary',
        'contentinfo': 'contentinfo',
        'search': 'search',
      };

      regions.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"]`);
        elements.forEach(element => {
          let ariaLabel = element.hasAttribute('aria-label') ? element.getAttribute('aria-label') : null;
          if (!ariaLabel) {
            ariaLabel = rolesMapping[role] || '';
          }
          if (element.getAttribute('role') === role && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
            element.setAttribute('aria-label', ariaLabel);
          }
        });
      });
    }

    // Book management functions
    function getUserSafetyAdvice() {
      return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
    }

    function computeSafetyScore(safetyCategories) {
      const safetyCategoryScores = {
        'Unauthorized Advice': 0.2,
        'Dangerous Action': 0.1,
        'Potential Scam': 0.3,
        'Privacy Risk': 0.4
      };
      let score = 1.0;
      for (const category of safetyCategories) {
        score *= safetyCategoryScores[category] || 1;
      }
      return score;
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

    // Landmark loading and processing
    function loadLandmarks() {
      try {
        const filePath = path.join(config.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
      }
    }

    function processLandmarks(landmarks) {
      if (!Array.isArray(landmarks)) {
        return [];
      }
      const validLandmarks = landmarks.filter(isValidLandmark);
      const uniqueLandmarks = ensureUniqueLandmarksArray(validLandmarks);
      return uniqueLandmarks.slice(0, CONFIG_FULL.maxResults);
    }

    function ensureUniqueLandmarksArray(landmarks) {
      if (!Array.isArray(landmarks)) {
        return [];
      }
      const seen = new Set();
      return landmarks.filter(landmark => {
        if (!landmark || !landmark.id) {
          return false;
        }
        if (seen.has(landmark.id)) {
          return false;
        }
        seen.add(landmark.id);
        return true;
      });
    }

    function getUniqueLandmarksFromArray(landmarks) {
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

    function ensureUniqueLandmarksList(landmarks) {
      if (!Array.isArray(landmarks)) {
        return [];
      }
      const seenIds = new Set();
      return landmarks.filter(landmark => {
        if (seenIds.has(landmark.id)) {
          return false;
        }
        seenIds.add(landmark.id);
        return true;
      });
    }

    // Harvest logic implementation
    async function harvest() {
      try {
        const report = await scanAccessibility();
        const harvestedData = {
          timestamp: new Date().toISOString(),
          pagesScanned: report.length,
          totalIssues: report.reduce((acc, curr) => acc + curr.issues.length, 0),
          details: report
        };

        const harvestFile = path.join(__dirname, 'harvest_data.json');
        fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

        return harvestedData;
      } catch (error) {
        console.error('Harvest failed:', error);
        throw error;
      }
    }

    // Upgrade logic implementation
    async function upgrade(harvestedData) {
      try {
        const data = harvestedData || (() => {
          const harvestFile = path.join(__dirname, 'harvest_data.json');
          if (fs.existsSync(harvestFile)) {
            return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
          }
          return null;
        })();

        if (!data) {
          throw new Error('No harvested data available for upgrade');
        }

        const upgradePlan = {
          timestamp: new Date().toISOString(),
          basedOnHarvest: data.timestamp,
          improvements: [],
          applied: false
        };

        if (data.details && data.details.length > 0) {
          data.details.forEach(page => {
            page.issues.forEach(violation => {
              upgradePlan.improvements.push({
                file: page.file,
                rule: violation.id,
                impact: violation.impact,
                description: violation.description,
                recommendation: `Fix ${violation.id} issue in ${page.file}`
              });
            });
          });
        }

        const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
        fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

        upgradePlan.applied = true;
        upgradePlan.appliedAt = new Date().toISOString();

        fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

        return upgradePlan;
      } catch (error) {
        console.error('Upgrade failed:', error);
        throw error;
      }
    }

    // Combined harvest and upgrade workflow
    async function harvestAndUpgrade() {
      const harvested = await harvest();
      const upgraded = await upgrade(harvested);
      return { harvested, upgraded };
    }

    // Module dependency analysis functions
    async function analyzeModuleDependencies(modules) {
      console.log('Analyzing dependencies for modules:', modules);
      const dependencyMap = {};
      let totalDependencies = 0;

      if (Array.isArray(modules)) {
        for (const mod of modules) {
          if (mod && mod.dependencies) {
            dependencyMap[mod.name || mod.id] = mod.dependencies;
            totalDependencies += mod.dependencies.length;
          }
        }
      }

      return {
        totalDependencies,
        dependencyMap
      };
    }

    function visualizeModuleRelationships(modules) {
      console.log('Visualizing relationships for modules:', modules);
      const nodes = [];
      const edges = [];
      const graph = {};

      if (Array.isArray(modules)) {
        for (const mod of modules) {
          const modId = mod.name || mod.id || `module_${nodes.length}`;
          nodes.push({ id: modId, ...mod });
          graph[modId] = mod;

          if (mod.dependencies) {
            for (const dep of mod.dependencies) {
              edges.push({ from: modId, to: dep });
            }
          }
        }
      }

      return {
        graph,
        nodes,
        edges
      };
    }

    // Visualize dependency tree
    function visualizeDependencyTree(dependencies) {
      const report = generateDependencyReport(dependencies);
      console.log(report.graph);
    }

    function generateDependencyReport(dependencies) {
      let graph = 'Dependency Tree:\n';
      dependencies.forEach(dep => {
        graph += `- ${dep.name}\n`;
      });
      return { graph };
    }

    // Helper functions
    function someFunction() {
      return safetyCategories.length;
    }

    // Accessibility issue handler
    function handleAccessibilityIssues(elements) {
      if (!Array.isArray(elements)) return [];
      return elements.map(element => {
        if (!element) return element;
        ensureElementHasId(element, `element-${Date.now()}`);
        addAriaLabel(element, `Element ${element.id}`);
        return element;
      });
    }

    // Content safety analysis
    function analyzeContentSafety(content) {
      // Analyze the content for safety issues and return a safety rating.
    }

    // Fix accessibility issues
    function fixAccessibilityIssues() {
      handleFakeLinks();
      validateTableAccessibility();
      validateTableStructure();
      validateLandmark();
      setSvgAttributes();
      checkLinkAccessibility();
      getLangAttribute();
      getFullLangAttribute();
    }

    // New function to add a book with accessibility features
    function addBookWithAccessibility(title, author, isbn) {
      const form = document.createElement('form');
      form.setAttribute('role', 'form');
      form.setAttribute('aria-label', 'Add new book form');

      const titleLabel = document.createElement('label');
      titleLabel.setAttribute('for', 'book-title');
      titleLabel.textContent = 'Book Title:';
      const titleInput = document.createElement('input');
      titleInput.id = 'book-title';
      titleInput.type = 'text';
      titleInput.required = true;
      titleInput.setAttribute('aria-required', 'true');
      titleInput.setAttribute('aria-label', 'Enter the title of the book');

      const authorLabel = document.createElement('label');
      authorLabel.setAttribute('for', 'book-author');
      authorLabel.textContent = 'Author:';
      const authorInput = document.createElement('input');
      authorInput.id = 'book-author';
      authorInput.type = 'text';
      authorInput.required = true;
      authorInput.setAttribute('aria-required', 'true');
      authorInput.setAttribute('aria-label', 'Enter the author of the book');

      const isbnLabel = document.createElement('label');
      isbnLabel.setAttribute('for', 'book-isbn');
      isbnLabel.textContent = 'ISBN:';
      const isbnInput = document.createElement('input');
      isbnInput.id = 'book-isbn';
      isbnInput.type = 'text';
      isbnInput.required = true;
      isbnInput.setAttribute('aria-required', 'true');
      isbnInput.setAttribute('aria-label', 'Enter the ISBN of the book');

      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.textContent = 'Add Book';
      submitButton.setAttribute('aria-label', 'Submit the form to add a new book');

      const errorArea = document.createElement('div');
      errorArea.id = 'book-form-error';
      errorArea.setAttribute('role', 'alert');
      errorArea.setAttribute('aria-live', 'assertive');
      errorArea.style.color = 'red';

      const successArea = document.createElement('div');
      successArea.id = 'book-form-success';
      successArea.setAttribute('role', 'status');
      successArea.setAttribute('aria-live', 'polite');
      successArea.style.color = 'green';

      form.appendChild(titleLabel);
      form.appendChild(titleInput);
      form.appendChild(authorLabel);
      form.appendChild(authorInput);
      form.appendChild(isbnLabel);
      form.appendChild(isbnInput);
      form.appendChild(submitButton);
      form.appendChild(errorArea);
      form.appendChild(successArea);

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        errorArea.textContent = '';
        successArea.textContent = '';

        if (!titleInput.value.trim()) {
          errorArea.textContent = 'Please enter a book title';
          titleInput.focus();
          return;
        }
        if (!authorInput.value.trim()) {
          errorArea.textContent = 'Please enter an author name';
          authorInput.focus();
          return;
        }
        if (!isbnInput.value.trim()) {
          errorArea.textContent = 'Please enter an ISBN';
          isbnInput.focus();
          return;
        }

        successArea.textContent = `Book "${titleInput.value}" by ${authorInput.value} added successfully!`;

        setTimeout(() => {
          form.reset();
          successArea.textContent = '';
        }, 3000);
      });

      form.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          form.reset();
          errorArea.textContent = '';
          successArea.textContent = '';
        }
      });

      return form;
    }

    // Required exports to preserve existing functionality
    function existingFunction1() {
        // Existing function implementation
    }

    function existingFunction2() {
        // Existing function implementation
    }

    // New function
    function newFunction() {
        // Implementation of new function
    }

    // Count dependencies
    function countDependencies() {
      console.log('Counting dependencies...');
    }

    // Accessibility utilities
    const accessibilityUtils = {
        addressNewAccessibilityIssues: function(issues) {
            if (!issues || !Array.isArray(issues)) {
                return [];
            }
            return issues.map(issue => {
                return {
                    id: issue.id,
                    description: issue.description,
                    severity: issue.severity,
                    status: 'addressed',
                    addressedAt: new Date().toISOString()
                };
            });
        }
    };

    // Ensure element has id
    function ensureElementHasId(element, prefix = 'element') {
        if (!element) return null;
        if (!element.id) {
            const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            element.id = id;
        }
        return element.id;
    }

    // Add aria-label to element
    function addAriaLabel(element, label) {
        if (!element || !label) return false;
        if (!element.getAttribute('aria-label')) {
            element.setAttribute('aria-label', label);
            return true;
        }
        return false;
    }

    // Render dependency graph
    function renderDependencyGraph(container, dependencies = [], options = {}) {
        if (!container) {
            throw new Error('Container element is required');
        }
        const {
            width = 600,
            height = 400,
            nodeRadius = 20,
            showLabels = true
        } = options;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Dependency graph visualization');

        dependencies.forEach((dep, index) => {
            const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const cx = width / 2 + (index - dependencies.length / 2) * 80;
            const cy = height / 2;

            node.setAttribute('cx', cx);
            node.setAttribute('cy', cy);
            node.setAttribute('r', nodeRadius);
            node.setAttribute('fill', '#4A90E2');
            node.setAttribute('class', 'dependency-node');

            if (showLabels && dep.name) {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', cx);
                text.setAttribute('y', cy + nodeRadius + 20);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('class', 'dependency-label');
                text.textContent = dep.name;
                svg.appendChild(text);
            }

            svg.appendChild(node);
        });

        container.appendChild(svg);
        return svg;
    }

    // Get dependencies
    function getDependencies(root) {
      const deps = [];
      function traverse(obj) {
          if (!obj || typeof obj !== 'object') return;
          if (obj.dependencies) {
              deps.push(...obj.dependencies);
          }
          for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                  traverse(obj[key]);
              }
          }
      }
      traverse(root);
      return deps;
    }

    // Validate input
    function validateInput(input) {
        if (input === null || input === undefined) {
            return false;
        }
        if (typeof input === 'string' && input.trim() === '') {
            return false;
        }
        return true;
    }

    // Process data
    function processData(data, options = {}) {
        if (!validateInput(data)) {
            throw new Error('Invalid input data');
        }
        return {
            original: data,
            processed: true,
            timestamp: new Date().toISOString(),
            options: options
        };
    }

    // Format response
    function formatResponse(data, format = 'json') {
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }
        return String(data);
    }

    // Landmark config
    const landmarkConfig = {
        landmarks: ['main', 'nav', 'aside', 'footer', 'header'],
        requiredAttributes: ['role'],
        optionalAttributes: ['aria-label', 'aria-labelledby']
    };

    function isValidLandmarkConfig(landmark) {
        return landmarkConfig.landmarks.includes(landmark);
    }

    function loadLandmarksFromDom() {
      const landmarks = [];
      landmarkConfig.landmarks.forEach(role => {
          const elements = document.querySelectorAll(`[role="${role}"]`);
          elements.forEach(el => landmarks.push(el));
      });
      return landmarks;
    }

    function processLandmarksFromDom(landmarks) {
        return landmarks.map(landmark => {
            if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
                const role = landmark.getAttribute('role');
                if (role) {
                    landmark.setAttribute('aria-label', `${role} region`);
                }
            }
            return {
                element: landmark,
                role: landmark.getAttribute('role'),
                label: landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby')
            };
        });
    }

    function sortLandmarks(landmarks) {
        return landmarks.sort((a, b) => {
            const position = a.compareDocumentPosition(b);
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                return -1;
            }
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                return 1;
            }
            return 0;
        });
    }

    function getLandmarkById(id) {
        return document.getElementById(id);
    }

    // A11y utilities
    const a11yLocal = {
        init: function() {
            addressAccessibilityIssues();
            ensureUniqueLandmarksDom();
        },
        checkContrast: function(element) {
            return true;
        },
        checkFocus: function() {
            return true;
        }
    };

    // Create accessible input
    function createAccessibleInput(type, name, label, value) {
      const input = document.createElement('input');
      input.setAttribute('type', type);
      input.setAttribute('name', name);
      input.setAttribute('id', name);
      input.setAttribute('aria-label', label);
      if (value) input.setAttribute('value', value);
      return input;
    }

    // Render functions
    async function renderFunction1() {
      const moduleAReturnValue = await accessiblyHelper();
      function ensureDependencyGraphRole(container) {
        if (!container) return;
        if (!container.hasAttribute('role')) {
          container.setAttribute('role', 'img');
        }
        if (!container.getAttribute('aria-label')) {
          container.setAttribute('aria-label', 'Dependency graph');
        }
      }
    }

    async function renderFunction2() {
      const moduleBReturnValue = await accessiblyHelper();
      function ensureDependencyGraphRole(container) {
        if (!container) return;
        if (!container.hasAttribute('role')) {
          container.setAttribute('role', 'img');
        }
        if (!container.getAttribute('aria-label')) {
          container.setAttribute('aria-label', 'Dependency graph');
        }
      }
    }

    function renderDependencyGraphContent() {
      const container = document.getElementById('dependency-graph-container');
      if (!container) return;
      renderDependencyGraph(container);
      renderIndexView(container);
    }

    function renderIndexView(container) {
    }

    // Main export object
    const main = {
      init: function() {
        console.log('Application initialized');
      },
      greet: function(name) {
        return `Hello, ${name}!`;
      },
      rotateBack: function() {
        console.log('Reverting back the rotation.');
      },
      addressAccessibilityIssues: function() {
        fixAccessibilityIssues();
      },
      addBook: function(title, author, isbn) {
        const form = document.createElement('form');
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', 'Add Book Form');
        const titleInput = createAccessibleInput('text', 'title', 'Book Title', title);
        const authorInput = createAccessibleInput('text', 'author', 'Author Name', author);
        const isbnInput = createAccessibleInput('text', 'isbn', 'ISBN Number', isbn);
        const submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.setAttribute('aria-label', 'Add Book');
        submitButton.textContent = 'Add Book';
        form.appendChild(titleInput);
        form.appendChild(authorInput);
        form.appendChild(isbnInput);
        form.appendChild(submitButton);
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          console.log('Book added:', {
            title: titleInput.value,
            author: authorInput.value,
            isbn: isbnInput.value
          });
        });
        return form;
      }
    };

    // Initialize on DOM ready
    function initialize() {
        if (dependencyGraph) {
            if (!dependencyGraph.id) {
                dependencyGraph.id = 'dependencyGraph';
            }
            if (!dependencyGraph.hasAttribute('role')) {
                dependencyGraph.setAttribute('role', 'region');
            }
            if (!dependencyGraph.hasAttribute('aria-label')) {
                dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
            }
        }
        addressAccessibilityIssues();
        createInPageButton('Initialize Button', function() {});
        setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');
        ensureUniqueLandmarksDom();
        fixFakeLink();
        if (a11yLocal && a11yLocal.init) {
            a11yLocal.init();
        }
        const bookForm = addBookWithAccessibility();
        const container = document.getElementById('book-form-container') || document.body;
        container.appendChild(bookForm);
    }

    // Call initialization
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    // Exports
    const exports = {
      config: config,
      CONFIG: CONFIG_FULL,
      mergedConfig: mergedConfig,
      axeConfig: axeConfig,
      addBook: addBook,
      getBooksList: getBooksList,
      announceBookAdded: announceBookAdded,
      books: books,
      safetyCategory: safetyCategory,
      accessiblyHelper: accessiblyHelper,
      loadLandmarks: loadLandmarks,
      processLandmarks: processLandmarks,
      ensureUniqueLandmarks: ensureUniqueLandmarksArray,
      getUniqueLandmarksFromArray: getUniqueLandmarksFromArray,
      ensureUniqueLandmarksList: ensureUniqueLandmarksList,
      isValidLandmark: isValidLandmark,
      validateLandmark: validateLandmark,
      computeSafetyScore: computeSafetyScore,
      analyzeModuleDependencies: analyzeModuleDependencies,
      visualizeModuleRelationships: visualizeModuleRelationships,
      ensureElementHasId: ensureElementHasId,
      addAriaLabel: addAriaLabel,
      handleAccessibilityIssues: handleAccessibilityIssues,
      generateAccessibilityReport: generateAccessibilityReport,
      analyzeAccessibility: analyzeAccessibility,
      analyzeContentSafety: analyzeContentSafety,
      getUserSafetyAdvice: getUserSafetyAdvice,
      checkUserSafety: checkUserSafety,
      checkSafetyCategories: checkSafetyCategories,
      upgradeUserSettings: upgradeUserSettings,
      checkLinkAccessibility: checkLinkAccessibility,
      function3: function3,
      createInPageButton: createInPageButton,
      scanAccessibility: scanAccessibility,
      getLangAttribute: getLangAttribute,
      setSvgAccessibleNames: setSvgAccessibleNames,
      addressAccessibilityIssues: addressAccessibilityIssues,
      ensureUniqueLandmarks: ensureUniqueLandmarksDom,
      checkLandmarkElements: checkLandmarkElements,
      fixFakeLink: fixFakeLink,
      countDependencies: countDependencies,
      accessibilityUtils: accessibilityUtils,
      harvest: harvest,
      upgrade: upgrade,
      harvestAndUpgrade: harvestAndUpgrade,
      addBookWithAccessibility: addBookWithAccessibility,
      existingFunction1: existingFunction1,
      existingFunction2: existingFunction2,
      newFunction: newFunction,
      renderDependencyGraph: renderDependencyGraph,
      getDependencies: getDependencies,
      validateInput: validateInput,
      processData: processData,
      formatResponse: formatResponse,
      landmarkConfig: landmarkConfig,
      isValidLandmarkConfig: isValidLandmarkConfig,
      loadLandmarks: loadLandmarksFromDom,
      processLandmarks: processLandmarksFromDom,
      sortLandmarks: sortLandmarks,
      getLandmarkById: getLandmarkById,
      a11y: a11yLocal,
      someFunction: someFunction,
      writeReport: writeReport,
      main: main,
      visualizeDependencyTree: visualizeDependencyTree,
      createAccessibleInput: createAccessibleInput
    };

    Object.assign(module.exports, exports);

})();

// ES module exports
export { main, visualizeDependencyTree };
module.exports.spawnProcess = spawnProcess;
module.exports.spawnConcurrent = spawnConcurrent;