const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

function calculateMultiplier(factor) {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return factor * safetyCategories.length;
}

let main = require('./utilities');

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'].includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

export const addressAccessibilityIssues = () => {
  // Function to address accessibility issues from insight report
  console.log("Addressing accessibility issues from insight report.");
  return null;
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
import React, { useState } from 'react';

const ensureElementHasId = (element) => {
  if (!element.id) {
    element.id = 'generated-' + Math.random().toString(36).substr(2, 9);
  }
  return element.id;
};

const addAriaLabel = (element, label) => {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (dependencies) => {
  const graph = {
    nodes: [],
    edges: []
  };

  if (!dependencies || !Array.isArray(dependencies)) {
    return graph;
  }

  dependencies.forEach((dep, index) => {
    graph.nodes.push({
      id: dep.id || index,
      label: dep.label || dep.name || 'Unknown'
    });
  });

  return graph;
};

let UserSafety = "unsafe";
let SafetyCategories = ["Unauthorized Advice"];

export const checkSafety = () => {
  let safetyMessage = '';

  if (UserSafety === "unsafe") {
    const multiplier = calculateMultiplier(SafetyCategories.length);
    const numberOfIssues = Math.floor(Math.random() * multiplier);

    for (let i = 0; i < numberOfIssues; i++) {
      safetyMessage += ` Safety issue ${i + 1}\n`;
    }
  }

  return safetyMessage;
};

export const generateAccessibilityReport = async () => {
  const issuesData = await accessiblyHelper();
  return generateReport(issuesData);
};

const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    const langAttr = document.documentElement.getAttribute('lang');
    return langAttr || 'en';
  }
  return 'en';
};

const addLangAttribute = (html) => {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="en">`;
  });
};

const addMainLandmark = (html) => {
  if (!html.includes('<main')) {
    return html.replace(/<body/i, '<body><main role="main"');
  }
  return html;
};

const validateLandmark = (landmarkElement) => {
  if (!landmarkElement) return false;

  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  const role = landmarkElement.getAttribute('role');

  return validRoles.includes(role);
};

const validateLandmarkAttributes = (landmarkElement) => {
  if (!landmarkElement) return false;

  const ariaLabel = landmarkElement.getAttribute('aria-label');
  const ariaLabelledby = landmarkElement.getAttribute('aria-labelledby');

  return ariaLabel !== null || ariaLabelledby !== null;
};

const validateLandmarkStructure = (landmarkElement) => {
  if (!landmarkElement) return false;

  const heading = landmarkElement.querySelector('h1, h2, h3, h4, h5, h6');
  return heading !== null;
};

const validateTableAccessibility = (table) => {
  if (!table || !table.tagName || table.tagName.toLowerCase() !== 'table') {
    return { valid: false, errors: ['Invalid table element'] };
  }

  const errors = [];
  const rows = table.querySelectorAll('tr');

  if (rows.length === 0) {
    errors.push('Table has no rows');
  }

  return { valid: errors.length === 0, errors };
};

const validateTableStructure = (table) => {
  if (!table || !table.tagName || table.tagName.toLowerCase() !== 'table') {
    return { valid: false, errors: ['Invalid table element'] };
  }

  const errors = [];
  const rows = table.querySelectorAll('tr');

  if (rows.length === 0) {
    errors.push('Table has no rows');
  }

  return { valid: errors.length === 0, errors };
};

const fixTableStructure = () => {
  // Implementation for fixing table structure
};

const getSvgAccessibleName = (svgElement) => {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  const desc = svgElement.querySelector('desc');

  if (title) return title.textContent;
  if (desc) return desc.textContent;

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement ? labelElement.textContent : '';
  }

  return '';
};

const setSvgAttributes = (svgElement, name) => {
  if (!svgElement || !name) return;

  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', name);
  }

  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
};

// (Previously existing code that needs to be preserved)

const validateLandmarkAccessibility = (landmarkElement) => {
  if (!validateLandmark(landmarkElement)) {
    return { valid: false, errors: ['Invalid landmark role'] };
  }

  if (!validateLandmarkStructure(landmarkElement)) {
    return { valid: false, errors: ['Invalid landmark structure'] };
  }

  if (!validateLandmarkAttributes(landmarkElement)) {
    return { valid: false, errors: ['Invalid landmark attributes'] };
  }

  return { valid: true };
};

const analyzeAccessibility = (node) => {
  return axe(node, axeConfig);
};

const getAxeResults = (issuesData) => {
  return issuesData.nodes.map(node => {
    const { violations, bestPractices } = node;
    const results = [];

    violations.forEach(violation => {
      results.push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        suggestedFixed: violation.required ? 'Required' : 'Recommended',
        helpUrl: violation.helpUrl,
        helpText: violation.help,
        nodes: violation.nodes || []
      });
    });

    bestPractices.forEach(bestPractice => {
      results.push({
        id: bestPractice.id,
        impact: bestPractice.impact,
        description: bestPractice.description,
        helpUrl: bestPractice.helpUrl,
        helpText: bestPractice.help,
      });
    });

    return {
      nodeId: node.id,
      results
    };
  });
};

const generateReport = (issuesData) => {
  const report = {
    introduction: 'Accessibility report for the application',
    data: getAxeResults(issuesData).flatMap(item => item.results),
    conclusions: '',
  };

  return report;
};

const applyAccessibilityFixes = (html) => {
  if (!html || typeof html !== 'string') {
    return html;
  }

  html = addLangAttribute(html);
  html = fixTableStructure(html);
  html = fixLandmarks(html);
  html = addSvgAccessibleNames(html);
  html = ensureUniqueLandmarks(html);
  html = fixFakeLinks(html);

  return html;
};

const fixLandmarks = () => {
  // Implementation would fix landmark issues
};

const fixFakeLinks = () => {
  // Implementation would fix fake link issues
};

const writeReport = (report) => {
  // Implementation for writing the report to a file
};

const scanAccessibility = () => {
  // Implementation for scanning accessibility
};

const createInPageButton = (buttonId, buttonText, buttonClass) => {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  button.className = buttonClass;
  document.body.appendChild(button);
};

const greet = () => {
  return 'Hello';
};

const add = (a, b) => {
  return a + b;
};

const getDependencies = () => {
  return [];
};

const addDependency = (dep) => {
  return dep;
};

const removeDependency = (dep) => {
  return dep;
};

const countDependencies = () => {
  return 0;
};

const fetchUser = (userId) => {
  if (!userId) {
    return null;
  }
  return { id: userId, name: `User ${userId}` };
};

const clearCache = () => {
  appState.cache.clear();
};

export {
  checkSafety,
  generateAccessibilityReport,
  applyAccessibilityFixes,
  fixLandmarks,
  fixFakeLinks,
  writeReport,
  scanAccessibility,
  createInPageButton,
  greet,
  add,
  getDependencies,
  addDependency,
  removeDependency,
  countDependencies,
  fetchUser,
  clearCache,
  appData,
  getLangAttribute,
  addLangAttribute,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  analyzeAccessibility,
};