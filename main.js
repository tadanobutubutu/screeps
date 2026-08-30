const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

// Function to create in-page buttons
const createInPageButton = (options: {
  onClick: () => void;
  label: string;
  icon: string;
  disabled?: boolean;
  isActive?: boolean;
  hoverState: boolean;
  setHoverState: (value: boolean) => void;
  ariaLabel?: string;
  title?: string;
}) => {
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
};

// Placeholder for the affected SVGs
const icons = {};

function processLandmarks(landmarks) {
  // Ensure all landmarks have valid structure
  const landmarkStructureCheck = (landmark) => {
    // Check landmark properties here
    // ...
    return true; // Add your own check logic
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  // Ensure the landmarks are unique
  const ensureUniqueLandmarks = (landmarks) => {
    // Add your own unique landmark logic here
    // ...
    return landmarks;
  };

  return ensureUniqueLandmarks(validLandmarks);
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

/**
 * Calculates the sum of an array of numbers.
 * @param {number[]} numbers - The array of numbers to sum.
 * @returns {number} The total sum of the numbers.
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Counts the number of dependencies imported in the current module.
 * It scans the module's source code for `require(...)` and `import ...` statements.
 * @param {string} [source] - Optional source code string. Defaults to the current module's source.
 * @returns {number} The total count of dependencies.
 */
function countDependencies(source) {
  const code = typeof source === 'string' ? source : require('fs').readFileSync(__filename, 'utf8');

  // Match CommonJS require() calls (single-line)
  const requireMatches = code.match(/require\(['"][^'"]+['"]\)/g) || [];

  // Match ES module import statements (single-line and multi-line)
  const importMatches = code.match(/^\s*import\s.+?from\s+['"][^'"]+['"];?/gm) || [];

  // Also match side-effect imports like import './styles.css';
  const sideEffectImports = code.match(/^\s*import\s+['"][^'"]+['"];?/gm) || [];

  // Combine and deduplicate based on the module specifier
  const seen = new Set();

  requireMatches.forEach((match) => {
    const specifier = match.match(/require\(['"]([^'"]+)['"]\)/);
    if (specifier) seen.add(specifier[1]);
  });

  importMatches.forEach((match) => {
    const specifier = match.match(/from\s+['"]([^'"]+)['"]/);
    if (specifier) {
      seen.add(specifier[1]);
    } else {
      const sideEffect = match.match(/import\s+['"]([^'"]+)['"]/);
      if (sideEffect) seen.add(sideEffect[1]);
    }
  });

  sideEffectImports.forEach((match) => {
    const specifier = match.match(/import\s+['"]([^'"]+)['"]/);
    if (specifier) seen.add(specifier[1]);
  });

  return seen.size;
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  countDependencies
};