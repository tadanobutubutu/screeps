// Main.js - Screeps Bot with Web Interface

// Module imports and configuration
const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const fastMap = require('fast-map');
const axeCore = require('axe-core');
const axios = require('axios');
const cheerio = require('cheerio');
const { registerSW } = require('effector-sw');
const { isSecureContext } = require('./utils.js');
const { calculateSum } = require('./utils');
const { getLangAttribute, getFullLangAttribute } = require('./utils/accessibilityUtils');
const { validateTableAccessibility, validateTableStructure } = require('./utils/tableAccessibilityUtils');
const { validateLandmark, validateLandmarkStructure } = require('./utils/landmarkAccessibilityUtils');
const { validateLandmarkStructure: validateLandmarkStructureAlt } = require('./utils/landmarkAccessibilityUtils.js');
const { validateLinkAccessibility, handleFakeLinks } = require('./utils/linkAccessibilityUtils');
const { addProperLandmarkRegions } = require('./utils/landmarkUtils');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');
const { CONFIG: CONFIG_CONST } = require('./utils/constants');
const { a11y } = require('@accessible/react');
const { validateLandmarkStructure: validateLandmarkStructureAlt } = require('./utils/landmarkAccessibilityUtils.js');
const { validateLinkAccessibility: validateLinkAccessibilityAlt } = require('./utils/linkAccessibilityUtils.js');

// React and Redux imports (converted from ES6 imports to CommonJS for consistency)
const React = require('react');
const { useState, useEffect } = React;
const { List, Button } = require('antd');
const { useSelector, useDispatch } = require('react-redux');
const { setDependencyGraph } = require('./actions/dependencyGraph');
const { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } = require('./bookFunctions');
const { initializeApp } = require('./app.js');
const App = require('./App').default;
const { helper, formatDate } = require('./utils');
const { someFunction } = require('./utils/someFunction');
const { fetchUser, clearCache } = require('./utils/user');
const utils = require('./utils');
const { importAccessibilityUtils } = require('./AccessibilityUtilities');
const { importUtils } = require('./Utils');
const { importBaseFunctions } = require('./baseFunctions');

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0',
    userAction: "Unknown",
    previousUserActions: [],
    lastUserActionId: "Unknown",
    userActionStack: [],
};

// Configuration - merged from both branches
const CONFIG = {
  port: 3000,
  maxResults: 1000,
  debug: false,
};

const appData = {
  userAction: "Unknown",
  previousUserActions: [],
  lastUserActionId: "Unknown",
  userActionStack: [],
};

const appState = {
  lastUserAction: "Unknown",
  previousUserActions: [],
  lastUserActionId: "Unknown",
  userActionStack: [],
  previousUserSafety: 'safe',
  previousUserSafetyScore: 0,
};

// Safety Categories and User Safety Functions
const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
let userSafety = 'safe';

function getUserSafetyAdvice() {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function computeSafetyScore(safetyCategories) {
  const safetyCategory = safetyCategories.reduce((score, category) => {
    switch (category) {
      case 'Unauthorized Advice':
        return score + 1;
      case 'Dangerous Action':
        return score + 2;
      case 'Potential Scam':
        return score + 3;
      case 'Privacy Risk':
        return score + 4;
      default:
        return score;
    }
  }, 0);
  return safetyCategory;
}

const books = [];
const safetyCategory = "User Safety: safe";

// Book-related functions
function addBook(title, author) {
  const bookObject = {
    title,
    author,
  };
  books.push(bookObject);
  // console.log(JSON.stringify(bookObject));
  return bookObject;
}

function announceBookAdded(book) {
  console.log(
    `New book added: ${book.title} by ${book.author}.`,
  );
}

// Harvest data function placeholder
function harvestData(context) {
  const dataToReturn = {
    'harvestCount': 1,
    'harvestList': [],
  };
  const contextType = typeof context;
  if (contextType === 'object' && context !== null) {
    for (const key in context) {
      // console.log(key);
    }
  }
  return dataToReturn;
}

// React and Redux integration
const main = () => {
  const harvestedData = loadHarvestedData();
  if (harvestedData) {
    upgradeSystem(harvestedData);
    applySystemUpgrades(harvestedData);
  }

  app.listen(CONFIG.port, () => {
    console.log(`App listening at http://localhost:${CONFIG.port}`);
  });
};

// Export functions for use in other modules
module.exports = {
  getLangAttribute,
  addLangAttribute,
  addLangAttributeHtml,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  ensureLandmarkUniqueness,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  processAccessibilityIssues,
  initialize: initializeAppLocal,
  initializeApp,
  processData: processDataLocal,
  fetchUser,
  clearCache,
  validateInput: validateInputLocal,
  main,
  wrapPrimaryContentInMain,
  handleUserInteraction: mainObj.on,
  cleanup: () => {},
  initApp: initializeAppLocal,
  VisualizeDependencyTree: visualizeModuleRelationships,
  checkLandmarkElement,
  renderDependencyGraphContent,
  landmarks,
  appData,
  icons: [],
  countDependencies: (deps) => Object.keys(deps || {}).length,
  addBook,
  BookItem,
  defaultSorting: sortByTitle,
  onTitleSort: sortByTitle,
  onAuthorSort: sortByAuthor,
  Main: App,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  addLandmarkRolesToElements,
  fixFakeLinks,
  fixFakeLinkIssue,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  addSvgAccessibleNames,
  addSvgAccessibleNamesDom,
  ensureUniqueLandmarksDoc,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  googleSignIn,
  googleSignInObj,
  enhanceAccessibilityForAddBook,
  ensureUniqueLandmarksFromArray: ensureUniqueLandmarks,
  getUserSafetyAdvice,
  computeSafetyScore,
  harvestData,
  upgrade,
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
  someNewFunction,
  getUserSafety,
  getSafetyCategories,
  calculateDiscount,
  newFunction,
  newFunction2,
  existingFunction1,
  existingFunction2,
  analyzeContentSafety,
  addressAccessibilityIssues,
  applyAccessibilityFixes,
  applyAllAccessibilityFixes,
  generateAccessibilityReport: generateAccessibilityReportAsync,
  scanAccessibility,
  writeReportLog,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility,
  validateLandmarkAttributesHtml,
  ensureDependencyGraphAriaRoleAlt,
  replaceButtonIds,
  rotateBack,
  createUnrotateButton,
  replaceFakeLinksWithButtons,
  ensureLangAttribute,
  fixLandmarksDom,
  addSvgAccessibleNamesDom,
  fixFakeLinksDom,
  loadHarvestedData,
  performUpgrade,
  applySystemUpgrades,
  upgradeSystem,
  fixTableStructureHtml,
  fixLandmarksHtml,
  ensureLangAttributeHtml,
  wrapPrimaryContentInMainConfig,
  validateTableAccessibilityFull,
  validateTableStructureFull,
  validateLandmarkFull,
  validateLandmarkStructureFull,
  ensureUniqueLandmarksFull,
  addFixLandmarkIssues,
  getSvgAccessibleNameLocal,
  addAriaToFormControls,
  initializeAppLocal,
  getLocalConfig,
  processDataLocal,
  createInPageButtonMerged,
  fixFakeLinkIssues,
  handleAccessibilityIssues,
  books,
  safetyCategory,
  safetyCategories,
  userSafety,
  mainObj,
  app,
  CONFIG,
  appState,
  handleCredentialResponse,
  getScreepsLangAttribute,
  getLangAttribute: function() { return document.documentElement.lang || navigator.language || 'en'; },
};

// Added foreign function for bot logic with Screeps integration
function someNewFunction() {
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024;
  if (Memory.bytesUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
}

// Screeps game API integration
function getScreepsLangAttribute() {
  return GAME.lang || 'en';
}

// Import the new function with es module syntax
import { GAME, Memory } from 'screeps';
export { someNewFunction };

// Gets the lang attribute for the HTML element (browser version from HEAD)
export function getLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en';
}

// Adds lang attribute to HTML element (browser version from HEAD)
export function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = navigator.language || 'en';
  }
}

// Added foreign function with Screeps integration
export function getLangAttribute() {
  return GAME.lang || 'en';
}

// GETTING THE LANGUAGE ATTRIBUTE FROM HEAD BRANCH
// These were simpler implementations that can be kept or replaced based on preference
// For maximum compatibility and clarity, we keep the HEAD version for addLangAttribute
// and use origin/main for all others which are more robust

// ADDING NEW FUNCTIONS THAT ARE SPECIFIC TO ORIGIN/MAIN
function newFunction() {
  return 'Hello World';
}

function newFunction2() {
  return 'Goodbye World';
}

function calculateDiscount(price, discountPercentage) {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return discountedPrice;
}

// ADDING SVG ACCESSIBLE NAMES WITH BETTER LOGIC
function addSvgAccessibleNames(dom) {
  const svgs = dom.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const role = svg.getAttribute('role');
    if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (svg.getAttribute('role') === 'none') {
      // Do nothing
    } else {
      svg.setAttribute('aria-label', 'Image with no description.');
    }
  });
}

function fixFakeLinks(dom) {
  const anchorTagsWithClickEvents = dom.querySelectorAll('a[onclick]');
  anchorTagsWithClickEvents.forEach((tag) => {
    const onClickAttributeValue = tag.getAttribute('onclick');
    const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
    const hrefValue = matchResult && matchResult[1];
    tag.setAttribute('href', hrefValue);
    tag.setAttribute('onclick', '');
  });
  return dom;
}

// ADDING TABLE STRUCTURE VALIDATION
function validateTableAccessibilityFull(table) {
  const issues = [];
  if (!table || table.tagName !== 'TABLE') return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeader = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  let isValid = hasCaption && hasHeader && rows.length > 0;
  return isValid;
}

function validateTableStructureFull(tables) {
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables];
  tableArray.forEach((table, index) => {
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }
    const result = validateTableAccessibilityFull(table);
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

// ADDING LANDMARK VALIDATION
function validateLandmarkFull(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }
  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructureFull(landmarks) {
  const issues = [];
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkFull(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    if (typeof document !== 'undefined') {
      const allLandmarks = document.querySelectorAll('[role]');
      let hasMain = false;
      let hasNavigation = false;
      allLandmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
      });
      if (!hasMain) {
        issues.push('Missing main landmark');
      }
      if (!hasNavigation) {
        issues.push('Missing navigation landmark');
      }
    }
  }
  return {
    success: issues.length === 0,
    issues
  };
}

function ensureUniqueLandmarksFull(landmarks) {
  const names = [];
  const duplicates = [];
  let elementsToCheck = landmarks;
  if (!Array.isArray(landmarks)) {
    if (typeof document !== 'undefined') {
      elementsToCheck = document.querySelectorAll('[role]');
    } else {
      elementsToCheck = [];
    }
  }
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });
  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });
  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });
  return {
    success: duplicates.length === 0,
    duplicates
  };
}

// ADDING MAIN LANDMARK FUNCTION
function addMainLandmark() {
  wrapPrimaryContentInMain();
}

// ADDING SVG ACCESSIBLE NAME EXPORT
function getSvgAccessibleName(svg) {
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

function setSvgAttributes(svg) {
  if (svg.tagName !== 'SVG') return;
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
    const titleElement = document.createElement('title');
    titleElement.textContent = svg.getAttribute('aria-label') || 'SVG graphic';
    svg.insertBefore(titleElement, svg.firstChild);
  }
}

// ADDING UNIQUE LANDMARKS ENSURER
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
    return [];
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ADDING IN-PAGE BUTTON CREATOR
function createInPageButton(options) {
  const button = document.createElement('button');
  button.textContent = options.text;
  button.onclick = options.onClick;
  button.setAttribute('aria-label', options.ariaLabel || options.text);
  return button;
}

// ADDING FIX FAKE LINKS FUNCTION
function fixFakeLinkIssues(link) {
  if (!link.href && link.text) {
    link.isFake = true;
    link.href = '#';
  }
  return link;
}

// ADDING HANDLE ACCESSIBILITY ISSUES
function handleAccessibilityIssues(issues = []) {
  const handled = [];
  const unhandled = [];
  issues.forEach(issue => {
    if (issue.fixable) {
      handled.push(issue);
    } else {
      unhandled.push(issue);
    }
  });
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Additional handling for table issues
    });
  }
  return {
    handled,
    unhandled
  };
}

// MAIN ENTRY POINT
const main = () => {
  const harvestedData = loadHarvestedData();
  if (harvestedData) {
    upgradeSystem(harvestedData);
    applySystemUpgrades(harvestedData);
  }

  app.listen(CONFIG.port, () => {
    console.log(`App listening at http://localhost:${CONFIG.port}`);
  });
};

// EXPORTS
module.exports = {
  getLangAttribute,
  addLangAttribute,
  addLangAttributeHtml,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  ensureLandmarkUniqueness,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  processAccessibilityIssues,
  initialize: initializeAppLocal,
  initializeApp,
  processData: processDataLocal,
  fetchUser,
  clearCache,
  validateInput: validateInputLocal,
  main,
  wrapPrimaryContentInMain,
  handleUserInteraction: mainObj.on,
  cleanup: () => {},
  initApp: initializeAppLocal,
  VisualizeDependencyTree: visualizeModuleRelationships,
  checkLandmarkElement,
  renderDependencyGraphContent,
  landmarks,
  appData,
  icons: [],
  countDependencies: (deps) => Object.keys(deps || {}).length,
  addBook,
  BookItem,
  defaultSorting: sortByTitle,
  onTitleSort: sortByTitle,
  onAuthorSort: sortByAuthor,
  Main: App,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  addLandmarkRolesToElements,
  fixFakeLinks,
  fixFakeLinkIssue,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  addSvgAccessibleNames,
  addSvgAccessibleNamesDom,
  ensureUniqueLandmarksDoc,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  googleSignIn,
  googleSignInObj,
  enhanceAccessibilityForAddBook,
  ensureUniqueLandmarksFromArray: ensureUniqueLandmarks,
  getUserSafetyAdvice,
  computeSafetyScore,
  harvestData,
  upgrade,
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
  someNewFunction,
  getUserSafety,
  getSafetyCategories,
  calculateDiscount,
  newFunction,
  newFunction2,
  existingFunction1,
  existingFunction2,
  analyzeContentSafety,
  addressAccessibilityIssues,
  applyAccessibilityFixes,
  applyAllAccessibilityFixes,
  generateAccessibilityReport: generateAccessibilityReportAsync,
  scanAccessibility,
  writeReportLog,
  addKeyboardNavigation,
  addAriaLabels,
  addScreenReaderAnnouncements,
  addFocusTrap,
  improveAccessibility,
  validateLandmarkAttributesHtml,
  ensureDependencyGraphAriaRoleAlt,
  replaceButtonIds,
  rotateBack,
  createUnrotateButton,
  replaceFakeLinksWithButtons,
  ensureLangAttribute,
  fixLandmarksDom,
  addSvgAccessibleNamesDom,
  fixFakeLinksDom,
  loadHarvestedData,
  performUpgrade,
  applySystemUpgrades,
  upgradeSystem,
  fixTableStructureHtml,
  fixLandmarksHtml,
  ensureLangAttributeHtml,
  wrapPrimaryContentInMainConfig,
  validateTableAccessibilityFull,
  validateTableStructureFull,
  validateLandmarkFull,
  validateLandmarkStructureFull,
  ensureUniqueLandmarksFull,
  addFixLandmarkIssues,
  getSvgAccessibleNameLocal,
  addAriaToFormControls,
  initializeAppLocal,
  getLocalConfig,
  processDataLocal,
  createInPageButtonMerged,
  fixFakeLinkIssues,
  handleAccessibilityIssues,
  books,
  safetyCategory,
  safetyCategories,
  userSafety,
  mainObj,
  app,
  CONFIG,
  appState,
  handleCredentialResponse,
  getScreepsLangAttribute,
  getLangAttribute: function() { return document.documentElement.lang || navigator.language || 'en'; },
};

// Screeps game API integration
function getScreepsLangAttribute() {
  return GAME.lang || 'en';
}

// Import the new function with es module syntax
import { GAME, Memory } from 'screeps';
export { someNewFunction };

// GETTING THE LANGUAGE ATTRIBUTE FROM HEAD BRANCH
// These were simpler implementations that can be kept or replaced based on preference
// For maximum compatibility and clarity, we keep the HEAD version for addLangAttribute
// and use origin/main for all others which are more robust

// ADDING NEW FUNCTIONS THAT ARE SPECIFIC TO ORIGIN/MAIN
function newFunction() {
  return 'Hello World';
}

function newFunction2() {
  return 'Goodbye World';
}

function calculateDiscount(price, discountPercentage) {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return discountedPrice;
}

// ADDING SVG ACCESSIBLE NAMES WITH BETTER LOGIC
function addSvgAccessibleNames(dom) {
  const svgs = dom.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const role = svg.getAttribute('role');
    if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (svg.getAttribute('role') === 'none') {
      // Do nothing
    } else {
      svg.setAttribute('aria-label', 'Image with no description.');
    }
  });
}

function fixFakeLinks(dom) {
  const anchorTagsWithClickEvents = dom.querySelectorAll('a[onclick]');
  anchorTagsWithClickEvents.forEach((tag) => {
    const onClickAttributeValue = tag.getAttribute('onclick');
    const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
    const hrefValue = matchResult && matchResult[1];
    tag.setAttribute('href', hrefValue);
    tag.setAttribute('onclick', '');
  });
  return dom;
}

// ADDING TABLE STRUCTURE VALIDATION
function validateTableAccessibilityFull(table) {
  const issues = [];
  if (!table || table.tagName !== 'TABLE') return false;
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeader = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  let isValid = hasCaption && hasHeader && rows.length > 0;
  return isValid;
}

function validateTableStructureFull(tables) {
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables];
  tableArray.forEach((table, index) => {
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }
    const result = validateTableAccessibilityFull(table);
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

// ADDING LANDMARK VALIDATION
function validateLandmarkFull(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }
  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructureFull(landmarks) {
  const issues = [];
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkFull(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    if (typeof document !== 'undefined') {