const utils = require('./utils');
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessiblyHelper');
const path = require('path');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  debug: true,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50,
  landmarks: ['main', 'nav', 'aside', 'footer', 'header']
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

let dependencyGraph = {};

function getLangAttribute() {
  //...
}

function validateTableAccessibility() {
  //...
}

function validateTableStructure() {
  //... // Single instance to avoid duplication
}

function getSvgAccessibleName() {
  //...
}

function setSvgAttributes() {
  //...
}

function checkLinkAccessibility(linkUrl) {
  //...
}

/**
 * New function added to address accessibility issues
 */
function setDependencyGraphAria() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('[data-dependency-graph]');

  if (dependencyGraph) {
    // Ensure the dependencyGraph container has a proper ARIA role
    // Address accessibility issues from insight report:
    // Ensure the dependencyGraph container has a proper ARIA role
    // (This comment remains as-is)
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

// Accessibility helper integration for dependency graphs
function enhanceDependencyGraphAccessibility(graphData) {
  if (!graphData || !graphData.visualization) {
    return graphData;
  }

  graphData.visualization.nodes = graphData.visualization.nodes.map(node => {
    const element = { id: node.id };
    ensureElementHasId(element);
    addAriaLabel(element, `Dependency: ${node.label}`);
    return {
      ...node,
      id: element.id,
      ariaLabel: element.getAttribute('aria-label')
    };
  });

  return graphData;
}

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

async function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    // Check for images without alt attributes
    const images = document.querySelectorAll('img');
    issues = [];
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index: index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index: index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for links without accessible names
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index: index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = document.querySelector(`label[for="${input.id}"]`);
        const hasLabel = input.getAttribute('aria-label') || labelId || labelText;
        if (!hasLabel) {
          issues.push({
            type: 'missing-label',
            element: 'input',
            index: index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    // Check for empty headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index: index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });
  } else {
    // If data is provided, use the analysis logic
    issues = await accessiblyHelper(issuesData);
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  return report;
}

function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: `User ${userId}` };
}

function clearCache() {
  appState.cache.clear();
}

// Exports
module.exports = {
  UserSafety,
  SafetyCategories,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  fetchUser,
  clearCache,
  config,
  appData,
  setDependencyGraphAria,
  enhanceDependencyGraphAccessibility,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  checkLinkAccessibility
};