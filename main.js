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

// New function: Keyboard event handler for accessibility
function handleKeyboardNavigation(event) {
  const key = event.key;
  const activeElement = document.activeElement;

  // Handle keyboard navigation (e.g., arrow keys, tab)
  switch (key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      this.navigateWithArrow(key, activeElement);
      break;
    case 'Tab':
      this.handleTabNavigation(event, activeElement);
      break;
    default:
      break;
  }
}

// Helper for arrow key navigation
function navigateWithArrow(key, activeElement) {
  // Implement custom navigation logic based on element type
  console.log(`Navigating with ${key} key`);
}

// Helper for tab key navigation
function handleTabNavigation(event, activeElement) {
  // Implement custom tab navigation logic
  console.log('Handling tab navigation');
}

// New function: Calculate discount based on some criteria
function calculateDiscount(price, discountRate) {
  return price * (1 - discountRate);
}

// Import and use existing functions from utilities
const { renderDependencyGraphs, ...mainUtilities } = main;

// Add the new functions as required exports
const newExports = {
  handleKeyboardNavigation,
  setFocus
};

// Function to address accessibility issues from an insight report
function addressAccessibilityIssues(report) {
  if (!report || typeof report !== 'object') {
    return false
  }

  // Handle form accessibility issues
  if (Array.isArray(report.forms)) {
    report.forms.forEach(formId => {
      const form = document.getElementById(formId)
      if (form) {
        accessibilityUtils.validateAndFixFormAccessibility(form)
      }
    })
  }

  // Handle link accessibility issues
  if (Array.isArray(report.links)) {
    report.links.forEach(linkId => {
      const link = document.getElementById(linkId)
      if (link) {
        accessibilityUtils.validateAndFixLinkAccessibility(link)
      }
    })
  }

  // Handle button accessibility issues
  if (Array.isArray(report.buttons)) {
    report.buttons.forEach(buttonId => {
      const button = document.getElementById(buttonId)
      if (button) {
        accessibilityUtils.validateAndFixButtonAccessibility(button)
      }
    })
  }

  return true
}

// Replace the original export with the updated and extended one
module.exports = {
  ...newExports,
  addTask,
  setFocus,
  handleKeyboardNavigation,
  addressAccessibilityIssues,
  renderDependencyGraphs,
  ...mainUtilities,
  accessibilityUtils
}