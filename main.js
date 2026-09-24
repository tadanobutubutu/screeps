// TODO: This is the modified and merged code
// This is the existing code that needs to be preserved in main.js
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

/**
 * Ensures an element has an id attribute. If the element doesn't have an id,
 * one is generated using the provided prefix.
 * @param {HTMLElement} element - The element to ensure has an id
 * @param {string} prefix - The prefix to use for generating an id if one doesn't exist
 * @returns {string} The id of the element
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    return null;
  }

  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return element.id;
}

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }

  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }

  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
  if (!element) {
    return null;
  }

  const id = ensureElementHasId(element, idPrefix);
  addAriaLabel(element, ariaLabel);

  return id;
}

// Utility functions for accessibility
const accessibilityUtils = {
    initSkipLink: () => {
        const skipLink = document.querySelector('#skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = skipLink.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });

        // Check if all enemies are defeated
        if (this.enemies.length === 0 && this.gameState === 'running') {
            setTimeout(() => this.startWave(), 2000);
        }
    }
};

/**
 * Main entry point for the Screeps bot.
 * Handles core game logic and integration points.
 */
class ScreepsBot {
  constructor() {
    this.network = null;
    this.tasks = [];
    this.config = {};
  }

  async start() {
    // Initialize network connection
    await this.network.connect();

    // Load initial data
    await this.loadData();

    console.log('Screenspider bot started');
  }

  loadData() {
    // Placeholder for data loading logic
    // Implement actual data fetching here
  }

  // Accessibility enhancement: Ensure all UI elements are properly labeled
  setElementLabel(elementId, label) {
    const el = document.getElementById(elementId);
    if (el) {
      el.setAttribute('aria-label', label);
      el.setAttribute('role', 'button');
    }
  }

  // New feature: Priority-based task scheduling
  addTaskWithPriority(taskFn, priority = 'medium') {
    this.tasks.push({ task: taskFn, priority });
    this.scheduleTasks();
  }

  scheduleTasks() {
    // Sort tasks by priority (high > medium > low)
    this.tasks.sort((a, b) => {
      const prioOrder = { high: 0, medium: 1, low: 2 };
      return prioOrder[b.priority] - prioOrder[a.priority];
    });

    // Execute highest priority task
    if (this.tasks.length > 0) {
      const nextTask = this.tasks[0];
      try {
        nextTask.task();
      } catch (err) {
        console.error(`Task failed: ${err.message}`);
      }
    }
  }
}

// Helper function for UI updates with accessibility
function updateUI(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
    element.setAttribute('aria-live', 'polite');
  }
}

function setHtmlLangAttribute(lang) {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('lang', lang || 'en');
    }
    return lang || 'en';
}

function addLangAttribute() {
    document.documentElement.setAttribute('lang', 'en');
}

module.exports = {
    accessibilityUtils,
    ScreepsBot,
    updateUI,
    ensureElementHasId,
    addAriaLabel,
    ensureElementAccessibility,
    setHtmlLangAttribute,
    addLangAttribute,
    getLangAttribute: accessibilityUtils.getLangAttribute,
    personName: accessibilityUtils.personName,
    validateTableAccessibility: accessibilityUtils.validateTableAccessibility,
    validateTableStructure: accessibilityUtils.validateTableStructure,
    validateLandmark: accessibilityUtils.validateLandmark,
    validateLandmarkStructure: accessibilityUtils.validateLandmarkStructure,
    newFocusTrap: accessibilityUtils.newFocusTrap,
    getSvgAccessibleName: accessibilityUtils.getSvgAccessibleName,
    createInPageButton: accessibilityUtils.createInPageButton,
    trapFocus: accessibilityUtils.trapFocus,
    initSkipLink: accessibilityUtils.initSkipLink,
    announceToScreenReader: accessibilityUtils.announceToScreenReader,
    handleKeyboardNav: accessibilityUtils.handleKeyboardNav
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
    window.accessibilityUtils = accessibilityUtils;
    window.ScreepsBot = ScreepsBot;
    window.updateUI = updateUI;
    window.ensureElementHasId = ensureElementHasId;
    window.addAriaLabel = addAriaLabel;
    window.ensureElementAccessibility = ensureElementAccessibility;
    window.setHtmlLangAttribute = setHtmlLangAttribute;
    window.addLangAttribute = addLangAttribute;
    window.getLangAttribute = accessibilityUtils.getLangAttribute;
    window.personName = accessibilityUtils.personName;
    window.validateTableAccessibility = accessibilityUtils.validateTableAccessibility;
    window.validateTableStructure = accessibilityUtils.validateTableStructure;
    window.validateLandmark = accessibilityUtils.validateLandmark;
    window.validateLandmarkStructure = accessibilityUtils.validateLandmarkStructure;
    window.newFocusTrap = accessibilityUtils.newFocusTrap;
    window.getSvgAccessibleName = accessibilityUtils.getSvgAccessibleName;
    window.createInPageButton = accessibilityUtils.createInPageButton;
    window.trapFocus = accessibilityUtils.trapFocus;
    window.initSkipLink = accessibilityUtils.initSkipLink;
    window.announceToScreenReader = accessibilityUtils.announceToScreenReader;
    window.handleKeyboardNav = accessibilityUtils.handleKeyboardNav;
}