const main = require('./utilities')

// Function for getting the language attribute based on content
function getLangAttribute() {
  return main.getLangAttribute()
}

// Function for ensuring that each landmark on the page has a unique id attribute
function ensureUniqueLandmarks() {
  return main.ensureUniqueLandmarks()
}

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * @param {HTMLElement} container - The container element to check
 * @returns {boolean} True if the fix was applied
 */
function ensureDependencyGraphAriaRole(container) {
  return main.ensureDependencyGraphAriaRole(container)
}

/**
 * Implements accessibility fixes based on insights from accessibility reports
 * @param {HTMLElement} container - The container element to process
 * @param {Object} containerReport - The accessibility report containing identified issues
 * @returns {Object} Summary of fixes applied
 */
function applyAccessibilityFixes(container, containerReport) {
  return main.applyAccessibilityFixes(container, containerReport)
}

function validateTableStructure(table) {
  return main.validateTableStructure(table)
}

function validateTableAccessibility(table) {
  return main.validateTableAccessibility(table)
}

function setLangAttribute() {
  return main.setLangAttribute()
}

function getSvgAccessibleName(svg, allowContentSearch = true) {
  return main.getSvgAccessibleName(svg, allowContentSearch)
}

function validateLinkAccessibility(links) {
  return main.validateLinkAccessibility(links)
}

function handleFakeLinks(elements) {
  return main.handleFakeLinks(elements)
}

function addProperLandmarkRegions(element) {
  return main.addProperLandmarkRegions(element)
}

function addressAccessibilityIssuesFromReport(pageContent, reportData) {
  return main.addressAccessibilityIssuesFromReport(pageContent, reportData)
}

function checkAccessibility(content, options = {}) {
  return main.checkAccessibility(content, options)
}