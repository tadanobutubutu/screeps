import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

// Helper to get full language attribute
function getFullLangAttribute() {
  return getLangAttribute();
}

// Table accessibility validators
function validateTableAccessibility() {
  const tbElements = document.querySelectorAll('table tbody');
  let valid = true;
  for (const tbody of tbElements) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length === 0) {
      console.warn('Table tbody is empty');
      valid = false;
    } else if (!rows.some(row => row.hasAttribute('th'))) {
      console.warn('Table tbody lacks header row');
      valid = false;
    }
  }
  return valid;
}

function validateTableStructure() {
  const tbs = document.querySelectorAll('table tbody');
  let valid = true;
  for (const tbody of tbs) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.some(row => row.querySelector('table'))) {
      console.warn('Nested table found inside tbody');
      valid = false;
    }
  }
  return valid;
}

// Landmark accessibility validators
function validateLandmark() {
  const svgs = document.querySelectorAll('svg');
  for (const svg of svgs) {
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      const parent = svg.parentNode;
      const label = parent?.querySelector('[role="img"], [alt]')?.textContent || '';
      if (label) {
        svg.setAttribute('aria-labelledby', label);
      } else {
        const id = 'svg-' + Math.random().toString(36).substr(2, 9);
        svg.setAttribute('id', id);
        svg.setAttribute('aria-labelledby', id);
      }
    }
  }
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="img"], [role="presentation"], [role="alert"]');
  const ids = [...landmarks.map(l => l.id)].filter(id => id !== undefined);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) {
      console.error(`Duplicate landmark ID: ${id}`);
      return false;
    }
    seen.add(id);
  }
  return true;
}

function ensureUniqueLandmarks() {
  const landmarkEls = document.querySelectorAll('[role="img"], [role="presentation"]');
  const ids = new Set();
  for (const el of landmarkEls) {
    const id = el.id || 'unknown';
    if (ids.has(id)) {
      console.warn(`Duplicate landmark ID: ${id}`);
      return false;
    }
    ids.add(id);
  }
  return true;
}

// SVG accessibility helpers
function getSvgAccessibleName(svg) {
  const text = svg.textContent.trim();
  if (text) return text;
  const title = svg.getAttribute('title');
  return title || 'SVG without accessible name';
}

function createAccessibleLink(text, href) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  link.setAttribute('aria-label', text);
  return link;
}

// Main accessibility remediation function
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root').parentElement;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.querySelector('[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
  });

  a11y.trapFocus(document.getElementById('modal')); // Assuming a modal