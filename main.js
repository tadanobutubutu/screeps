// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
// _Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
// _Commit: 669117b4c3d1a635653f730f0a059efacbb752_
// <!-- todo-hash: 312aa8ea4c5e1c9430e4b7c36c210eb9a72dea -->
// _Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
// <!-- todo-hash: d290c9a63ee693e91602163f7ca6757def47f63e -->
// Updated: Identified and updated specific functions that render dependency graphs or index views.
// - SVG dependency graphs: handled by getSvgAccessibleName() and validateSvgAccessibility()
// - Table index views: handled by validateTableAccessibility() and validateTableStructure()
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// ADD: Address new accessibility issues from insight report
import React from 'react'

const http = require('http');
const url = require('url');

// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

const main = require('./utilities');

const {
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
} = require('./mathHelpers');

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute (lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en'
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang (content) {
  // Simple language detection based on common patterns
  let lang = 'en' // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/u.test(content)) {
      lang = 'zh' // Chinese
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/u.test(content)) {
      lang = 'ja' // Japanese
    } else if (/[\u0400-\u04FF]/u.test(content)) {
      lang = 'ru' // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/u.test(content)) {
      lang = 'ar' // Arabic
    } else if (/[àâçéèêëîïôùûüÿæœ]/i.test(content)) {
      lang = 'fr' // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de' // German
    }
  }

  return lang
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute () {
  return typeof document !== 'undefined' && document.documentElement
    ? document.documentElement.lang
    : 'en'
}

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

const config = {
  port: 3000,
  debug: false
};

function getWelcomeMessage() {
  return greetingFunction() + " This is a new function that returns a welcome message.";
}

const { class1, function1, Object1 } = require('./path/to/module');

function validateTableStructure (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []
  const rows = Array.from(tableElement.querySelectorAll('tr'))

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'))
    const cellCount = cells.length

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`)
      }
    })

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1]
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'))
      if (cellCount !== prevCells.length) {
        errors.push(
                    `Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`
        )
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

function validateTableAccessibility (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element')
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element')
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead')
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : []
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements')
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`)
    }
  })

  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption')
  const hasSummary =
        tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  return { valid: errors.length === 0, errors }
}

function validateTableStructure (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] }
  }

  const errors = []
  const rows = Array.from(tableElement.querySelectorAll('tr'))

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'))
    const cellCount = cells.length

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`)
      }
    })

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1]
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'))
      if (cellCount !== prevCells.length) {
        errors.push(
                    `Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`
        )
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark (element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] }
  }

  const errors = []
  const validLandmarks = [
    'header',
    'nav',
    'main',
    'aside',
    'footer',
    'section',
    'article',
    'search'
  ]

  // Check if element is a valid landmark
  const role = element.getAttribute('role')
  const tagName = element.tagName.toLowerCase()

  if (role && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`)
  }

  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`)
  }

  // Check for accessible name
  const hasLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.querySelector('h1, h2, h3, h4, h5, h6')

  if (!hasLabel) {
    errors.push(
      'Landmark is missing accessible name (aria-label, aria-labelledby, or heading)'
    )
  }

  return { valid: errors.length === 0, errors }
}

function validateLandmarkStructure (container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const requiredRoles = ['main', 'banner', 'navigation', 'contentinfo'];
  const foundRoles = new Set();

  container.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (requiredRoles.includes(role)) {
      foundRoles.add(role);
    }
  });

  return {
    hasMain: foundRoles.has('main'),
    hasBanner: foundRoles.has('banner'),
    hasNav: foundRoles.has('navigation'),
    hasFooter: foundRoles.has('contentinfo'),
    missingRoles: requiredRoles.filter(r => !foundRoles.has(r))
  };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName (svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null
  }

  // Check for aria-label
  const accessibleName = svgElement.getAttribute('aria-label')
  if (accessibleName) return accessibleName

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return null
}

function validateSvgAccessibility () {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const svgs = document.querySelectorAll('svg')

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg)
    if (!name) {
      errors.push(
                `SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`
      )
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []
  const landmarkCounts = {}

  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, article, [role]'
  )
  landmarks.forEach((landmark) => {
    const identifier = landmark.tagName.toLowerCase() || landmark.getAttribute('role')

    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        errors.push('Duplicate main landmark found. Only one main landmark should exist.')
      } else {
        landmarkCounts[identifier] = 1
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_036: Fix 1 fake link issue
function validateLinks (container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const root = container || document
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]')

  links.forEach((el, index) => {
    const name = personName(el)
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`)
    }
  })

  return { valid: errors.length === 0, errors }
}

// TODO: Implement a new function to handle focus trap for keyboard navigation
/**
 * Creates a focus trap within a container element for keyboard navigation.
 * Keeps focus within the trapped area and cycles focus between focusable elements.
 * @param {HTMLElement} container - The container element to trap focus within
 * @param {Object} options - Configuration options for the focus trap
 * @param {boolean} options.escapeDeactivates - If true, Escape key will deactivate the trap (default: true)
 * @param {boolean} options.returnFocusOnDeactivate - If true, returns focus to the previously focused element (default: true)
 * @param {Function} options.onEscape - Callback function when Escape key is pressed
 * @param {Function} options.onActivate - Callback function when trap is activated
 * @param {Function} options.onDeactivate - Callback function when trap is deactivated
 * @returns {Object} Focus trap controller with activate, deactivate, and update methods
 */
function createFocusTrap (container, options = {}) {
  if (typeof document === 'undefined' || !container) {
    return null
  }

  const config = {
    escapeDeactivates: options.escapeDeactivates !== false,
    returnFocusOnDeactivate: options.returnFocusOnDeactivate !== false,
    onEscape: options.onEscape || null,
    onActivate: options.onActivate || null,
    onDeactivate: options.onDeactivate || null
  }

  let active = false
  const deactivateHandler = null

  const getFocusableElements = () => {
    return Array.from(
      container.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled)
  }

  const handleKeyDown = (e) => {
    if (!active) return

    if (e.key === 'Escape' && config.escapeDeactivates) {
      e.preventDefault()
      deactivate()
      if (config.onEscape) config.onEscape()
      return
    }

    if (e.key === 'Tab') {
      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  const activate = () => {
    if (active) return
    active = true
    document.addEventListener('keydown', handleKeyDown)
    if (config.onActivate) config.onActivate()
  }

  const deactivate = () => {
    if (!active) return
    active = false
    document.removeEventListener('keydown', handleKeyDown)
    if (config.returnFocusOnDeactivate && deactivateHandler) {
      deactivateHandler.focus()
    }
    if (config.onDeactivate) config.onDeactivate()
  }

  const update = (newOptions) => {
    Object.assign(config, newOptions)
  }

  return {
    activate,
    deactivate,
    update,
    destroy: deactivate
  }
}

/**
 * Validates that links and interactive elements have accessible names,
 * addressing REACT_036 fake link issues.
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {object} Validation result with valid flag and errors array
 */
function validateLinks (container) {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const root = container || document
  const links = root.querySelectorAll('a, button, [role="link"], [role="button"]')

  links.forEach((el, index) => {
    const name = personName(el)
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`)
    }
  })

  return { valid: errors.length === 0, errors }
}

function personName (element) {
  if (typeof document === 'undefined' || !element) {
    return null
  }

  // Check for aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) return ariaLabel

  // Check for aria-labelledby referencing another element
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title attribute
  const title = element.getAttribute('title')
  if (title) return title

  // Fall back to text content
  const textContent = element.textContent.trim()
  if (textContent) return textContent

  return null
}

/**
 * Generates accessible name from an element's content.
 * @param {HTMLElement} element - Element to get accessible name for
 * @returns {string} - Accessible name
 */
function personName(element) {
  if (!element) {
    return '';
  }

  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  if (element.textContent) {
    return element.textContent.trim();
  }

  return element.title || '';
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark (element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] }
  }

  const errors = []
  const validLandmarks = [
    'header',
    'nav',
    'main',
    'aside',
    'footer',
    'section',
    'article',
    'search'
  ]

  // Check if element is a valid landmark
  const role = element.getAttribute('role')
  const tagName = element.tagName.toLowerCase()

  if (role && !validLandmarks.includes(role.toLowerCase())) {
    errors.push(`Invalid landmark role: ${role}`)
  }

  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`)
  }

  // Check for accessible name
  const hasLabel =
        element.getAttribute('aria-label') ||
        element.getAttribute('aria-labelledby') ||
        element.querySelector('h1, h2, h3, h4, h5, h6')

  if (!hasLabel) {
    errors.push(
      'Landmark is missing accessible name (aria-label, aria-labelledby, or heading)'
    )
  }

  return { valid: errors.length === 0, errors }
}

function validateLandmarkStructure () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []

  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]')
  if (mainElements.length > 1) {
    errors.push('Multiple main landmarks found. Only one main landmark should exist.')
  }

  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, article, [role]'
  )
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement
    while (parent) {
      const parentTag = parent.tagName.toLowerCase()
      const parentRole = parent.getAttribute('role')

      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found')
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found')
      }

      parent = parent.parentElement
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName (svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null
  }

  // Check for aria-label
  const accessibleName = svgElement.getAttribute('aria-label')
  if (accessibleName) return accessibleName

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return null
}

function validateSvgAccessibility () {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] }
  }

  const errors = []
  const svgs = document.querySelectorAll('svg')

  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg)
    if (!name) {
      errors.push(
                `SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`
      )
    }
  })

  return { valid: errors.length === 0, errors }
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks () {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] }
  }

  const errors = []
  const landmarkCounts = {}

  // Count landmarks by role or tag
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, section, article, [role]'
  )
  landmarks.forEach((landmark) => {
    const identifier = landmark.tagName.toLowerCase() || landmark.getAttribute('role')

    // main landmarks should be unique
    if (identifier === 'main' || identifier === 'MAIN') {
      if (landmarkCounts[identifier]) {
        errors.push('Duplicate main landmark found. Only one main landmark should exist.')
      } else {
        landmarkCounts[identifier] = 1
      }
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Check if an element is a landmark element for accessibility
 * Landmark elements include: main, nav, aside, header, footer, section, article, form, search
 * @param {HTMLElement|string} element - The element or element tag name to check
 * @returns {boolean} True if the element is a landmark element
 */
function isLandmarkElement(element) {
  const landmarkTags = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form', 'search'];

  if (!element) {
    return false;
  }

  if (typeof element === 'string') {
    return landmarkTags.includes(element.toLowerCase());
  }

  if (element.tagName) {
    return landmarkTags.includes(element.tagName.toLowerCase());
  }

  return false;
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmark(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="navigation"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName (svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null
  }

  // Check for aria-label
  const accessibleName = svgElement.getAttribute('aria-label')
  if (accessibleName) return accessibleName

  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy)
    if (labelElement) return labelElement.textContent
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title')
  if (title && title.textContent.trim()) {
    return title.textContent.trim()
  }

  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc')
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim()
  }

  return null
}

async function newFunction() {
  // New function implementation from origin/main
}

if (typeof document !== 'undefined') {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

if (typeof document !== 'undefined') {
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  mainElement = document.createElement('main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  document.body.appendChild(mainElement);

  return mainElement;
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

/**
 * Ensure unique main landmarks exist in the document.
 * Logs a warning if multiple main landmarks are detected.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    console.warn('Multiple main landmarks detected. Ensure only one main landmark exists.');
    throw new Error('Document should have at most one main landmark');
  }
}

/**
 * Create an in-page button with accessibility features.
 * @param {string} text - Button text
 * @param {string} targetId - Target element ID to scroll to
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', `Scroll to ${text}`);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

/**
 * Parse a credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Parsed response with success status and credential or error
 */
function parseCredentialResponse(credentialResponse) {
    try {
        if (!credentialResponse || !credentialResponse.credential) {
            return {
                success: false,
                error: 'Invalid credential response'
            };
        }
        const parts = credentialResponse.credential.split('.');
        if (parts.length !== 3) {
            return {
                success: false,
                error: 'Malformed credential token'
            };
        }
        const payload = parts[1];
        const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

/**
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_.-]/g, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponse(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);

    if (!parsedResponse.success) {
        return {
            status: 'error',
            message: parsedResponse.error
        };
    }

    const credential = parsedResponse.credential;

    if (!credential) {
        return {
            status: 'error',
            message: 'No credential provided'
        };
    }

    // Decode the JWT token to extract user information
    const decodedToken = decodeJwtToken(credential);

    if (!decodedToken) {
        return {
            status: 'error',
            message: 'Failed to decode credential token'
        };
    }

    // Create session for the authenticated user
    const sessionId = generateSessionId();
    const sessionData = {
        user: {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            sub: decodedToken.sub
        },
        authenticatedAt: Date.now(),
        credential: credential
    };

    appState.sessions.set(sessionId, sessionData);
    appState.credentials.push({
        sessionId,
        clientId: parsedResponse.clientId,
        timestamp: Date.now()
    });

    return {
        status: 'success',
        sessionId,
        user: sessionData.user
    };
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return timestamp + '-' + randomPart;
}

/**
 * Validates the structure of the table to ensure accessibility.
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} True if the table is accessible, false otherwise
 */
function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element')
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element')
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead')
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : []
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements')
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`)
    }
  })

  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption')
  const hasSummary =
        tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby')
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility')
  }

  return { valid: errors.length === 0, errors }
}

function validateTableStructure (tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] }
  }

  const errors = []
  const rows = Array.from(tableElement.querySelectorAll('tr'))

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'))
    const cellCount = cells.length

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`)
      }
    })

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1]
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'))
      if (cellCount !== prevCells.length) {
        errors.push(
                    `Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`
      )
    }
  })

  return { valid: errors.length === 0, errors }
}

/**
 * Validates table accessibility by checking structure and headers.
 * @param {HTMLElement} table - The table to validate
 * @returns {Object} - Validation result with success status and details
 */
function validateTableStructure(tableElement) {
  if (!tableElement) {
    return { success: false, error: 'Table is required' };
  }

  const hasCaption = !!tableElement.querySelector('caption');
  const headers = tableElement.querySelectorAll('th');

  const headerValidation = Array.from(headers).every(header => header.hasAttribute('scope'));

  return {
    success: hasCaption && headers.length > 0 && headerValidation,
    details: {
      hasCaption,
      headerCount: headers.length,
      headersHaveScope: headerValidation
    }
  };
}

/**
 * Validates the structure of landmark elements.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmarkStructure(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const requiredRoles = ['main', 'banner', 'navigation', 'contentinfo'];
  const foundRoles = new Set();

  container.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (requiredRoles.includes(role)) {
      foundRoles.add(role);
    }
  });

  return {
    hasMain: foundRoles.has('main'),
    hasBanner: foundRoles.has('banner'),
    hasNav: foundRoles.has('navigation'),
    hasFooter: foundRoles.has('contentinfo'),
    missingRoles: requiredRoles.filter(r => !foundRoles.has(r))
  };
}

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Rendering options
 * @returns {void}
 */
function renderDependencyGraph(deps, container, options = {}) {
  // Use dependencyGraphContent from the imported module
  if (container && typeof document !== 'undefined') {
    container.innerHTML = dependencyGraphContent(deps, options);
  } else if (typeof document !== 'undefined') {
    document.body.innerHTML = dependencyGraphContent(deps, options);
  }
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {HTMLElement} container - Container element to render into
 * @param {Object} options - Rendering options
 * @returns {void}
 */
function renderIndex(data, container, options = {}) {
  // Use indexContent from the imported module
  if (container && typeof document !== 'undefined') {
    container.innerHTML = indexContent(data, options);
  } else if (typeof document !== 'undefined') {
    document.body.innerHTML = indexContent(data, options);
  }
}

if (typeof document !== 'undefined') {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

if (typeof document !== 'undefined') {
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  mainElement = document.createElement('main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  document.body.appendChild(mainElement);

  return mainElement;
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

/**
 * Ensure unique main landmarks exist in the document.
 * Logs a warning if multiple main landmarks are detected.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    console.warn('Multiple main landmarks detected. Ensure only one main landmark exists.');
    throw new Error('Document should have at most one main landmark');
  }
}

/**
 * Create an in-page button with accessibility features.
 * @param {string} text - Button text
 * @param {string} targetId - Target element ID to scroll to
 * @returns {HTMLButtonElement} The created button
 */
function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', `Scroll to ${text}`);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

// Initialize appState with required structures
const appState = {
  sessions: new Map(),
  credentials: []
};

/**
 * Validate a session
 * @param {string} sessionId - The session ID to validate
 * @returns {Object|null} - Session data or null if invalid
 */
function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

/**
 * Get active sessions count
 * @returns {number} - Number of active sessions
 */
function getActiveSessionsCount() {
  return appState.sessions.size;
}

/**
 * Decode a JWT token
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} - Decoded token payload or null
 */
function decodeJwtToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// HTTP Server setup
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // CORS headers for credential responses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Health check endpoint
    if (parsedUrl.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
        return;
    }

    // Credential response endpoint
    if (parsedUrl.pathname === '/api/credential' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const credentialResponse = JSON.parse(body);
                const result = handleCredentialResponse(credentialResponse);

                res.writeHead(result.status === 'success' ? 200 : 400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Session validation endpoint
    if (parsedUrl.pathname === '/api/session/validate' && req.method === 'GET') {
        const sessionId = parsedUrl.query.sessionId;

        if (!sessionId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
            return;
        }

        const session = validateSession(sessionId);

        if (session) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'valid', user: session.user }));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
        }
        return;
    }

    // Session revocation endpoint
    if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { sessionId } = JSON.parse(body);
                const revoked = revokeSession(sessionId);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: revoked ? 'success' : 'error' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
            }
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

/**
 * Revoke a session
 * @param {string} sessionId - The session ID to revoke
 * @returns {boolean} - True if session was revoked
 */
function revokeSession(sessionId) {
    return appState.sessions.delete(sessionId);
}

/**
 * Add SVG accessibility props for better screen reader support
 * @param {HTMLElement} container - Container element to process SVGs within
 */
function addSvgAccessibilityProps(container = document) {
  const svgElements = container.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    let titleElement = svg.querySelector('title');
    if (!titleElement) {
      titleElement = document.createElement('title');
      titleElement.textContent = 'Image';
      svg.insertBefore(titleElement, svg.firstChild);
    }

    if (!titleElement.id) {
      titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    }

    svg.setAttribute('aria-labelledby', titleElement.id);

    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Start server if this is the main module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export modules for testing
module.exports = {
    addSvgAccessibilityProps,
    isLandmarkElement,
    handleCredentialResponse,
    parseCredentialResponse,
    decodeJwtToken,
    generateSessionId,
    validateTableStructure,
    validateTableAccessibility,
    validateLandmark,
    validateLandmarkStructure,
    createInPageButton,
    personName,
    validateSession,
    revokeSession,
    getActiveSessionsCount,
    server,
    sanitizeFilename,
    processData,
    renderDependencyGraph,
    renderIndex,
    newFunction,
    checkLandmarkElement,
    wrapPrimaryContentInMain,
    checkLandmarks,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createFocusTrap: a11yStore.createFocusTrap
};