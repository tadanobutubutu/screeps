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
  renderAdditionalContent,
  calculateComplexity,
  renderDependencyGraph,
  renderIndex
} from './AccessibilityHelpers';

const ScreepsBotFactory = require('./ScreepsBot').default;
const updateUI = require('./updateUI').default;
const main = require('./utilities');
const React = require('react');
const { setElementLabel } = require('./AccessibilityHelpers');

// Main entry point for the Screeps bot.
// Handles core game logic and integration points.
const main = require('./utilities')
const React = require('react');

// Accessibility enhancement: Ensure all UI elements are properly labeled
setElementLabel(document.getElementByTagName('html')[0], 'html');

// TODO: Implement spawning logic
function spawnCreep(role, bodyParts = []) {
  // Fetch spawn room from Game.spawns (first available)
  const spawn = Object.values(Game.spawns)[0]
  if (!spawn) {
    console.log('No spawn available')
    return null
  }

  // Define parts based on role if none provided
  if (bodyParts.length === 0) {
    // Example role-based body definitions
    switch (role) {
      case 'harvester':
        bodyParts = [WORK, CARRY, MOVE]
        break
      case 'upgrader':
        bodyParts = [WORK, WORK, CARRY, MOVE]
        break
      case 'builder':
        bodyParts = [WORK, WORK, WORK, CARRY, MOVE]
        break
      case 'attack':
        bodyParts = [ATTACK, MOVE]
        break
      default:
        bodyParts = [WORK, CARRY, MOVE]
    }
  }

  // Check if a creep with this role already exists
  const existing = Object.values(Game.creeps).find(c => c.memory.role === role)
  if (existing) {
    console.log(`Creep with role ${role} already exists: ${existing.name}`)
    return null
  }

  // Spawn the creep with a name based on role and timestamp
  const name = `${role}-${Game.time}`
  const result = spawn.spawnCreep(bodyParts, name, {
    memory: { role }
  })

  if (result === OK) {
    console.log(`Spawning ${role} named ${name}`)
    return name
  } else {
    console.log(`Failed to spawn ${role}: ${result}`)
    return null
  }
}

// New feature: Priority-based task scheduling
function addTask(taskFn, priority = 'medium') {
  const taskId = this.generateTaskId()
  this.tasks.push({ task: taskFn, priority, id: taskId })
  this.scheduleTasks()
  return taskId
}

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { accessibilityUtils } = require('./accessibilityUtils');

const { validateTableStructureForAccessibility } = main;

const DOMParser = require('@xmldom/xmldom').DOMParser;

// Dependency imports for additional functionality
const {
  createInPageButton: createWebResourceButton,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasIdOrigin,
  setupFocusTrap,
  restoreFocus,
  checkAccessibility,
  implementAccessibilityFixesFromReport,
  checkAccessibilityForReport,
  renderGraphIndex,
  trapFocus,
  getActiveSessionsCount,
  validateSession,
  handleCredentialResponse,
  createAnnouncer,
  prefersReducedMotion,
  renderSimpleDependencyGraph,
  initializeAccessibility,
  newFunction,
  a11yStore,
  ...mainUtilities
} = require('./utilities');

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.getElementById('dependencyGraph');

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Ensure element has an ID if not present
  if (!dependencyGraph.getAttribute('id')) {
    dependencyGraph.setAttribute('id', 'dependencyGraph');
  }

  // Add language attribute to the HTML element
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.lang = 'en';
  }
}

class ScreepsBot {
  constructor() {
    this.tasks = [];
    this.focusTrapEnabled = false;
    this.focusedElement = null;
  }

  // New feature: Priority-based task scheduling
  addTaskWithPriority(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority, id: this.generateTaskId() });
    this.scheduleTasks();
    return this.tasks[0].id;
  }

  generateTaskId() {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  scheduleTasks() {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    this.tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // Accessibility functions
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId);
    if (el) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
    }
  }

  // Event listener for click events on the dependencyGraph element
  handleDependencyGraphClick = () => {
    const dependencyGraph = document.getElementById('dependencyGraph');
    if (dependencyGraph) {
      const html = dependencyGraph.innerHTML;
      this.validateTableAccessibility(html);
    }
  };

  // ... (Add the event listener for click events on the dependencyGraph element)
}

// Extract the accessible name for an SVG from its content
function extractAccessibleNameFromSVG(svgContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const title = xmlDoc.getElementsByTagName("title");
  return title.length > 0 ? title[0].textContent : '';
}

// Export the new function
module.exports = {
  // ... (The existing exports remain the same)
  createInPageButtons,
  extractAccessibleNameFromSVG
};