// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { accessibilityUtils } = require('./accessibilityUtils');
const { a11yStore } = require('./a11yStore');
const { mathHelpers } = require('./mathHelpers');

const main = require('./utilities');

// Import necessary dependencies
import React from 'react';
import { render } from 'react-dom';
import {
  googleSignIn,
  decodeJwtResponse
} from './AccessibilityHelpers';

const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  exportUtils: mainExportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main;

const { ensureUniqueLandmarks, addLandmarkRegions, fixFakeLinkIssues, initializeAccessibility, addLangAttribute, fixTableStructure, addMainLandmark, fixLandmarkIssues, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue } = main;

const { renderDependencyGraph } = main;
const { renderAdditionalContent } = main;

const { createAnnouncer } = main;
const { prefersReducedMotion } = main;

// ... Existing Utility Functions from origin/main ...

// New exported functions
module.exports = {
  ...main.exports,
  getLangAttribute,
  createInPageButton,
  addLangAttribute,
  isLinkAccessible,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  renderIndexView,
  calculateSum,
  getSvgAccessibleName,
  createWebResourceButton,
  invalidTokenMessage,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility,
  validateAccessibilityReport,
  addressAccessibilityIssues,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderAdditionalContent,
  createAnnouncer,
  prefersReducedMotion,
  ensureUniqueLandmarks,
  addLandmarkRegions,
  fixFakeLinkIssues,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue
};

// Attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.affectedFunction = main.affectedFunction;
    window.updateFunction = main.updateFunction;
    window.accessibleFunction = main.accessibleFunction;
    window.main = main;
    window.accessibilityUtils = main.accessibilityUtils;
    window.ensureElementId = main.ensureElementId;
    window.addAriaLabel = main.addAriaLabel;
    window.renderDependencyGraph = renderDependencyGraph;
    window.renderIndexView = main.renderIndexView;
    window.getLangAttribute = main.getLangAttribute;
    window.renderGraphIndex = renderDependencyGraph;
    window.renderGraphIndexFromHead = main.renderGraphIndexFromHead;
    window.addLangAttribute = addLangAttribute;
    window.fixTableStructure = fixTableStructure;
    window.addMainLandmark = addMainLandmark;
    window.fixLandmarkIssues = fixLandmarkIssues;
    window.addLandmarkRegions = addLandmarkRegions;
    window.ensureUniqueLandmarks = ensureUniqueLandmarks;
    window.addSvgAccessibleNames = addSvgAccessibleNames;
    window.addAccessibleNamesToSVGs = addAccessibleNamesToSVGs;
    window.fixFakeLinkIssue = fixFakeLinkIssue;
    window.fixFakeLinkIssues = fixFakeLinkIssues;
    window.initializeAccessibility = initializeAccessibility;
    window.createAnnouncer = createAnnouncer;
    window.prefersReducedMotion = prefersReducedMotion;
    window.renderAdditionalContent = renderAdditionalContent;
}