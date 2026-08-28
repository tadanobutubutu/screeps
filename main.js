const fs = require('fs');
const path = require('path');
const { updateThScopeAttribute } = require('./testHelper');
const { checkLandmarkElements } = require('./a11y');

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation

// Standalone function to get the accessible name of an SVG element
// Uses aria-labelledby first, then falls back to the <title> child element
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof SVGElement) || svg.tagName !== 'svg') {
    return '';
  }

  // First, check for aria-labelledby reference
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const names = ids
      .map(id => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : '';
      })
      .filter(text => text.length > 0);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim().length > 0) {
    return ariaLabel.trim();
  }

  // Fall back to <title> child element
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  // Check for title attribute on the SVG itself
  const titleAttr = svg.getAttribute('title');
  if (titleAttr && titleAttr.trim().length > 0) {
    return titleAttr.trim();
  }

  return '';
}

function main() {
  return 'Hello World';
}

// New function added by HEAD branch
function newFunction() {
    // TODO: Implement functionality
}

// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }
}

// isLinkAccessible: Checks if a link element is accessible according to accessibility standards
// Returns true if the link has a valid href, is not disabled, and has meaningful content
function isLinkAccessible(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Must have a valid href attribute with non-empty value
  const href = link.getAttribute('href');
  if (!href || href.trim() === '') {
    return false;
  }

  // Should not be disabled (either via disabled attribute or aria-disabled)
  if (link.hasAttribute('disabled') || link.getAttribute('aria-disabled') === 'true') {
    return false;
  }

  // Link should have some text content (non-empty)
  if (!link.textContent.trim()) {
    return false;
  }

  return true;
}

// Ensure the root HTML element has a lang attribute
function ensureHtmlLangAttribute() {
  if (!document.documentElement) return;
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

// Ensure a given element has a non-empty id; auto-generate one if missing
function ensureElementHasId(element, prefix = 'el') {
  if (!element) return '';
  if (element.id && element.id.trim().length > 0) {
    return element.id;
  }
  const generatedId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  element.id = generatedId;
  return generatedId;
}

// Add an aria-label to an element if it is missing or empty
function ensureAriaLabel(element, label) {
  if (!element) return;
  const existing = element.getAttribute('aria-label');
  if (!existing || existing.trim().length === 0) {
    element.setAttribute('aria-label', label || 'Interactive element');
  }
}

// Render a textual representation of a dependency graph for assistive technologies
function renderDependencyGraphDescription(graph) {
  if (!graph || !graph.nodes || !graph.edges) {
    return '';
  }
  const nodeLabels = graph.nodes.map(n => n.label || n.id).join(', ');
  const edgeDescriptions = graph.edges.map(e => {
    const from = graph.nodes.find(n => n.id === e.from);
    const to = graph.nodes.find(n => n.id === e.to);
    const fromLabel = from ? (from.label || from.id) : e.from;
    const toLabel = to ? (to.label || to.id) : e.to;
    return `${fromLabel} depends on ${toLabel}`;
  });
  return `Dependency graph with ${graph.nodes.length} nodes (${nodeLabels}). ${edgeDescriptions.join('. ')}.`;
}

const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.addFocusVisibilityStyles();
    this.setupFocusVisiblePolyfill();
    this.enhanceDynamicContent();
    this.checkLandmarkElements();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[aria-hidden="false"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('.dropdown, .dropdown-menu');
    dropdownCont
  },

  checkLandmarkElements() {
    // Implementation from a11y module
  },

  updateLiveRegion(message, priority = 'polite') {
    // Implementation for updating live region
  },

  countDependencies(options = {}) {
    // Implementation for counting dependencies
  }
};

// Store for accessibility announcements (screen reader support)

// GitHub Issue Fix - Commit: 6009dec851a51383188dc071ee4edb6953001d55
// GitHub Issue Fix - UPDATED: Merged from both branches

// TODO: Add exports for new functions if needed

// Existing utility functions
function add(a, b) {
  return a + b;
}
function createInPageButton(buttonId, buttonText, buttonClass) {
  const button = document.createElement('button');

  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;

  document.body.appendChild(button);

  return button;
}
function calculateDiscount(price, discountRate) {
    return price - (price * discountRate);
}

function getSvgAccessibleName(svgElement) {
  // ... Existing implementation ...
}

/**
 * Adds accessibility properties to SVG elements in the given container.
 * @param {HTMLElement} container - The container to check for SVG elements
 */
function addSVGAccessibilityProps(container) {
  // ... New implementation for this function ...
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  // ... Existing implementation ...
}

function checkLandmarkElement(role, element) {
  // ... Existing implementation ...
}

function wrapPrimaryContentInMain() {
  // ... Existing implementation ...
}

function checkLandmarks(container = document) {
  // ... Existing implementation ...
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Initialize language attribute
  getLangAttribute();
  // Create in-page button for language toggle
  createInPageButton();
}

function getLangAttribute(element) {
  // ... Existing implementation ...
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  // ... Existing implementation ...
}

function validateLandmark() {
  return true;
}

function validateLandmarkStructure() {
  return true;
}

function ensureUniqueLandmarks() {
  return true;
}

function validateTableAccessibility() {
  return true;
}
function validateTableStructure() {
  return true;
}

function validateLandmarkElements() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach((element) => {
    const landmark = document.querySelector(`[role="${element}"]`);
    if (landmark && landmark.id === '') {
      landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
    }
  });
}

// New function to count dependencies
function countDependencies(options = {}) {
  return a11yStore.countDependencies(options);
}

// New function to update the live region
function updateLiveRegion(message, priority = 'polite') {
  return a11yStore.updateLiveRegion(message, priority);
}

// New function to check landmark elements
function checkLandmarkElements() {
  return a11yStore.checkLandmarkElements();
}

// Existing exported functions
// ...

module.exports = {
  add,
  createInPageButton,
  calculateDiscount,
  getLangAttribute,
  addSVGAccessibilityProps,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkElements,
  countDependencies,
  updateLiveRegion,
  checkLandmarkElements
};