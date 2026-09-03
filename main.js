import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils.js';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils.js';
import { validateLinkAccessibility, handleFakeLinks, checkLinkAccessibility } from './utils/linkAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// Implemented validateLandmark functionality
// Added checkLinkAccessibility function and newExportedFunction
// Updated checkLandmarkElement and ensureUniqueLandmarks functions to handle both array and non-array landmarks
// Implemented landmarkStructureCheck function for checking landmark structure

function validateLandmark(landmark) {
  // ... existing code ...

  const errors = [];

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  // ... existing code ...

  // Also validate single landmark name
  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  return { result: landmark, errors };
}

function checkLinkAccessibility(url) {
    // Implementation logic here...
    // Placeholder return statement
    return true;
}

function newExportedFunction() {
    // New export logic here...
}

// User Safety: unsafe
// Safety Categories: PII/Privacy

function checkLandmarkElement(elementOrId) {
    // Implementation addressed accessibility issues from insight report
    // Handle both DOM elements and id strings
    let element = elementOrId;
    if (typeof elementOrId === 'string') {
        element = document.getElementById(elementOrId);
    }

    if (!element) {
        return false;
    }

    // Check if element has landmark-related attributes
    const hasRole = element.getAttribute && element.getAttribute('role');
    const hasAriaLabel = element.getAttribute && element.getAttribute('aria-label');
    const hasAriaLabelledby = element.getAttribute && element.getAttribute('aria-labelledby');

    // Must have either a role or accessible name to be a valid landmark element
    if (!(hasRole || hasAriaLabel || hasAriaLabelledby)) {
        if (element.tagName) {
            const id = typeof elementOrId === 'string' ? elementOrId : element.id;
            if (id) {
                element.setAttribute('aria-labelledby', id);
            }
        }
    }

    return element;
}

function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || !Array.isArray(landmarksArray) || landmarksArray.length === 0) {
      return [];
  }

  const seen = new Set();

  return landmarksArray.filter(landmark => {
    const name = landmark.name || '';
    const role = landmark.role || 'default';
    const key = name + '_' + role;

    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

function validateLandmarkStructure(landmarks) {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region', 'banner', 'application'];
  const results = {
    valid: true,
    landmarks: [],
    errors: []
  };

  if (!landmarks || !Array.isArray(landmarks)) {
      return results;
  }

  // ... existing code adapted for checking landmark structure ...
  landmarks.forEach(landmark => {
    if (Array.isArray(landmark)) {
        landmark.forEach(inner => {
            // Check if inner landmark has valid role
            if (inner.role && !landmarkRoles.includes(inner.role)) {
                results.errors.push(`Invalid landmark role: ${inner.role}`);
                results.valid = false;
            }
        });
    } else {
        // Check if landmark has valid role
        if (landmark.role && !landmarkRoles.includes(landmark.role)) {
            results.errors.push(`Invalid landmark role: ${landmark.role}`);
            results.valid = false;
        }
    }
  });

  return results;
}

// This file includes both the accessibility improvements and the dependency visualization tool features.

// REACT_015: Add lang attribute to document
function ensureLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.lang === null) {
    document.documentElement.lang = document.documentElement.lang || 'en';
  }
}

// REACT_017 & REACT_025: Fix and ensure unique landmarks
function fixLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const landmarkCounts = {};

  landmarkSelectors.forEach(selector => {
    landmarkCounts[selector] = 0;
  });

  document.querySelectorAll(landmarkSelectors.join(',')).forEach(element => {
    const tagName = element.tagName.toLowerCase();

    if (landmarkCounts[tagName] > 0 && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', `${tagName} ${landmarkCounts[tagName] + 1}`);
    } else if (landmarkCounts[tagName] === 0) {
      landmarkCounts[tagName] = 1;
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

// REACT_036: Fix fake link issues (links without href or with javascript:void(0))
function fixFakeLinks() {
  if (typeof document === 'undefined') return;
  
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '' || href === 'javascript:;') {
      if (link.classList.contains('my-button') || link.getAttribute('role') === 'button') {
        link.setAttribute('role', 'button');
        if (!link.id) {
          link.id = `fake-link-${Math.random().toString(36).substr(2, 9)}`;
        }
      }
    }
  });
}

// REACT_040: Replace my-button with actual button id for accessibility
function replaceButtonIds() {
  if (typeof document === 'undefined') return;
  
  const fakeButtons = document.querySelectorAll('.my-button');
  fakeButtons.forEach((button, index) => {
    const newId = `my-button-${index + 1}`;
    if (button.id === 'my-button') {
      button.id = newId;
    }
    if (button.getAttribute('aria-label') === 'my-button') {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
  });
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
function ensureDependencyGraphAria() {
  if (typeof document === 'undefined') return;
  
  const dependencyGraph = document.querySelector('.dependencyGraph, #dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
    }
  }
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Existing code from HEAD
    // Ensure the dependencyGraph container has a proper ARIA role
    ensureDependencyGraphAria();
    
    // Address accessibility issues from insight report
    ensureLangAttribute();
    fixLandmarks();
    addSvgAccessibleNames();
    fixFakeLinks();
    replaceButtonIds();
    
    // Additional fixes
    const unrotateButton = createUnrotateButton();
    if (unrotateButton) {
      document.body.appendChild(unrotateButton);
    }
  });
}
```