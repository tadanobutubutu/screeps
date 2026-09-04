let dependencyGraph = {};
const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const axe = require('axe-core');
const accessiblyHelper = async (...args) => {
  return args;
};

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

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
        categoryCounts[cat] = 0;
      });

      issues.forEach(issue => {
        const category = issue.categories ? issue.categories[0].type : '';
        if (categoryCounts[category]) {
          categoryCounts[category]++;
        }
      });

      if (Object.keys(categoryCounts).length > 0) {
        conclusionParts.push(
          `Detected ${categoryCounts['Unauthorized Advice']} instance(s) of Unauthorized Advice.`,
          `Detected ${categoryCounts['Dangerous Action']} instance(s) of Dangerous Action.`,
          `Detected ${categoryCounts['Potential Scam']} instance(s) of Potential Scam.`,
          `Detected ${categoryCounts['Privacy Risk']} instance(s) of Privacy Risk.`
        );
      } else {
        conclusionParts.push('No accessibility issues were found.');
      }

      report.conclusions = conclusionParts.join('\n');
    }

    return report;
  } else {
    issues = accessiblyHelper(issuesData);
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
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

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

function renderDependencyGraphContent() {
  const container = document.getElementById('dependency-graph-container');
  if (!container) {
    return;
  }
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

function ensureElementAccessibility(element) {
  if (typeof element === 'string') {
    const el = document.getElementById(element);
    if (el) {
      el.id = element;
      return true;
    }
  }
  if (element instanceof HTMLElement) {
    const id = element.id;
    if (!id) {
      const fallbackId = 'element-' + Math.random().toString(36).substr(2, 9);
      element.id = fallbackId;
      return true;
    }
  }
  return false;
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

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

function checkColorContrast(element) {
    if (!element || !(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    const bgRgb = parseColor(bgColor);
    const fgRgb = parseColor(color);

    if (!bgRgb || !fgRgb) return false;

    const bgLum = calculateLuminance(bgRgb);
    const fgLum = calculateLuminance(fgRgb);

    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    return contrastRatio >= 4.5;
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
        'createInPageButton',
        'checkColorContrast',
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
        'checkColorContrast': ['parseColor', 'calculateLuminance'],
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

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
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

module.exports = {
  accessiblyHelper,
  generateAccessibilityReport,
  getUserSafetyAdvice,
  checkSafetyCategories,
  visualizeDependencyTree,
  main,
  renderDependencyGraphContent,
  renderDependencyGraph,
  renderFunction1,
  renderFunction2,
  ensureElementAccessibility,
  towerDefense,
  getDependencyGraph,
  addressAccessibilityIssues,
  createInPageButton,
  checkColorContrast,
  parseColor,
  calculateLuminance,
  countDependencies,
  countModuleDependencies,
  getLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes
};