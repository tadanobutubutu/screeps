// Main module

const fs = require('fs');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
function validateAccessibilityReport(report) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    throw new Error('Accessibility report must be a valid object');
  }

  const issues = [];

  if (report.issues && Array.isArray(report.issues)) {
    for (const issue of report.issues) {
      issues.push(issue);
    }
  }

  if (report.missingLang) {
    issues.push({ code: 'REACT_015', message: 'Missing lang attribute on HTML element' });
  }

  if (report.missingAriaLabels) {
    issues.push({ code: 'REACT_025', message: 'Elements are missing aria-label attributes' });
  }

  return {
    valid: issues.length === 0,
    issues: issues,
    count: issues.length
  };
}

// Assuming 'addLangAttribute' is a function that has already been implemented
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    getLangAttribute();
  }
}
addLangAttribute();

function getLangAttribute() {
  const htmlElement = document.documentElement;
  let lang = htmlElement.getAttribute('lang');

  if (!lang) {
    lang = htmlElement.getAttribute('xml:lang');
  }

  if (!lang) {
    lang = 'en';
    htmlElement.setAttribute('lang', lang);
  }

  return lang;
}

function isLinkAccessible(link) {
  if (!link) {
    return false;
  }

  const tagName = link.tagName ? link.tagName.toUpperCase() : '';
  const role = link.getAttribute ? link.getAttribute('role') : null;
  const href = link.getAttribute ? link.getAttribute('href') : null;
  const text = link.textContent || '';
  const ariaLabel = link.getAttribute ? link.getAttribute('aria-label') : null;

  // Must be an anchor or have a link role
  if (tagName !== 'A' && role !== 'link') {
    return false;
  }

  // Must have a valid href (not missing, empty, or just a hash)
  if (!href || typeof href !== 'string' || href.trim() === '' || href.trim() === '#') {
    return false;
  }

  // Must not be a button disguised as a link
  if (role === 'button') {
    return false;
  }

  // Must have an accessible name
  const hasText = text.trim().length > 0;
  const hasAriaLabel = ariaLabel && ariaLabel.trim().length > 0;
  const hasAriaLabelledby = link.getAttribute ? !!link.getAttribute('aria-labelledby') : false;

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

/**
 * Ensures an element has an id attribute, generating one if necessary
 * @param {HTMLElement} element - The element to check
 * @param {string} [prefix] - Optional prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const generatedId = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = generatedId;
  return generatedId;
}

/**
 * Adds an aria-label to an element if one doesn't exist
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label text
 * @returns {HTMLElement} The modified element
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }

  return element;
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} container - The container element for the graph
 * @param {Object} dependencies - The dependency data to render
 * @returns {HTMLElement} The rendered graph element
 */
function renderDependencyGraph(container, dependencies = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const graphElement = document.createElement('div');
  graphElement.className = 'dependency-graph';
  graphElement.setAttribute('role', 'img');
  graphElement.setAttribute('aria-label', 'Dependency graph visualization');

  const nodes = dependencies.nodes || [];
  const edges = dependencies.edges || [];

  // Create SVG for graph rendering
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('aria-hidden', 'true');

  // Render edges
  edges.forEach((edge, index) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', edge.source?.x || 0);
    line.setAttribute('y1', edge.source?.y || 0);
    line.setAttribute('x2', edge.target?.x || 0);
    line.setAttribute('y2', edge.target?.y || 0);
    line.setAttribute('stroke', '#666');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('id', `edge-${index}`);
    svg.appendChild(line);
  });

  // Render nodes
  nodes.forEach((node, index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x || 0);
    circle.setAttribute('cy', node.y || 0);
    circle.setAttribute('r', node.size || 20);
    circle.setAttribute('fill', node.color || '#4A90E2');
    circle.setAttribute('id', `node-${index}`);

    const nodeId = ensureElementHasId(circle, 'graph-node');
    if (node.label) {
      addAriaLabel(circle, node.label);
    }

    svg.appendChild(circle);
  });

  graphElement.appendChild(svg);
  container.appendChild(graphElement);
  return graphElement;
}

// Original content from main.js
function existingFunction() {
  // existing code
}

// New function implementation as per the issue requirements
function personName() {
  // Implementation details go here
  // For example:
  return 'New function result';
}

function createInPageButton(options) {
  const {
    id,
    text,
    className = 'in-page-button',
    onClick,
    ariaLabel,
    lang
  } = options || {};

  if (!id || !text) {
    throw new Error('createInPageButton: "id" and "text" are required options.');
  }

  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.className = className;
  button.textContent = text;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else {
    button.setAttribute('aria-label', text);
  }

  if (lang) {
    button.setAttribute('lang', lang);
  }

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

module.exports = {
  // Existing exports
  getLangAttribute,
  createInPageButton,
  addLangAttribute,
  isLinkAccessible,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  existingFunction,
  personName,
  validateAccessibilityReport
};