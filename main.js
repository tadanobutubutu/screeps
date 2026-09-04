const fs = require('fs');
const path = require('path');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const { spawn } = require('child_process');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

const { greet, add, getDependencies, addDependency, removeDependency, appData, someFunction, validateInput, processData, formatResponse } = require('./mainAdapted');
const { validateTableAccessibility, validateTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure, initialize: initializeAdapted } = require('./mainAccessibility');
const { calculateSum, UserSafety, getSafetyCategory, getSafetyCategoryDetailed, getUserSafetyInfo, isUserSafetyUnsafe, hasSafetyCategory, loadUserSafetyInfo } = require('./userSafety');

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = {};
const accessiblyHelper = async (...args) => {
  return args;
};

let SafetyCategories = "Unauthorized Advice,Dangerous Action,Potential Scam,Privacy Risk";

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

function generateAccessibilityReport(issuesData) {
  let issues;
  let report;

  if (!issuesData) {
    issues = axe.analyze('./index.html');
    report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: '',
    };

    if (issues && Array.isArray(issues)) {
      const conclusionParts = [];
      const categoryCounts = {};
      SafetyCategories.split(',').forEach(cat => {
        categoryCounts[cat.trim()] = 0;
      });

      issues.forEach(issue => {
        const category = issue.categories ? issue.categories[0].type : '';
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

      report.conclusions = conclusionParts.join('\n');
    }

    return report;
  } else {
    issues = await accessiblyHelper(issuesData);
    report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: ''
    };
    return report;
  }
}

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (SafetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

function visualizeDependencyTree(dependencies) {
  const report = countDependencies(dependencies);
  console.log(report.functionCallGraph);
}

const mainObj = {
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
    console.log('Book added:', { title, author, isbn });
    return { title, author, isbn };
  }
};

function renderDependencyGraphContent() {
  console.log('Rendering dependency graph content');
}

function renderDependencyGraph(dependencyGraph) {
  console.log('Rendering dependency graph:', dependencyGraph);
}

async function renderFunction1() {
  const moduleAReturnValue = await accessiblyHelper();
  return { moduleAReturnValue };
}

async function renderFunction2() {
  const moduleBReturnValue = await accessiblyHelper();
  return { moduleBReturnValue };
}

function fixAccessibilityIssues() {
  // Add your code here to fix the accessibility issues as per the insight report
}

function addressAccessibilityIssues(insightReport) {
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

function towerDefense() {
    console.log('Tower defense system initialized.');
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

function fixTableStructure() {
  // Implementation would process and display the table structure
  console.log('Fixing table structure');
}

function fixLandmarks() {
  // Implementation would fix landmark issues
  console.log('Fixing landmarks');
}

function addSvgAccessibleNames() {
  // Implementation would add accessible names to SVG elements
  console.log('Adding SVG accessible names');
}

function ensureUniqueLandmarks() {
  // Implementation to be added
}

function fixFakeLinks() {
  // Implementation would fix fake link issues
  console.log('Fixing fake links');
}

function applyAccessibilityFixes(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }

  html = addLangAttribute(html);
  html = fixTableStructure(html);
  html = fixLandmarks(html);
  html = addSvgAccessibleNames(html);
  html = ensureUniqueLandmarks(html);
  html = fixFakeLinks(html);

  return html;
}

function addLangAttribute(html) {
  if (!html.includes('<html') || html.includes('lang=')) {
    return html;
  }
  return html.replace('<html', '<html lang="en"');
}

module.exports = {
  accessiblyHelper,
  generateAccessibilityReport,
  getUserSafetyAdvice,
  checkSafetyCategories,
  visualizeDependencyTree,
  main: mainObj,
  renderDependencyGraphContent,
  renderDependencyGraph,
  renderFunction1,
  renderFunction2,
  towerDefense,
  getDependencyGraph,
  addressAccessibilityIssues,
  parseColor,
  calculateLuminance,
  countDependencies,
  countModuleDependencies,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  addLangAttribute,
  config,
  appState,
  isInitialized
};