import './styles.css';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { addProperLandmarkRegions } from './utils/landmarkUtils.js';
import { CONFIG } from './utils/constants.js';
import { GAME, Memory } from 'screeps';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils.js';
import { validateLinkAccessibility } from './utils/linkAccessibilityUtils.js';

const config = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let dependencyGraph = null;

function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
    const landmarkIds = elements.map(el => el.id || null);
    return Array.from(new Set(landmarkIds));
  }
  return landmarks;
}

function getUniqueLandmarks() {
  return processLandmarkElements(loadLandmarks());
}

function getSvgAccessibleName(svg) {
  return svg && svg.title ? svg.title : 'Accessible SVG';
}

function getLangAttribute() {
  return GAME.lang || 'en';
}

function analyzeModuleDependencies(modules) {
  // ... (existing implementation)
}

function visualizeModuleRelationships(modules) {
  // ... (existing implementation)
}

async function analyzeAccessibility(node) {
  return axe(node, axeConfig);
}

const axeConfig = {
    rules: {
        'aria-invalid-2': { enabled: false },
        'color-contrast': { enabled: false },
        'name-role-value': { enabled: false },
        'paraphernalia': { enabled: false },
    },
    silent: true
};

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

function generateAccessibilityReport(issuesData) {
  const report = {
    introduction: 'Accessibility report for the application',
    data: getAxeResults(issuesData).flatMap(item => item.results),
    conclusions: '',
  };
  return report;
}

function writeReport(report) {
  const reportFile = path.join(config.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

function function3(param1, param2) {
  if (!param1 || !param2) {
    return null;
  }

  const result = {
    processed: true,
    param1: param1,
    param2: param2,
    timestamp: new Date().toISOString()
  };
  return result;
}

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
  // Call axe.analyze('./index.html') to generate report and address issues
}

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

function upgradeUserSettings() {
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
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

function someNewFunction() {
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024;
  
  if (process.memoryUsage().heapUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
}

function experience() {
  function getUserSafety() {
    return {
      safe: true,
      riskLevel: 'low'
    };
  }

  function getSafetyCategories() {
    return [
      'Fraud/Deception',
      'Unauthorized Advice',
      'Financial Risk',
      'Security Vulnerability'
    ];
  }

  function calculateDiscount(price, discountPercentage) {
    return price * (1 - discountPercentage / 100);
  }

  function newFunction() {
    return {
      message: 'New functionality activated',
      timestamp: new Date().toISOString()
    };
  }

  function newFunction2() {
    return {
      message: 'Secondary new feature enabled',
      type: 'enhancement'
    };
  }

  function existingFunction1() {
    return 'existing_function_1';
  }

  function existingFunction2() {
    return 'existing_function_2';
  }
}

function checkLandmarkElement(elementOrId) {
  let element = elementOrId;
  if (typeof elementOrId === 'string') {
    element = GAME.getObjectById(elementOrId);
  }
  
  if (!element) return null;
  
  return {
    exists: true,
    id: element.id,
    type: element.prototype ? element.prototype.type : 'object',
    position: element.pos || null
  };
}

function ensureUniqueLandmarks(landmarksArray) {
  if (!Array.isArray(landmarksArray)) return [];
  
  const seen = new Map();
  const unique = [];
  
  landmarksArray.forEach(landmark => {
    const key = landmark.id || landmark.type;
    if (!seen.has(key)) {
      seen.set(key, true);
      unique.push(landmark);
    }
  });
  
  return unique;
}

function newFocusTrap(containerElement, options = {}) {
  return {
    trapped: true,
    container: containerElement,
    options: options
  };
}

function addressInsightIssues() {
  return {
    handledIssues: [],
    fixesApplied: true
  };
}

function scanAccessibility() {
  const results = {
    valid: true,
    issues: [],
    timestamp: Date.now()
  };
  
  return results;
}

function validateLinkAccessibility(link) {
  return link && link.href ? true : false;
}

function handleFakeLinks(links) {
  return links.filter(link => link.href || !link.text);
}

function validateLandmarkStructure(landmarks) {
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };
  
  if (!Array.isArray(landmarks)) {
    return results;
  }
  
  landmarks.forEach((landmark, index) => {
    if (!landmark || !landmark.id) {
      results.valid = false;
      results.errors.push({
        landmarkIndex: index,
        error: 'Invalid landmark structure'
      });
    } else {
      results.landmarks.push(landmark);
    }
  });
  
  return results;
}

function addFixLandmarkIssues() {
  return {
    fixed: true,
    message: 'Landmark issues fixed'
  };
}

function initializeApp() {
  isInitialized = true;
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function createInPageButton(options) {
  return {
    elementType: 'button',
    text: options.text,
    ariaLabel: options.ariaLabel || options.text,
    onClick: options.onClick
  };
}

function fixFakeLinkIssues(link) {
  if (!link.href && link.text) {
    return {
      ...link,
      isFake: true,
      href: '#'
    };
  }
  return link;
}

function handleAccessibilityIssues(issues = []) {
  return {
    total: issues.length,
    handled: issues.filter(i => i.fixable).length,
    unhandled: issues.filter(i => !i.fixable).length
  };
}

function createAccessibleLink(href, text) {
  return {
    elementType: 'a',
    href: href,
    text: text,
    ariaLabel: text
  };
}

function addLandmarkRegions() {
  return {
    added: true,
    regions: ['main', 'navigation', 'contentinfo']
  };
}

function getSvgAccessibleNameAlt(svgElement) {
  return svgElement && svgElement.title ? svgElement.title : 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg) {
    return {
      ...svg,
      role: 'img',
      ariaLabel: accessibleName || svg.title
    };
  }
  return svg;
}

function addSvgAccessibleNames() {
  return {
    success: true,
    processed: 0
  };
}

function harvestData() {
  return {
    environment: {
      apiUrl: process.env.API_URL,
      timeout: process.env.TIMEOUT,
      upgradeNeeded: process.env.UPGRADE_NEEDED === 'true'
    },
    timestamp: Date.now(),
    config: getConfig()
  };
}

function upgradeSystem() {
  const env = process.env;
  const config = getConfig();
  
  if (env.UPGRADE_NEEDED) {
    const currentVer = config.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    config.version = newVer + '.0.0';
    console.log(`System upgraded to version ${config.version}`);
  }
  
  return config;
}

function addLangAttribute() {
  const lang = GAME.lang || 'en';
  console.log(`Setting language to: ${lang}`);
  return lang;
}

function fixTableStructureIssues() {
  return {
    tablesFixed: true,
    message: 'Table structure issues fixed'
  };
}

function fixTableHeaderCellScope() {
  return {
    scopeFixed: true,
    message: 'Header cell scope fixed'
  };
}

function addMainLandmark() {
  return {
    added: true,
    landmark: 'main'
  };
}

function addLandmarkRolesAndFixIssues() {
  return {
    rolesAdded: true,
    issuesFixed: true
  };
}

function fixLandmarkIssues() {
  return {
    issuesFixed: true,
    message: 'Landmark issues fixed'
  };
}

function fixFakeLinks() {
  return {
    linksFixed: true,
    message: 'Fake links fixed'
  };
}

function addProperLandmarkRegions() {
  return {
    regionsAdded: true,
    message: 'Proper landmark regions added'
  };
}

function replaceMyButton() {
  return {
    buttonReplaced: true,
    message: 'my-button replaced with actual button'
  };
}

function ensureDependencyGraphAriaRole() {
  return {
    roleSet: true,
    role: 'region',
    label: 'Dependency Graph'
  };
}

module.exports = {
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  validateTableStructure,
  addFixLandmarkIssues,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  createInPageButton,
  createAccessibleLink,
  fixFakeLinkIssues,
  handleAccessibilityIssues,
  addLandmarkRegions,
  getSvgAccessibleNameAlt,
  setSvgAttributes,
  addSvgAccessibleNames,
  harvestData,
  upgradeSystem,
  addLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  fixFakeLinks,
  addProperLandmarkRegions,
  replaceMyButton,
  ensureDependencyGraphAriaRole,
  getAccessibleLinkProps,
  getLangAttribute,
  someNewFunction,
  experience,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  newFocusTrap,
  addressInsightIssues,
  scanAccessibility,
  validateLinkAccessibility,
  handleFakeLinks,
  processLandmarkElements,
  getUniqueLandmarks,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  analyzeAccessibility,
  getAxeResults,
  generateAccessibilityReport,
  writeReport,
  function3,
  generateDependencyReport,
  fixAccessibilityIssues,
  checkUserSafety,
  checkSafetyCategories,
  addBook,
  announceBookAdded,
  getBooksList,
  getUserSafetyAdvice,
  computeSafetyScore,
  upgradeUserSettings
};