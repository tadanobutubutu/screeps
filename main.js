/**
 * Main entry point for the Frontend application.
 *
 * This file sets up the application, loads the DOM elements, and initializes
 * various modules that handle different aspects of the application. It also
 * contains fixes for various accessibility issues as per the Insight report.
 *
 * The following accessibility issues are addressed:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_017: Add landmark roles and fix landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks (2 issues)
 * - REACT_036: Fix 1 fake link issue
 * - REACT_025: Add scope="col" or scope="row" to <th> elements (already implemented)
 *
 * Also included are exported functions for testing.
 *
 * @module main
 */

import React, { useState } from 'react';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';
import { validateLandmark } from './accessibility/validateLandmark.js';
import { ensureUniqueLandmarks } from './accessibility/ensureUniqueLandmarks.js';
import { helloWorld } from './utils/helloWorld.js';
import { initDependencyGraph, renderDependencyGraph } from './visualization/dependencyGraph.js';
import { getElementById, queryElements } from './utils/domUtils.js';
import { checkLandmarkElement } from './accessibility/checkLandmarkElement.js';
import { checkLandmarkElements } from './accessibility/checkLandmarkElements.js';
import { validateLandmarkStructure } from './accessibility/validateLandmarkStructure.js';
import { initApp } from './app.js';
import { icons } from './icons.js';
import { isSecureContext } from './utils/isSecureContext.js';
import { setLanguageAttribute } from './accessibility/setLanguageAttribute.js';
import { addLandmarkRoles } from './accessibility/addLandmarkRoles.js';
import { ensureUniqueLandmarkElements } from './accessibility/ensureUniqueLandmarkElements.js';
import { addSVGAccessibleName } from './accessibility/addSVGAccessibleName.js';
import { fixFakeLinks } from './accessibility/fixFakeLinks.js';
import { landmarks } from './accessibility/landmarks.js';
import { functionA, functionB } from './api/functionA.js';
import { processLandmarks } from './accessibility/processLandmarks.js';
import { getLangAttribute } from './accessibility/getLangAttribute.js';
import { personName } from './accessibility/personName.js';
import { validateTableAccessibility } from './accessibility/validateTableAccessibility.js';
import { validateTableStructure } from './accessibility/validateTableStructure.js';
import { getSvgAccessibleName } from './accessibility/getSvgAccessibleName.js';
import { createInPageButton } from './accessibility/createInPageButton.js';
import { ensureLandmarkUniqueness } from './accessibility/ensureLandmarkUniqueness.js';

// ... (existing code)

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - Object containing module dependencies
 * @param {Object} options - Configuration options for rendering
 * @returns {string} String representation of the dependency graph
 */
export const renderDependencyGraph = (dependencies = {}, options = {}) => {
  // ... (existing code)
};

/**
 * Displays module structure for debugging purposes
 * @param {Object} structure - Object containing module structure
 * @param {Object} options - Configuration options for display
 * @returns {string} String representation of the module structure
 */
export const displayModuleStructure = (structure, options = {}) => {
  // ... (existing code)
};

export {
  initializeApp,
  appData,
  registerSW,
  appStarted,
  validateLandmark,
  ensureUniqueLandmarks,
  helloWorld,
  initDependencyGraph,
  renderDependencyGraph,
  getElementById,
  queryElements,
  checkLandmarkElement,
  checkLandmarkElements,
  validateLandmarkStructure,
  initApp,
  icons,
  isSecureContext,
  setLanguageAttribute,
  addLandmarkRoles,
  ensureUniqueLandmarkElements,
  addSVGAccessibleName,
  fixFakeLinks,
  landmarks,
  functionA,
  functionB,
  processLandmarks,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  createInPageButton,
  ensureLandmarkUniqueness
};