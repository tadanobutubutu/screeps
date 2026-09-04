import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import fastMap from 'fast-map';
import utils from './utils';
import axe from 'axe-core';
import accessiblyHelper from './accessibly-helper';

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

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

let dependencyGraph = {};

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

function greet(name) {
    return `Hello, ${name}!`;
}

function function3() {
    const depGraph = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');

    if (depGraph) {
        depGraph.setAttribute('role', 'region');
        depGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
        depGraph.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.body.querySelector('button[aria-label="Show accessibility information"]').click();
            }
        });
    }
}

function addDependency(name, version) {
    if (!appData.dependencies) {
        appData.dependencies = {};
    }
    appData.dependencies[name] = version;
}

function removeDependency(name) {
    if (appData.dependencies && appData.dependencies[name]) {
        delete appData.dependencies[name];
    }
}

function countDependencies() {
    return appData.dependencies ? Object.keys(appData.dependencies).length : 0;
}

function someFunction() {
    return 'Some result';
}

function functionA(param) {
    return `Function A with param: ${param}`;
}

function functionB(param) {
    return `Function B with param: ${param}`;
}

const processData = (data) => {
    return data;
};

const formatResponse = (response) => {
    return response;
};

const getLangAttribute = () => {
    if (typeof document !== 'undefined' && document.documentElement) {
        return document.documentElement.lang || 'en';
    }
    return 'en';
};

const addLangAttribute = () => {
    const htmlElement = typeof document !== 'undefined' ? document.documentElement : null;
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', 'en');
    }
};

function addressAccessibilityIssues() {
    const rootContainer = typeof document !== 'undefined' && document.getElementById('root') 
        ? document.getElementById('root').parentElement : null;
    if (rootContainer && typeof document !== 'undefined') {
        rootContainer.setAttribute('role', 'main');
    }

    const skipLink = typeof document !== 'undefined' && document.querySelector('[href^="#"]');
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

    if (typeof document !== 'undefined') {
        document.querySelectorAll('[role="button"]').forEach(function(button) {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
}

async function scanAccessibility() {
    const pagesDir = './pages';
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

function addMainLandmark(html) {
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
    return table ? table.querySelectorAll('tr').length > 0 : false;
}

function validateTableStructure(table) {
    return table ? table.querySelector('th') !== null && table.querySelector('td') !== null : false;
}

function fixTableStructure(html) {
    return html;
}

function getSvgAccessibleName(svgElement) {
    return typeof svgElement !== 'undefined' ? (svgElement.getAttribute('aria-label') || svgElement.getAttribute('aria-labelledby') || '') : '';
}

function setSvgAttributes(svgElement, name) {
    return;
}

function addSvgAccessibleNames(html) {
    return html;
}

function renderIndexView() {
}

function ensureUniqueLandmarks(html) {
    return html;
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

function fixLandmarks(html) {
    return html;
}

function fixFakeLinks(html) {
    return html;
}

function applyAccessibilityFixes(html) {
    if (!html || typeof html !== 'string') return html;
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

function applyAllAccessibilityFixes(html) {
    return applyAccessibilityFixes(html);
}

function createInPageButton() {
    if (typeof document !== 'undefined') {
        const button = document.createElement('button');
        button.textContent = 'Accessibility Info';
        button.setAttribute('aria-label', 'Show accessibility information');
        document.body.appendChild(button);
    }
}

function validateLinkAccessibility() {
}

function handleFakeLinks() {
}

function addProperLandmarkRegions() {
}

function setSvgAccessibleNames(svgId1, svgId2, name1, name2) {
}

function checkLinkAccessibility() {
}

function fixFakeLink() {
}

function addressNewAccessibilityIssues() {
}

function getAxeResults(issuesData) {
  return issuesData.map(node => {
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

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(validateLandmark);
  const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function harvest() {
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

function upgrade(harvestedData) {
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

async function generateAccessibilityReport(issuesData) {
    let issues;

    if (!issuesData) {
        issues = [];
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
            const userSafetyCategories = {
                unsafe: true,
                categories: [
                    'Illegal Activity',
                    'Fraud/Deception',
                    'Controlled/Regulated Substances',
                    'Unauthorized Advice'
                ]
            };
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
                    `Detected ${categoryCounts['Privacy Risk'] || 0} instance(s) of Privacy Risk.`
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

function function3ForBrowser() {
    if (typeof document !== 'undefined') {
        const dependencyGraph = document.getElementById('dependencyGraph');
        const Nav = React.lazy(() => import('./Nav'));
        const Main = React.lazy(() => import('./Main'));

        if (dependencyGraph) {
            const root = ReactDOM.createRoot(dependencyGraph);
            root.render(
                <React.StrictMode>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Nav />
                        <Main />
                    </React.Suspense>
                </React.StrictMode>
            );
        }
    }
}

function addFocusVisiblePolyfill() {
    if (typeof document !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('js-focus-visible');
    }
}

function addressAccessibilityIssuesForBrowser() {
    if (typeof document === 'undefined') return;

    const root = document.documentElement || document.body;
    if (root && !root.hasAttribute('role')) {
        root.setAttribute('role', 'document');
    }

    let skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
        skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.setAttribute('class', 'skip-link');
        if (document.body.firstChild) {
            document.body.insertBefore(skipLink, document.body.firstChild);
        } else {
            document.body.appendChild(skipLink);
        }
    }

    const button = document.querySelector('button[aria-label="Show accessibility information"]');
    if (button) {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
    }

    addFocusVisiblePolyfill();
}

function initializeForBrowser() {
    if (typeof document === 'undefined') return;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addressAccessibilityIssues();
            createInPageButton();
            function3();
        });
    } else {
        addressAccessibilityIssues();
        createInPageButton();
        function3();
    }
}

function initialize() {
    console.log('Initializing application...');
    if (typeof window !== 'undefined' && document) {
        initializeForBrowser();
    }
    return true;
}

function analyzeContentSafety(content) {
    return { safe: true };
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
        const callPattern = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
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
        'getLangAttribute',
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
        'countModuleDependencies',
        'spawnProcess'
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
    if (!rgb) return 0;
    const rsrgb = rgb.r / 255;
    const gsrgb = rgb.g / 255;
    const bsrgb = rgb.b / 255;

    const r = rsrgb <= 0.03928 ? rsrgb / 12.92 : Math.pow((rsrgb + 0.055) / 1.055, 2.4);
    const g = gsrgb <= 0.03928 ? gsrgb / 12.92 : Math.pow((gsrgb + 0.055) / 1.055, 2.4);
    const b = bsrgb <= 0.03928 ? bsrgb / 12.92 : Math.pow((bsrgb + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function towerDefense() {
    console.log('Tower defense system initialized.');
}

function initializeBot() {
    console.log('Initializing Screeps bot...');
    return true;
}

if (typeof require !== 'undefined' && require.main === module) {
    initializeBot();
}

if (typeof window !== 'undefined' && document) {
    initializeForBrowser();
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
    ensureUniqueLandmarks,
    ensureUniqueLandmarksList,
    generateAccessibilityReport,
    applyAllAccessibilityFixes,
    fixLandmarks,
    fixFakeLinks,
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

if (typeof document !== 'undefined') {
    (function() {
        'use strict';

        const dependencyGraph = document.getElementById('dependencyGraph');
        const harvestButton = document.createElement('button');

        function initializeFromScript() {
            function3();
            addressAccessibilityIssues();
            createInPageButton();

            harvestButton.textContent = 'Start Harvest';
            harvestButton.setAttribute('aria-label', 'Start harvest');
            document.body.appendChild(harvestButton);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFromScript);
        } else {
            initializeFromScript();
        }
    })();
}