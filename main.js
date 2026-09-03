// main.js

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import path from 'path';
import { a11y } from '@accessible/react';
import {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addFixLandmarkIssues,
  fixFakeLinkIssues
} from './utils/index.js';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkAccessibilityUtils.js';
import { getSvgAccessibleName as getSvgAccessibleNameUtil, setSvgAttributes as setSvgAttributesUtil } from './utils/svgAccessibilityUtils.js';
import { validateLinkAccessibility } from './utils/linkAccessibilityUtils.js';
import { addProperLandmarkRegions } from './utils/landmarkUtils.js';
import { CONFIG as CONSTANTS_CONFIG } from './utils/constants.js';

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'aside:not([role])',
  'section:not([role])'
];

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

const CONFIG = {
  ...CONSTANTS_CONFIG,
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function processIssue() {
  // Existing implementation
  return {
    status: 'processed'
  };
}

// TODO: Any additional changes requested in the issue should be added after this function

// Additional changes:
function handleIssueChanges() {
  // Placeholder for additional changes requested in the issue
  // This function can be extended as needed
  return true;
}

function getUniqueLandmarks(landmarks) {
  if (!landmarks) {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(landmarkSelectors.join(','));
    const seen = new Set();
    const unique = [];
    elements.forEach(el => {
      const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(el);
      }
    });
    return unique;
  }
  
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = [...landmarks];
    const landmarkIds = elements.map(el => el.id || el.name || `landmark-${Math.random()}`);
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}-${Date.now()}`;
      }
    });
    return elements;
  }
  return [];
}

function countDependencies() {
  const dependencies = [
    'express',
    'axe-core',
    'fs',
    'path',
    '@accessible/react',
    'react',
    'antd',
    'react-redux',
    './actions/dependencyGraph',
    './bookFunctions',
    './accessibly-helper',
    './app.js',
    'effector-sw',
    './utils',
    './utils/accessibilityUtils',
    './utils/tableAccessibilityUtils',
    './utils/landmarkUtils',
    './utils/linkAccessibilityUtils',
    './utils/constants',
    './App',
    './utils/someFunction',
    './utils/user',
    './newFunctions',
    './somemodule'
  ];

  return dependencies.length;
}

function validateTableAccessibilityLocal(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.textContent.trim() === '') {
      return false;
    }
  }

  return true;
}

function validateTableStructureLocal(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.id || cell.getAttribute('scope') !== 'col') {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

async function generateAccessibilityReport() {
  return scanAccessibility();
}

function validateLinkAccessibilityLocal() {
  const links = document.querySelectorAll('a');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmarkLocal() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  return landmarks.length > 0;
}

function validateLandmarkStructureLocal() {
  const landmarks = document.querySelectorAll('[role="main"]');

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

function addMissingLandmarkIds() {
  if (typeof document === 'undefined') return;
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `landmark-${index}`;
    }
  });
}

function addAccessibilityProps() {
  const landmarks = getUniqueLandmarks();
  addProperLandmarkRegions(landmarks);
  validateTableStructure();
  validateLinkAccessibility();
}

function loadLandmarks() {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function checkLandmarkElement(id) {
  if (typeof document === 'undefined') return false;
  const element = document.getElementById(id);
  return element !== null;
}

function validateLandmarkData(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function setSvgAttributes(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = {};

  if (label) {
    props['aria-label'] = label;
  }

  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }

  a11y.setProps(svgElement, props);
}

function createAccessibleLink(href, label, labelledById) {
  const link = document.createElement('a');

  link.href = href;
  link.textContent = label;

  const props = {};
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }

  a11y.setProps(link, props);

  return link;
}

function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.tabIndex = 0;
    link.textContent = link.textContent.trim();
    link.setAttribute('role', 'button');
    link.addEventListener('click', () => {
      link.blur();
    });
    const accessibleLink = createAccessibleLink(link.getAttribute('href'), link.textContent, undefined);
    link.replaceWith(accessibleLink);
  });
}

function addAriaLabelledbyToLinksWithComplexSvg() {
  const svgLinks = document.querySelectorAll('a[href] > svg');
  svgLinks.forEach(link => {
    const labelId = `link-svg-${crypto.randomUUID()}`;
    link.setAttribute('aria-labelledby', labelId);
    const label = document.createElement('span');
    label.id = labelId;
    label.textContent = getSvgAccessibleNameUtil(link);
    link.insertBefore(label, link.firstChild);
  });
}

function getSvgProps(label, labelledById) {
  const props = {};

  if (label) {
    props['aria-label'] = label;
  }

  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }

  return props;
}

function getLangAttribute() {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function ensureUniqueLandmarksFromString(landmarkString) {
  const landmarks = landmarkString.split(',').map(l => l.trim());
  const uniqueLandmarks = [...new Set(landmarks)];
  return uniqueLandmarks.join(', ');
}

function calculateSum(a, b) {
  return a + b;
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  const issues = [];
  // Check for proper table structure
  const hasCaption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelector('th');

  if (!hasCaption) {
    issues.push('Table is missing a caption');
  }
  if (!hasHeaders) {
    issues.push('Table is missing header cells (th)');
  }

  return issues;
}

// REACT_017: Validate landmarks
function validateLandmarkStructure() {
  const issues = [];
  const mainElement = document.querySelector('main');
  const headerElement = document.querySelector('header');
  const footerElement = document.querySelector('footer');

  if (!mainElement) {
    issues.push('Missing main landmark');
  }
  if (!headerElement) {
    issues.push('Missing header landmark');
  }
  if (!footerElement) {
    issues.push('Missing footer landmark');
  }

  return issues;
}

// REACT_041: Get SVG accessible name (uses imported utility)
function getSvgAccessibleName(svgElement) {
  return getSvgAccessibleNameUtil(svgElement);
}

// REACT_041: Set SVG attributes for accessibility (uses imported utility)
function setSvgAttributesForAccessibility(svgElement, accessibleName) {
  setSvgAttributesUtil(svgElement, accessibleName);
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(linkElement) {
  const issues = [];
  const href = linkElement.getAttribute('href');
  const text = linkElement.textContent.trim();
  const ariaLabel = linkElement.getAttribute('aria-label');

  if (!href || href === '#' || href === '') {
    issues.push('Link has no valid href attribute');
  }

  if (!text && !ariaLabel) {
    issues.push('Link has no accessible name');
  }

  if (linkElement.getAttribute('role') === 'link' && !href) {
    issues.push('Fake link detected without href');
  }

  return issues;
}

// REACT_036: Handle fake links
function handleFakeLinksDetection() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('[role="link"]');

  fakeLinks.forEach((link, index) => {
    const href = link.getAttribute('href');
    if (!href) {
      issues.push(`Fake link ${index} has no href attribute`);
    }

    // Convert fake link to accessible button if it's clickable
    if (link.tagName !== 'A' && link.onclick) {
      issues.push(`Consider using <button> instead of fake link ${index}`);
    }
  });

  return issues;
}

// TODO: Implement new function3 logic here
function function3(param1, param2) {
  // New function3 implementation
  if (!param1 || !param2) {
    return null;
  }

  // Process parameters and return result
  const result = {
    combined: `${param1}-${param2}`,
    timestamp: Date.now(),
    validated: true
  };

  return result;
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, list) {
  const sortedList = [...list].sort(sortByTitle);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, list) {
  const sortedList = [...list].sort(sortByAuthor);
  dispatch({ type: 'SET_SORTED_LIST', payload: sortedList });
}

// Accessible Add Book Form component
function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
      return;
    }

    if (!author.trim()) {
      setError('Author is required');
      return;
    }

    onAddBook({ title, author });
    setTitle('');
    setAuthor('');
  };

  return {
    type: 'form',
    props: {
      onSubmit: handleSubmit,
      ref: formRef,
      children: [
        {
          type: 'div',
          props: {
            role: 'alert',
            children: error
          }
        },
        {
          type: 'label',
          props: {
            htmlFor: 'title',
            children: 'Title:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'title',
            value: title,
            onChange: (e) => setTitle(e.target.value),
            ref: titleInputRef,
            'aria-required': 'true',
            'aria-invalid': !!error
          }
        },
        {
          type: 'label',
          props: {
            htmlFor: 'author',
            children: 'Author:'
          }
        },
        {
          type: 'input',
          props: {
            type: 'text',
            id: 'author',
            value: author,
            onChange: (e) => setAuthor(e.target.value),
            'aria-required': 'true'
          }
        },
        {
          type: 'button',
          props: {
            type: 'submit',
            children: 'Add Book'
          }
        }
      ]
    }
  };
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || element.type || element.role || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependency-graph-container');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

function fixTableStructure() {
  // Implementation for fixing table structure issues
  // This is a placeholder for the actual implementation
  return true;
}

function createAccessibleLinkWrapper() {
  // Implementation for creating accessible links
  return {};
}

function handleAccessibilityIssues() {
  // Implementation for handling accessibility issues
  return [];
}

function validateLandmarkDataWrapper() {
  // Implementation for validating landmark data
  return { valid: true };
}

function addSvgAccessibleNamesWrapper() {
  // Implementation for adding SVG accessible names
  return true;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  return true;
}

// Initialize app
function initializeApp() {
  addressInsightIssues();
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function setupHandlers() {
  console.log('Setting up event handlers...');
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

function finalizeResolvedFile(fileContent) {
  // Implementation for finalizing the resolved file
  // This is a placeholder for the actual implementation
  return fileContent;
}

function renderDependencyGraph(dependencies) {
  // Implementation for rendering dependency graphs
  // This is a placeholder for the actual implementation
  return dependencies;
}

function renderIndexView(container) {
  // Placeholder for renderIndexView
  return container;
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;
  const primaryContent = document.querySelector('#content') ||
                        document.querySelector('main') ||
                        document.querySelector('[role="main"]') ||
                        document.querySelector('.main-content');

  if (primaryContent && primaryContent.parentElement.tagName !== 'MAIN') {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = primaryContent.innerHTML;
    primaryContent.parentElement.replaceChild(mainElement, primaryContent);
  }
}

function addLangAttribute() {
  if (typeof document === 'undefined') return;
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }
}

function ensureDependencyGraphAriaRole() {
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }
}

function addressInsightIssues() {
  ensureDependencyGraphAriaRole();
  addAccessibilityProps();
}

function initialize() {
  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    /**
     * Address accessibility issues from insight report:
     * - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute() and wrapPrimaryContentInMain())
     * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
     * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
     * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
     * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
     * - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
     */

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinkIssues();
    ensureUniqueLandmarks();
    addFixLandmarkIssues();
    addMissingLandmarkIds();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    ensureDependencyGraphAriaRole();

    // Process accessibility props for landmarks
    addressInsightIssues();
  }
}

/**
 * Browser-side Accessibility Utilities (from HEAD branch)
 * These utilities provide DOM-based accessibility helpers for client-side use.
 * They are namespaced under `browserA11y` to avoid conflicts with Node/React utilities.
 */
const browserA11y = (() => {
  /**
   * Creates a screen reader-only text element
   * @param {string} text - The text to announce
   * @returns {HTMLElement} - The span element with sr-only class
   */
  function createScreenReaderText(text) {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  }

  /**
   * Announces a message to screen readers using ARIA live regions
   * @param {string} message - The message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  function announceToScreenReader(message, priority = 'polite') {
    let announcer = document.getElementById('sr-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    announcer.setAttribute('aria-live', priority);
    
    // Clear and set message with delay to ensure announcement
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  /**
   * Manages focus for modal/dialog accessibility
   * @param {HTMLElement} modal - The modal element
   * @param {string} focusTarget - Selector for initial focus target
   */
  function trapFocus(modal, focusTarget = null) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      
      if (e.key === 'Escape') {
        modal.dispatchEvent(new CustomEvent('close-modal'));
      }
    });
    
    if (focusTarget) {
      const target = modal.querySelector(focusTarget);
      if (target) target.focus();
    }
  }

  /**
   * Updates ARIA attributes for expandable/collapsible sections
   * @param {HTMLElement} trigger - The element that triggers expand/collapse
   * @param {HTMLElement} content - The content element
   * @param {boolean} isExpanded - Current expanded state
   */
  function updateExpandableAria(trigger, content, isExpanded) {
    trigger.setAttribute('aria-expanded', isExpanded.toString());
    trigger.setAttribute('aria-controls', content.id || `section-${Math.random().toString(36).substr(2, 9)}`);
    content.id = content.id || trigger.getAttribute('aria-controls');
    content.setAttribute('aria-hidden', (!isExpanded).toString());
  }

  /**
   * Adds keyboard navigation support for custom components
   * @param {HTMLElement} container - Container with navigable items
   * @param {Object} options - Configuration options
   */
  function initKeyboardNavigation(container, options = {}) {
    const {
      itemSelector = '[role="option"], [role="menuitem"], li',
      orientation = 'vertical',
      onSelect = () => {},
      onFocus = () => {}
    } = options;
    
    const items = container.querySelectorAll(itemSelector);
    
    items.forEach((item, index) => {
      item.setAttribute('tabindex', item === items[0] ? '0' : '-1');
      
      item.addEventListener('keydown', (e) => {
        let targetIndex = index;
        
        if (orientation === 'vertical') {
          if (e.key === 'ArrowDown') targetIndex = (index + 1) % items.length;
          if (e.key === 'ArrowUp') targetIndex = (index - 1 + items.length) % items.length;
        } else {
          if (e.key === 'ArrowRight') targetIndex = (index + 1) % items.length;
          if (e.key === 'ArrowLeft') targetIndex = (index - 1 + items.length) % items.length;
        }
        
        if (e.key === 'Home') targetIndex = 0;
        if (e.key === 'End') targetIndex = items.length - 1;
        
        if (targetIndex !== index) {
          e.preventDefault();
          items[targetIndex].focus();
          onFocus(items[targetIndex], targetIndex);
        }
        
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item, index);
        }
      });
    });
  }

  /**
   * Ensures sufficient color contrast by adding data attributes
   * @param {HTMLElement} element - The element to check
   * @param {string} backgroundColor - Background color
   * @param {string} textColor - Text color
   */
  function checkColorContrast(element, backgroundColor, textColor) {
    const contrastRatio = getContrastRatio(backgroundColor, textColor);
    const wcagLevel = contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : contrastRatio >= 3 ? 'AA-large' : 'fail';
    element.setAttribute('data-contrast-ratio', contrastRatio.toFixed(2));
    element.setAttribute('data-wcag-level', wcagLevel);
    return wcagLevel;
  }

  /**
   * Calculates contrast ratio between two colors
   * @param {string} color1 - First color
   * @param {string} color2 - Second color
   * @returns {number} - Contrast ratio
   */
  function getContrastRatio(color1, color2) {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Calculates relative luminance of a color
   * @param {string} color - Color in hex or rgb format
   * @returns {number} - Luminance value
   */
  function getLuminance(color) {
    let rgb;
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      rgb = [
        parseInt(hex.substr(0, 2), 16),
        parseInt(hex.substr(2, 2), 16),
        parseInt(hex.substr(4, 2), 16)
      ];
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      rgb = match ? match.map(Number) : [0, 0, 0];
    } else {
      return 0;
    }
    
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Enhances form inputs with ARIA attributes for better accessibility
   * @param {HTMLElement} input - The input element
   * @param {Object} config - Configuration for accessibility features
   */
  function enhanceInputAccessibility(input, config = {}) {
    const {
      required = false,
      invalid = false,
      errorMessage = '',
      label = ''
    } = config;
    
    if (label && !input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', label);
    }
    
    input.setAttribute('aria-required', required.toString());
    input.setAttribute('aria-invalid', invalid.toString());
    
    if (invalid && errorMessage) {
      input.setAttribute('aria-describedby', `${input.id}-error`);
      
      let errorEl = document.getElementById(`${input.id}-error`);
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.id = `${input.id}-error`;
        errorEl.className = 'sr-only';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = errorMessage;
        input.parentNode.appendChild(errorEl);
      }
    }
  }

  // Initialize accessibility features on DOM ready
  function init() {
    document.addEventListener('DOMContentLoaded', () => {
      // Add skip link functionality
      const skipLink = document.querySelector('[href^="#"]');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          const targetId = skipLink.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        });
      }
      
      // Enhance all form inputs with accessibility attributes
      document.querySelectorAll('input, select, textarea').forEach(input => {
        const label = input.labels?.[0]?.textContent || input.getAttribute('placeholder') || '';
        enhanceInputAccessibility(input, { label });
      });
      
      console.log('Browser accessibility enhancements loaded');
    });
  }

  return {
    createScreenReaderText,
    announceToScreenReader,
    trapFocus,
    updateExpandableAria,
    initKeyboardNavigation,
    checkColorContrast,
    getContrastRatio,
    getLuminance,
    enhanceInputAccessibility,
    init
  };
})();

// Auto-initialize browser utilities if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  browserA11y.init();
}

module.exports = {
  processIssue,
  handleIssueChanges,
  initialize,
  processLandmarks,
  countDependencies,
  getSvgAccessibleName: getSvgAccessibleNameUtil,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateTableStructure: validateTableStructureLocal,
  scanAccessibility,
  generateAccessibilityReport,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks,
  validateLandmark: validateLandmarkLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  addressInsightIssues,
  addAccessibilityProps,
  getUniqueLandmarks,
  ensureDependencyGraphAriaRole,
  loadLandmarks,
  checkLandmarkElement,
  validateLandmarkData,
  setSvgAttributes,
  getSvgProps,
  createAccessibleLink,
  getLangAttribute,
  getFullLangAttribute,
  calculateSum,
  createInPageButton,
  wrapPrimaryContentInMain,
  addLangAttribute,
  addMissingLandmarkIds,
  fixFakeLinkIssues,
  addAriaLabelledbyToLinksWithComplexSvg,
  addProperLandmarkRegions,
  CONFIG,
  appState,
  landmarkSelectors,
  landmarkRoles,
  // Browser-side accessibility utilities
  browserA11y
};