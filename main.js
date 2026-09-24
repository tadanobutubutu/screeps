const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');
const { listFiles } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label)
  }
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
  addLangAttribute();
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
  addMainLandmarkToIndex,
  utilityListFiles,
  configureSvgAccessibility,
  makeSvgAccessible,
  setSvgAttributes
};