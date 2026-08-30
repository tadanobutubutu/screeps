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
 * Renders the index view into the specified DOM element.
 * @param {HTMLElement} targetElement - The DOM element to render the view into.
 * @param {Object} options - Configuration options for the index view.
 * @param {string} [options.title='Index View'] - The title to display in the header.
 * @param {Array} [options.landmarks=[]] - Array of landmark data to display.
 * @param {Function} [options.onLandmarkClick=()=>{}] - Callback when a landmark is clicked.
 */
function renderIndexView(targetElement, options = {}) {
  const { title = 'Index View', landmarks = [], onLandmarkClick = () => {} } = options;

  if (!targetElement || !(targetElement instanceof HTMLElement)) {
    console.error('renderIndexView: Invalid target element provided');
    return;
  }

  const IndexView = () => {
    const [hoverState, setHoverState] = React.useState(false);

    return (
      <div className="index-view" role="main">
        <header role="banner">
          <h1>{title}</h1>
        </header>

        <nav role="navigation" aria-label="Main navigation">
          <ul>
            {landmarks.map((landmark, index) => (
              <li key={index}>
                {createInPageButton({
                  onClick: () => onLandmarkClick(landmark),
                  label: landmark.name || `Landmark ${index + 1}`,
                  icon: icons[landmark.type] || '📍',
                  hoverState,
                  setHoverState,
                  ariaLabel: landmark.ariaLabel || landmark.name,
                  title: landmark.title || landmark.name,
                })}
              </li>
            ))}
          </ul>
        </nav>

        <section role="region" aria-label="Content">
          <Landmark landmarks={processLandmarks(landmarks)} />
        </section>
      </div>
    );
  };

  ReactDOM.render(<IndexView />, targetElement);
}

module.exports = {
  processLandmarks,
  addLangAttribute,
  checkLandmarkElement,
  calculateSum,
  renderIndexView
};