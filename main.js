'use strict';

/**
 * main.js — Screeps entry point and shared helpers.
 *
 * This file hosts two independent feature sets:
 *
 * Exports configuration, user-management, accessibility/UI, and memory helpers.
 */

const config = {
  port:   process.env.PORT      || 3000,
  env:    process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL   || 'https://api.example.com',
  timeout: Number(process.env.TIMEOUT) || 5000,
  debug:  process.env.NODE_ENV !== 'production',
  version: '1.0.0',
};

// Default language (update if you need another locale)
document.documentElement.lang = 'en';

// -------------------------------------------------------------------------
// 1️⃣  Configuration helpers
// -------------------------------------------------------------------------

// (All helpers already live in `config`)

// -------------------------------------------------------------------------
// 2️⃣  App state & common utilities
// -------------------------------------------------------------------------

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
};

const hello        = () => 'Hello from main.js';
const getVersion   = () => config.version;
const getConfig    = () => ({ ...config });

const calculateDifference = (a, b) => a - b;
const calculateProduct    = (a, b) => a * b;
const isNumber          = (value) => typeof value === 'number' && !Number.isNaN(value);
const clamp             = (value, min, max) => Math.min(Math.max(value, min), max);

// -------------------------------------------------------------------------
// 3️⃣  Accessibility helpers
// -------------------------------------------------------------------------

const getUserLocale = () => navigator.language || 'en-US';

const focusElement = (el) => {
  if (el && typeof el.focus === 'function') {
    el.focus();
  }
};

function validateTableAccessibility(table) {
  const issues = [];
  if (!(table instanceof HTMLTableElement)) {
    issues.push('Not an HTMLTableElement');
    return { success: false, issues };
  }

  if (!table.hasAttribute('summary')) {
    issues.push('Missing title/summary attribute');
  }

  if (!table.querySelector('thead')) {
    issues.push('Missing <thead>');
  }
  return { success: issues.length === 0, issues };
}

/* ---------------------------------------------------------------------------
 * 4️⃣  User management and UI helpers
 * --------------------------------------------------------------------------- */
class User {
  /**
   * @param {string} name User's name
   * @param {number} age User's age
   */
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  describe() {
    return `${this.name} is ${this.age} years old.`;
  }
}

/**
 * Creates an accessible button that runs the provided callback when clicked.
 * @param {string} label Button text.
 * @param {function} callback Function to run on click.
 * @returns {HTMLButtonElement}
 */
function createAccessibleButton(label, callback) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', () => {
    if (typeof callback === 'function') callback();
  });
  return button;
}

/**
 * Converts all links inside a container into buttons.
 * @param {HTMLElement} container Parent element containing <a> tags.
 * @param {string} [role='link'] Optional ARIA role for the buttons.
 */
function linkifyToButtons(container, role = 'link') {
  arrayFrom(container.querySelectorAll('a')).forEach(link => {
    const button = createAccessibleButton(link.textContent, () =>
      window.location.assign(link.href)
    );
    button.setAttribute('role', role);
    container.replaceChild(button, link);
  });
}

function arrayFrom(iterable) {
  return Array.prototype.slice.call(iterable);
}

/**
 * Creates a button that runs the global rotateBack function when clicked.
 * @returns {HTMLButtonElement}
 */
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';

  const rotateBackHandler = typeof rotateBack === 'function'
    ? rotateBack
    : () => console.warn('rotateBack is not defined');

  button.addEventListener('click', rotateBackHandler);
  return button;
}

/**
 * Replaces a fake link with the button created by createUnrotateButton.
 * @param {string} [selector='a[href="#"]'] CSS selector for the fake link.
 * @returns {void}
 */
function replaceFakeLinks(selector = 'a[href="#"]') {
  const fakeLink = document.querySelector(selector);
  if (!fakeLink || fakeLink.tagName !== 'A') return;

  const newButton = createUnrotateButton();
  fakeLink.parentElement.replaceChild(newButton, fakeLink);
}

/**
 * Ensures that the <html> element has a valid lang attribute.
 * @param {string} [lang='en-US'] Language code to set.
 */
function ensureHtmlLang(lang = 'en-US') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

/**
 * Initializes Screeps memory with a top-level users array if it does not
 * already exist.
 * @returns {void}
 */
function initMemory() {
  if (typeof Memory === 'undefined') return;
  if (!Array.isArray(Memory.users)) {
    Memory.users = [];
  }
}

/**
 * Logs values with a Screeps prefix.
 * @param {...any} args Values to log.
 */
function log(...args) {
  console.log('[Screeps]', ...args);
}

const alertMessage = (msg, type = 'info') => {
  console[type](msg);
};

// -------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------

module.exports = {
  config,
  appState,
  hello,
  getVersion,
  getConfig,
  calculateDifference,
  calculateProduct,
  isNumber,
  clamp,
  getUserLocale,
  focusElement,
  alertMessage,
  validateTableAccessibility,
  User,
  createAccessibleButton,
  linkifyToButtons,
  arrayFrom,
  createUnrotateButton,
  replaceFakeLinks,
  ensureHtmlLang,
  initMemory,
  log,
  document,
};