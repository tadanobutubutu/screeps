import React from 'react';
import { render } from 'react-dom';
import {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap
} from './AccessibilityHelpers';

const main = require('./utilities');
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { accessibilityUtils } = require('./accessibilityUtils');

const ScreepsBot = require('./ScreepsBot').default;
const updateUI = require('./updateUI').default;

const setElementLabel = main.setElementLabel;
const { validateTableStructureForAccessibility } = main;

function addTaskWithPriority(taskFn, priority = 'medium') {
  this.tasks.push({ task: taskFn, priority });
  this.scheduleTasks();
}

function setFocus(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
    element.setAttribute('tabindex', '0');
  }
}

function addAccessibleName(svgString) {
  const svg = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

function validateTableAccessibility(tableData) {
  return true;
}

function validateTableStructure(container) {
  return validateTableStructureForAccessibility(container);
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName(person) {
  return person && person.name || 'Unknown';
}

function validateLandmark(landmark) {
  return !!landmark;
}

function validateLandmarkStructure(landmark) {
  return !!landmark;
}

function getSvgAccessibleName(svg) {
  return svg && (svg.getAttribute('aria-label') || svg.getAttribute('title')) || '';
}

function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function newFocusTrap(element) {
  if (!element) return;
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
}

function validateHeadingHierarchy(headings) {
  return true;
}

function ensureHeadingHierarchy(container) {
  if (!container) return null;

  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;

  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.substring(1), 10);
    if (previousLevel > 0 && currentLevel - previousLevel > 1) {
      const correctedLevel = previousLevel + 1;
      const newHeading = document.createElement(`h${correctedLevel}`);
      newHeading.innerHTML = heading.innerHTML;
      newHeading.className = heading.className;
      heading.parentNode.replaceChild(newHeading, heading);
      previousLevel = correctedLevel;
    } else {
      previousLevel = currentLevel;
    }
  });

  return container;
}

function renderAdditionalContent(additionalData) {
  return `<div>${JSON.stringify(additionalData)}</div>`;
}

function calculateComplexity(moduleData) {
  return moduleData.dependencies ? moduleData.dependencies.length : 0;
}

function renderDependencyGraph(deps, options = {}) {
  const graphContent = dependencyGraphContent(deps, options);
  return `<div class="dependency-graph-container" role="img" aria-label="Dependency graph visualization">${graphContent}</div>`;
}

function renderIndex(data, options = {}) {
  return indexContent(data, options);
}

const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }
}

module.exports = {
  ...main,
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  addTaskWithPriority,
  setElementLabel,
  setFocus,
  addAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  getLangAttribute,
  personName,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent,
  calculateComplexity,
  renderDependencyGraph,
  renderIndex,
  ScreepsBot,
  updateUI,
  accessibilityUtils
};

addLangAttribute();
fixTableStructure();
fixLandmarkIssues();
addMainLandmark();
ensureUniqueLandmarks();
addSvgAccessibleNames();
addAccessibleNamesToSVGs();
fixFakeLinkIssue();
fixFakeLinkIssues();
googleSignIn();
fixButtonIdentifiers();