const React = require('react');
const ReactDOM = require('react-dom');
const Landmark = require('./Landmark');

import './styles.css';
import { initializeApp, appData } from './app.js';
import { registerSW } from 'effector-sw';
import { appStarted } from './events/appStarted.js';

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

const icons = {};

function processLandmarks(landmarks) {
  const landmarkStructureCheck = (landmark) => {
    return true;
  };

  const validLandmarks = landmarks.filter(landmarkStructureCheck);

  const ensureUniqueLandmarks = (landmarks) => {
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
    htmlElement.setAttribute('lang', 'en');
  }
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function getLangAttribute(document) {
  const lang = document.documentElement?.lang || 'en';
  return lang;
}

function personName(person) {
  if (typeof person === 'string') {
    return person;
  }
  if (person.fullName) {
    return person.fullName;
  }
  if (person.firstName && person.lastName) {
    return `${person.firstName} ${person.lastName}`;
  }
  return person.name || '';
}

function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table.caption && !table.getAttribute('aria-label')) {
    issues.push('Table is missing a caption or aria-label');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function validateTableStructure(table) {
  const issues = [];
  const headers = table.querySelectorAll('th');
  
  for (const header of headers) {
    if (!header.getAttribute('scope') && !header.getAttribute('id')) {
      issues.push('TH element missing scope or id attribute');
    }
  }
  
  if (!table.querySelector('thead')) {
    issues.push('Table missing thead element');
  }
  if (!table.querySelector('tbody')) {
    issues.push('Table missing tbody element');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function getSvgAccessibleName(svgElement) {
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : '';
  }
  
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return '';
}

function validateLandmarkUniqueness(landmarks) {
  const issues = [];
  const seenLandmarks = new Map();
  
  for (const landmark of landmarks) {
    const key = `${landmark.role}-${landmark.name || landmark.id || 'unnamed'}`;
    
    if (seenLandmarks.has(key)) {
      issues.push(`Duplicate landmark found: ${key}`);
    } else {
      seenLandmarks.set(key, landmark);
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

function createInPageButtonFromLinkElement(linkElement) {
  if (!linkElement) return null;
  
  const tagName = linkElement.tagName.toLowerCase();
  const isFakeLink = tagName !== 'a' && tagName !== 'button' && linkElement.getAttribute('onclick');
  
  if (isFakeLink) {
    if (!linkElement.getAttribute('role') || linkElement.getAttribute('role') !== 'button') {
      linkElement.setAttribute('role', 'button');
    }
    
    if (linkElement.getAttribute('tabindex') === null) {
      linkElement.setAttribute('tabindex', '0');
    }
    
    const accessibleName = personName(linkElement.textContent || linkElement.getAttribute('aria-label') || 'Button');
    if (!linkElement.getAttribute('aria-label') && !linkElement.textContent?.trim()) {
      linkElement.setAttribute('aria-label', accessibleName);
    }
  }
  
  return linkElement;
}

module.exports = {
    landmarkStructureCheck,
    ensureUniqueLandmarks,
    getLangAttribute,
    addLangAttribute,
    checkLandmarkElement,
    personName,
    validateTableAccessibility,
    validateTableStructure,
    getSvgAccessibleName,
    validateLandmarkUniqueness,
    createInPageButton,
    createInPageButtonFromLinkElement
};