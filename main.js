const utils = require('./utils');
const express = require('express');
const path = require('path');
const fs = require('fs');

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axe from 'axe-core';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

function createInPageButton(buttonText, onClickHandler) {
  //...
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function function3() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');

  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', 'en');
  }
  return getLangAttribute();
}

function greet(name) {
    return `Hello, ${name}!`;
}

function add(a, b) {
    return a + b;
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

const processData = (data) => {
    return data;
};

const formatResponse = (response) => {
    return response;
};

function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function validateLandmark(landmark) {
  if (!landmark) return false;
  if (landmark.id == null || landmark.id === '') return false;
  return true;
}

function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  const hasId = landmark.id != null && typeof landmark.id === 'string';
  const hasName = landmark.name != null && typeof landmark.name === 'string';
  const hasDescription = landmark.description != null && typeof landmark.description === 'string';
  return hasId && hasName && hasDescription;
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

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const validLandmarks = landmarks.filter(validateLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function getLandmarkById(id, landmarks) {
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const seenIds = new Set();
    return landmarks.filter(landmark => {
        if (seenIds.has(landmark.id)) {
            return false;
        }
        seenIds.add(landmark.id);
        return true;
    });
}

function addFixLandmarkIssues(landmarks) {
  const seenIds = new Set();
  const fixedLandmarks = [];
  const duplicates = [];

  for (const landmark of landmarks) {
    if (seenIds.has(landmark.id)) {
      duplicates.push(landmark);
    } else {
      seenIds.add(landmark.id);
      fixedLandmarks.push(landmark);
    }
  }

  return { fixedLandmarks, duplicates };
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;
  
  const rows = tableElement.querySelectorAll('tr');
  let validStructure = true;

  rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        validStructure = false;
      }
  });

  return validStructure;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  const hasHeader = tableElement.querySelector('th') !== null;
  const hasBody = tableElement.querySelector('td') !== null;
  return hasHeader && hasBody;
}

function validateLinkAccessibility(linkUrl) {
  //...
}

function checkLinkAccessibility(linkUrl) {
  //...
}

function getSvgAccessibleName(svg) {
  return svg && svg.title ? svg.title : 'Accessible SVG';
}

function setSvgAttributes(svg) {
  //...
}

function addressAccessibilityIssues() {
  return true;
}

function ensureUniqueLandmarksDom() {
  // Implementation for ensuring unique landmarks in the DOM
}

function addressNewAccessibilityIssues(issues) {
  if (!issues || !Array.isArray(issues)) {
      return [];
  }

  return issues.map(issue => {
      return {
          id: issue.id,
          description: issue.description,
          severity: issue.severity,
          status: 'addressed',
          addressedAt: new Date().toISOString()
      };
  });
}

const filterIssuesByRules = (violations, allowedRules) => {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
};

function generateReportSummary(issues) {
    const summary = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    };

    issues.forEach(issue => {
        const impact = issue.impact || 'minor';
        if (summary.hasOwnProperty(impact)) {
            summary[impact]++;
        }
    });

    return summary;
}

function writeReport(report) {
    const reportFile = path.join(__dirname, 'accessibility_report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

async function scanAccessibility(context, axeOptions = {}, includeIncomplete = true) {
    try {
        const results = await axe.run(context, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            },
            ...axeOptions
        });

        return {
            timestamp: new Date().toISOString(),
            violations: results.violations || [],
            passes: results.passes || [],
            incomplete: includeIncomplete ? (results.incomplete || []) : [],
            inapplicable: results.inapplicable || [],
            toolOptions: axeOptions
        };
    } catch (error) {
        console.error('Error scanning accessibility:', error.message);
        return {
            timestamp: new Date().toISOString(),
            violations: [],
            passes: [],
            incomplete: [],
            inapplicable: [],
            error: error.message
        };
    }
}

async function generateAccessibilityReport(options = {}) {
    const {
        context = document,
        axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;

    const scanResults = await scanAccessibility(context, axeOptions);
    const filteredViolations = filterIssuesByRules(scanResults.violations, allowedRules);
    const summary = generateReportSummary(filteredViolations);

    return {
        timestamp: new Date().toISOString(),
        violations: filteredViolations,
        passes: scanResults.passes,
        incomplete: scanResults.incomplete,
        inapplicable: scanResults.inapplicable,
        toolOptions: axeOptions,
        summary
    };
}

export function newFunction() {
    console.log('New function called');
}

export function newFunction2() {
    console.log('New function 2 called');
}

export { createInPageButton, getLangAttribute, function3, validateTableAccessibility, validateTableStructure, validateLinkAccessibility, getSvgAccessibleName, setSvgAttributes, ensureUniqueLandmarks, checkLinkAccessibility, generateAccessibilityReport, scanAccessibility, addLangAttribute, addressAccessibilityIssues, ensureUniqueLandmarksDom, addressNewAccessibilityIssues, filterIssuesByRules, generateReportSummary, writeReport, processData, formatResponse, greet, add, helper, formatDate, validateInput, isValidLandmark, validateLandmark, validateLandmarkStructure, loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks, addFixLandmarkIssues, CONFIG };