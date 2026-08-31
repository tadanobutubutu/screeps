import react from 'react';
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute, validateTableAccessibility, validateTableStructure } from './utils/accessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';

// Configuration
const CONFIG = {
  dataPath: './data',
  maxResults: 100
};

// New function to generate a report based on accessibility issues
function generateAccessibilityReport() {
  const options = {
    rules: [{ id: 'color-contrast' }, { id: 'aria-roles' }],
  };

  const report = axe.auditWebpage(document.body, options);
  return report;
}

// Function to add wrapper for main element to enhance accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  if (parent.tagName?.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// Ensure unique landmarks by ID
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const seen = new Set();
    const uniqueLandmarks = [];

    for (const landmark of landmarks) {
        if (!landmark || typeof landmark.id === 'undefined') {
            continue;
        }

        const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

        if (!seen.has(landmarkId)) {
            seen.add(landmarkId);
            uniqueLandmarks.push(landmark);
        }
    }

    return uniqueLandmarks;
}

const App = () => {
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      const filePath = path.join(CONFIG.dataPath, 'program.json');
      try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        setProgramData(parsedData);
      } catch (error) {
        console.error('Error loading program data:', error);
      }
    };
    loadProgramData();
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/accessibility">Accessibility</Link>
          </li>
          <li>
            <Link to="/dependency-visualization">Dependency Visualization</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/accessibility">
          <Accessibility data={programData} />
        </Route>
        <Route path="/dependency-visualization">
          <DependencyVisualization data={programData} />
        </Route>
      </Switch>
    </Router>
  );
};

const Accessibility = ({ data }) => {
  // ... Your accessibility-related code here ...
  // ... Newly added functionality for addressing accessibility issues from the insight report ...
};

const DependencyVisualization = ({ data }) => {
  // ... Your dependency visualization code here ...
};

const loadLandmarks = () => {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

const processLandmarks = (landmarks) => {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(landmark => landmark && landmark.name);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
};

const sortLandmarks = (landmarks, ascending = true) => {
  return [...landmarks].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
};

const getLandmarkById = (landmarks, id) => {
  return landmarks.find(landmark => landmark && landmark.id === id) || null;
};

// Export functions for testing
export { loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks };

// CommonJS export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateSum,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    validateLinkAccessibility,
    handleFakeLinks,
    createInPageButton,
    validateInput,
    processData,
    formatResponse,
    config: CONFIG,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    landmarkConfig: CONFIG,
    generateAccessibilityReport,
    wrapPrimaryContentInMain,
    ensureUniqueLandmarks
  };
}