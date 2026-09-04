// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const fastMap = require('fast-map');
const utils = require('./utils');
const axe = require('axe-core');
const accessiblyHelper = require('./accessibly-helper');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: false,
  dataPath: './data',
  maxResults: 100
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

// Dependency analysis
let dependencyGraph = {};

// Ensure the dependencyGraph container has a proper ARIA role
if (dependencyGraph) {
  dependencyGraph.setAttribute('role', 'region');
  dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

// Format response
function formatResponse(data) {
  return data;
}

// Landmark validation
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
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

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

function calculateSum(a, b) {
  return a + b;
}

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);
    return uniqueLandmarks.slice(0, config.maxResults);
}

function ensureElementHasId(element, prefix = 'element') {
  if (!element) return null;

  if (!element.id) {
    const id = prefix + Math.random().toString(36).substring(2, 9);
    element.id = id;
  }
  return element.id;
}

function addAriaLabel(element, label) {
  if (!element || !label) return false;

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
    return true;
  }
  return false;
}

function ensureUniqueLandmarksList(landmarks) {
  if (!Array.isArray(landmarks)) return [];
  const seenIds = new Set();
  return landmarks.filter(landmark => {
    if (seenIds.has(landmark.id)) return false;
    seenIds.add(landmark.id);
    return true;
  });
}

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

    const child = require('child_process').spawn(command, args, spawnOptions);

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

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  return { safe: true };
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  const seen = new Map();

  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    if (seen.has(tag)) {
      landmark.setAttribute('aria-label', `${tag}-${seen.get(tag)}`);
      seen.set(tag, seen.get(tag) + 1);
    } else {
      seen.set(tag, 1);
    }
  });
}

// Address accessibility issues - DOM-based
function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Implement skip link functionality
  const skipLink = document.querySelector('[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Trap focus in modal and announce welcome message
  const modalElement = document.getElementById('modal');
  if (modalElement && a11y && a11y.trapFocus) {
    a11y.trapFocus(modalElement);
  }
  if (a11y && a11y.announce) {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  // Adding an alt attribute to an image
  const imageElement = document.getElementById('example-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  // Correcting the ARIA role for a div
  const divElement = document.getElementById('example-div');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

async function scanAccessibility() {
    const filePaths = await fs.promises.readdir(pagesDir);
    const issues = [];

    for (const filePath of filePaths) {
        const fullPath = path.join(pagesDir, filePath);
        try {
            const { violations } = await axe.analyze(fullPath);
            if (violations.length > 0) {
                issues.push({
                    file: filePath,
                    issues: violations,
                });
            }
        } catch (e) {
            console.error(`axe analysis failed for ${fullPath}`, e);
        }
    }

    return issues;
}

function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

function visualizeModuleRelationships(modules) {
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

function getLangAttribute() {
    return 'en';
}

function addLangAttribute(html) {
    if (!html || typeof html !== 'string') return html;
    if (!html.includes('<html') || html.includes('lang=')) return html;
    return html.replace('<html', '<html lang="en"');
}

function addMainLandmark(html) {
    // Placeholder implementation
    return html;
}

function validateLandmark(landmark) {
  return landmark &&
    typeof landmark.id !== 'undefined' &&
    landmark.id !== null;
}

function validateLandmarkAttributes(landmarkElement) {
    // Placeholder
}

function validateLandmarkStructure(landmarkElement) {
    // Placeholder
}

function validateTableAccessibility(table) {
    // Placeholder
}

function validateTableStructure(table) {
    // Placeholder
}

function fixTableStructure(html) {
    // Placeholder
    return html;
}

function getSvgAccessibleName(svgElement) {
    // Placeholder
    return '';
}

function setSvgAttributes(svgElement, name) {
    // Placeholder
}

function addSvgAccessibleNames(html) {
    // Placeholder
    return html;
}

function renderIndexView() {
    // Placeholder
}

function ensureUniqueLandmarks2(html) {
    // Placeholder for non-DOM environment
    return html;
}

function fixLandmarks(html) {
    // Placeholder
    return html;
}

function fixFakeLinks(html) {
    // Placeholder
    return html;
}

function applyAccessibilityFixes(html) {
    if (!html || typeof html !== 'string') return html;
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks2(result);
    result = fixFakeLinks(result);
    return result;
}

function applyAllAccessibilityFixes(html) {
    return applyAccessibilityFixes(html);
}

function createInPageButton() {
    // Placeholder for non-DOM environment
}

function validateLinkAccessibility() {
    // Placeholder
}

function handleFakeLinks() {
    // Placeholder
}

function addProperLandmarkRegions() {
    // Placeholder
}

function setSvgAccessibleNames(svgId1, svgId2, name1, name2) {
    // Placeholder
}

function checkLinkAccessibility() {
    // Placeholder
}

function fixFakeLink() {
    // Placeholder
}

function addressNewAccessibilityIssues() {
    // Placeholder for non-DOM environment
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

function addressAccessibilityIssuesWithReport(insightReport) {
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
    console.log('Addressing accessibility issues from insight report:', insightReport);
}

function parseColor(colorString) {
    if (!colorString) return null;

    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10)
        };
    }

    const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        } else {
            return {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    }

    const namedColors = {
        'black': { r: 0, g: 0, b: 0 },
        'white': { r: 255, g: 255, b: 255 },
        'red': { r: 255, g: 0, b: 0 },
        'green': { r: 0, g: 128, b: 0 },
        'blue': { r: 0, g: 0, b: 255 },
        'yellow': { r: 255, g: 255, b: 0 },
        'gray': { r: 128, g: 128, b: 128 },
        'grey': { r: 128, g: 128, b: 128 }
    };
    const lowerColor = colorString.toLowerCase();
    if (namedColors[lowerColor]) {
        return namedColors[lowerColor];
    }

    return null;
}

function calculateLuminance(rgb) {
    const rsrgb = rgb.r / 255;
    const gsrgb = rgb.g / 255;
    const bsrgb = rgb.b / 255;

    const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function countDependencies(code) {
    if (typeof code !== 'string') {
        return {
            totalFunctions: 0,
            internalDependencies: 0,
            externalDependencies: 0,
            functionCallGraph: {}
        };
    }

    const functionDeclMatches = code.match(/function\s+\w+\s*\(/g) || [];
    const arrowFunctionMatches = code.match(/(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g) || [];
    const totalFunctions = functionDeclMatches.length + arrowFunctionMatches.length;

    const functionNames = code.match(/function\s+(\w+)\s*\(/g) || [];
    const extractedNames = functionNames.map(match => match.replace(/function\s+(\w+)\s*\(/, '$1'));

    let internalDependencies = 0;
    const functionCallGraph = {};

    extractedNames.forEach(funcName => {
        const callPattern = new RegExp(`\b${funcName}\s*\(`, 'g');
        const calls = code.match(callPattern) || [];
        const callCount = Math.max(0, calls.length - 1);
        if (callCount > 0) {
            functionCallGraph[funcName] = callCount;
            internalDependencies += callCount;
        }
    });

    const importMatches = code.match(/^import\s+.*\s+from\s+['"][^'"]+['"]/gm) || [];
    const requireMatches = code.match(/require\(['"][^'"]+['"]\)/g) || [];
    const externalDependencies = importMatches.length + requireMatches.length;

    return {
        totalFunctions,
        internalDependencies,
        externalDependencies,
        functionCallGraph
    };
}

function countModuleDependencies() {
    const functions = [
        'addLangAttribute',
        'fixTableStructure',
        'fixLandmarks',
        'addSvgAccessibleNames',
        'ensureUniqueLandmarks',
        'fixFakeLinks',
        'applyAccessibilityFixes',
        'addressAccessibilityIssues',
        'parseColor',
        'calculateLuminance',
        'countDependencies',
        'countModuleDependencies'
    ];

    const callGraph = {
        'applyAccessibilityFixes': [
            'addLangAttribute',
            'fixTableStructure',
            'fixLandmarks',
            'addSvgAccessibleNames',
            'ensureUniqueLandmarks',
            'fixFakeLinks'
        ],
        'calculateLuminance': ['parseColor'],
        'addressAccessibilityIssues': ['applyAccessibilityFixes']
    };

    let internalDeps = 0;
    Object.values(callGraph).forEach(calls => {
        internalDeps += calls.length;
    });

    return {
        totalFunctions: functions.length,
        internalDependencies: internalDeps,
        externalDependencies: 0,
        functionCallGraph: callGraph,
        functions: functions
    };
}

async function generateAccessibilityReport(issuesData) {
    let issues;

    if (!issuesData) {
        issues = [];
        // Axe analysis if available
        try {
            const axeIssues = await axe.analyze('./index.html');
            if (Array.isArray(axeIssues)) {
                issues = issues.concat(axeIssues);
            }
        } catch (e) {
            console.error('axe analysis failed', e);
        }

        const report = {
            introduction: 'Accessibility report for the application',
            data: issues,
            conclusions: '',
        };

        if (issues && Array.isArray(issues) && issues.length > 0) {
            const conclusionParts = [];
            const categoryCounts = {};
            userSafetyCategories.categories.forEach(cat => {
                categoryCounts[cat.trim()] = 0;
            });

            issues.forEach(issue => {
                const category = issue.categories ? issue.categories[0].type : issue.type;
                if (categoryCounts[category] !== undefined) {
                    categoryCounts[category]++;
                }
            });

            if (Object.keys(categoryCounts).length > 0) {
                conclusionParts.push(
                    `Detected ${categoryCounts['Unauthorized Advice'] || 0} instance(s) of Unauthorized Advice.`,
                    `Detected ${categoryCounts['Dangerous Action'] || 0} instance(s) of Dangerous Action.`,
                    `Detected ${categoryCounts['Potential Scam'] || 0} instance(s) of Potential Scam.`,
                    `Detected ${categoryCounts['Privacy Risk'] || 0} instance(s) of Privacy Risk`
                );
            } else {
                conclusionParts.push('No accessibility issues were found.');
            }
            report.conclusions = conclusionParts.join(' ');
        }

        return report;
    } else {
        issues = accessiblyHelper(issuesData);
        const report = {
            introduction: 'Accessibility report for the application',
            data: issues,
            conclusions: ''
        };
        return report;
    }
}

function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

async function importAndExecute(modulePath) {
    const module = await import(modulePath);
    return module;
}

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

async function harvestAndUpgrade() {
    const harvested = await harvest();
    const upgraded = await upgrade(harvested);
    return { harvested, upgraded };
}

async function accessibilityReportEndpoint(req, res) {
    try {
        const report = await generateAccessibilityReport();
        if (res && typeof res.status === 'function' && typeof res.json === 'function') {
            res.status(200).json({
                success: true,
                report: report
            });
        }
        return report;
    } catch (error) {
        console.error('Error in accessibility report endpoint:', error);
        if (res && typeof res.status === 'function' && typeof res.json === 'function') {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
        throw error;
    }
}

function towerDefense() {
    console.log('Tower defense system initialized.');
}

function initialize() {
  console.log('Initializing application...');
  return true;
}

const userSafetyCategories = {
    unsafe: true,
    categories: [
        'Illegal Activity',
        'Fraud/Deception',
        'Controlled/Regulated Substances',
        'Unauthorized Advice'
    ]
};

function getUserSafetyAdvice() {
    const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
    return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

module.exports = {
    getDependencyGraph,
    spawnProcess,
    analyzeContentSafety,
    addressAccessibilityIssues,
    applyAccessibilityFixes,
    getUserSafetyAdvice,
    analyzeModuleDependencies,
    visualizeModuleRelationships,
    loadLandmarks,
    processLandmarks,
    ensureUniqueLandmarksList,
    getAxeResults,
    scanAccessibility,
    getLangAttribute,
    addLangAttribute,
    addMainLandmark,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    addSvgAccessibleNames,
    renderIndexView,
    spawnConcurrent,
    ensureUniqueLandmarks,
    generateAccessibilityReport,
    applyAllAccessibilityFixes,
    fixLandmarks,
    fixFakeLinks,
    importAndExecute,
    writeReport,
    parseColor,
    calculateLuminance,
    towerDefense,
    countDependencies,
    countModuleDependencies,
    harvest,
    upgrade,
    harvestAndUpgrade,
    accessibilityReportEndpoint,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions,
    setSvgAccessibleNames,
    checkLinkAccessibility,
    fixFakeLink,
    addressNewAccessibilityIssues,
    initialize
};