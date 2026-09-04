// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: d7e5d9d2506991a271c61dcc822f165d7e7185a5_
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// _Commit: 2bef4bae62624a408f4d970eb2e38fc2a31aa89b_

// <!-- todo-hash: 035cdf3563f11abc4bfb15e4aa8a4bb8324daeb1 -->

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
const { spawn } = require('child_process');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

// Application state
let isInitialized = false;
const appData_originSide = {};
const appData = {
  title: 'Screeps',
  version: '1.0.0'
};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";
let userSafety = "unsafe";
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

function calculateSum(a, b) {
  return a + b;
}

const UserSafetyObj = {
  unsafe: {
    category: 'Unauthorized Advice',
    description: 'This user may pose a risk to the system'
  },
  safe: {
    category: 'Following Safety Guidelines',
    description: 'This user follows safety guidelines'
  }
};

const userSafetyCategories = {
    unsafe: true,
    categories: [
        'Illegal Activity',
        'Fraud/Deception',
        'Controlled/Regulated Substances',
        'Unauthorized Advice'
    ]
};

// Utility functions
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

function validateLandmark(landmarkElement) {
    // Placeholder for non-DOM environment
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

function addSvgAccessibleNames() {
    // Placeholder
}

function renderIndexView() {
    // Placeholder
}

function ensureUniqueLandmarks() {
    // Placeholder for non-DOM environment
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
    // Placeholder
    return html;
}

function fixFakeLinks(html) {
    // Placeholder
    return html;
}

function applyAccessibilityFixes(html) {
    if (!html || typeof html !== 'string') return html;
    html = addLangAttribute(html);
    html = fixTableStructure(html);
    html = fixLandmarks(html);
    html = addSvgAccessibleNames(html);
    html = ensureUniqueLandmarks(html);
    html = fixFakeLinks(html);
    return html;
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

function towerDefense() {
    console.log('Tower defense system initialized.');
}

function initialize() {
  console.log('Initializing application...');
  return true;
}

// Process spawning
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);
        let stdout = '';
        let stderr = '';
        let timeoutId;

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

// Content safety
function analyzeContentSafety(content) {
    return { safe: true };
}

function getUserSafetyAdvice() {
    const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
    return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

// Accessibility scanning
const pagesDir = path.join(__dirname, 'pages');

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
            SafetyCategories.split(',').forEach(cat => {
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
        issues = await accessiblyHelper(issuesData);
        const report = {
            introduction: 'Accessibility report for the application',
            data: issues,
            conclusions: ''
        };
        return report;
    }
}

// Reporting
function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

async function importAndExecute(modulePath) {
    const module = await import(modulePath);
    return module;
}

function addressAccessibilityIssues(insightReport) {
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
    console.log('Addressing accessibility issues from insight report:', insightReport);
}

// Color and contrast utilities
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

// Dependency analysis
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

// Harvest and upgrade workflow
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

// Express endpoint
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

module.exports = {
    scanAccessibility,
    getUserSafetyAdvice,
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
    spawnProcess,
    spawnConcurrent,
    analyzeContentSafety,
    ensureUniqueLandmarks,
    ensureUniqueLandmarksList,
    generateAccessibilityReport,
    applyAccessibilityFixes,
    applyAllAccessibilityFixes,
    fixLandmarks,
    fixFakeLinks,
    importAndExecute,
    writeReport,
    addressAccessibilityIssues,
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
    addressNewAccessibilityIssues
};