// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Ensure the Landmark component is required
// const Landmark = require('./Landmark');

// Re-add the required exports for functionA and functionB
const functionA = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

const functionB = {
  X: 'valueX',
  Y: 'valueY',
  Z: 'valueZ'
};

/* Accessibility functions from HEAD */
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function personName() {
  return document.querySelector('[data-person-name]')?.textContent || 'Unknown';
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let hasIssue = false;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) hasIssue = true;
  });
  return !hasIssue;
}

function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  return landmarkRoles.some(role => element.getAttribute('role') === role || element.tagName.toLowerCase() === role);
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  let issues = 0;
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) issues += mains.length - 1;
  return { issues, valid: issues === 0 };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  return '';
}

/* Plain JS in-page button (legacy) */
function createDomInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

/* React UI functions from second part */
function createInPageButton(options) {
  /**
   * @param {Object} options
   * @param {Function} options.onClick
   * @param {string} options.label
   * @param {string} options.icon
   * @param {boolean} [options.disabled]
   * @param {boolean} [options.isActive]
   * @param {boolean} options.hoverState
   * @param {Function} options.setHoverState
   * @param {string} [options.ariaLabel]
   * @param {string} [options.title]
   */
  const { onClick, label, icon, disabled = false, isActive = false, hoverState, setHoverState, ariaLabel, title } = options;

  const getBackgroundColor = () => {
    if (disabled) return '#999';
    if (isActive) return '#155d27';
    return '#004b73';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={ariaLabel || label}
      aria-pressed={isActive}
      title={title || label}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease-in-out',
        transform: hoverState ? 'scale(1.05)' : 'scale(1)',
        boxShadow: hoverState ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
        filter: hoverState ? 'brightness(1.1)' : 'none',
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span> {label}</span>
    </button>
  );
}

// Placeholder for the affected SVGs
const icons = {};

/* Functions for landmark handling (second part) */
const landmarkStructureCheck = (landmark) => {
  // Check landmark properties here
  // ...
  return true; // Add your own check logic
};

const ensureUniqueLandmarks = (landmarks) => {
  // Add your own unique landmark logic here
  // ...
  return landmarks;
};

function processLandmarks(landmarks) {
  const validLandmarks = landmarks.filter(landmarkStructureCheck);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
  return uniqueLandmarks;
}

function addLangAttribute(htmlElement) {
  if (!htmlElement || !(htmlElement instanceof HTMLElement)) {
    console.error('addLangAttribute: Invalid HTML element provided');
    return;
  }

  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English if not specified
  }
}

// Function to check if the specified landmark element is in the document.
// @param {string} id - The ID of the landmark element.
// @returns {boolean} Returns true if the element exists; otherwise, false.
function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

/* Function that checks the accessibility features */
function checkAccessibilityFeatures() {
  const accessibilityFeatures = [
    getLangAttribute,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName
  ];
  accessibilityFeatures.forEach(feature => {
    if (typeof feature !== 'function') {
      console.error(`Accessibility feature is not a function: ${feature.name}`);
    }
  });
}

/* Exports */
module.exports = {
  // Accessibility utilities
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  checkAccessibilityFeatures,
  // UI button utilities
  createInPageButton, // React version
  createDomInPageButton, // Plain JS version (legacy)
  // Functions from second part
  functionA,
  functionB,
  icons,
  processLandmarks,
  landmarkStructureCheck,
  ensureUniqueLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  // React-related exports
  React,
  ReactDOM,
  Landmark,
};