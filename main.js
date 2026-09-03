const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');
const { listFiles } = require('./utils');

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  validateAccessibilityReport,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  setSvgAccessibilityProps,
  addAccessibleNamesToSVGs,
  addSvgAccessibleNames,
  addAriaLabel: addAriaLabelAlt,
  googleSignIn,
  handleCredentialResponseAlt,
  renderGraphIndexUtil,
  addressAccessibilityIssues
} = require('./utilities');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
  return element
}

const AddressabilityIssues = {
  validateTableAccessibility,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  addAriaLabel,
  addAriaLabelLegacy
};

function accessibility() {
  if (typeof document === 'undefined') return;

  handleInitialAccessibility();

  if (typeof checkLandmarkElements === 'function') {
    checkLandmarkElements();
  }

  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAccessibility();
}

function ensureInteractiveElementsAccessible() {
  accessibility();
}

function handleInitialAccessibility() {
  if (!document) return;
  addLanguageAttribute();
  addMainLandmarkToIndex();
}

function addLanguageAttribute() {
  if (typeof document !== 'undefined') {
    addLangAttribute(document.documentElement);
  }
}

function addMainLandmarkToIndex() {
  if (typeof document !== 'undefined') {
    const main = document.querySelector('main') || document.querySelector('#main') || document.querySelector('.main');
    if (main) {
      main.setAttribute('role', 'main');
    }
  }
}

addLanguageAttribute();

function main() {
  console.log("Main function executed");
  accessibility();
}

function utilityListFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      utilityListFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

module.exports = {
  greetingFunction,
  renderGraphIndex,
  renderGraphIndexAlt,
  accessibility,
  ensureInteractiveElementsAccessible,
  handleInitialAccessibility,
  addressAccessibilityIssues,
  validateSession,
  getActiveSessionsCount,
  revokeSession,
  a11yStore,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
  dependencyGraphContent,
  indexContent,
  main,
  addressabilityIssues: AddressabilityIssues,
  loadConfigurations,
  countDependencies,
  sanitizeFilename,
  processData,
  generateSessionId,
  prefersReducedMotion,
  prefersHighContrast,
  isLandmarkElement,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkRoles,
  validateLandmarkStructure,
  checkLandmarkAccessibility,
  checkLandmarkElements,
  checkAccessibilityOfLandmarks,
  ensureUniqueLandmarks,
  missingRoles,
  fixFakeLinkIssue,
  AddressabilityIssues,
  addAriaLabel,
  addAriaLabelLegacy,
  checkElementAccessibility,
  handleAccessibilityIssues,
  addLangAttribute,
  getLangAccessibleName,
  getLangAttribute,
  renderDependencyGraphs,
  addLanguageAttribute,
  addMainLandmarkToIndex,
  utilityListFiles,
  configureSvgAccessibility,
  makeSvgAccessible,
  setSvgAttributes
};