const express = require('express');
const { createServer, Model } = require('screeps-server');
const { clearCache, initializeApp } = require('./screeps-bootstrap');

// Initialize the Screeps server and express app.
const server = createServer({
  model: new Model()
});

const app = express();
const PORT = process.env.PORT || 5000;

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
import './styles.less';
import './styles.css';
import fs from 'fs';
import path from 'path';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React from 'react';
import { CONFIG as UTILS_CONFIG } from './utils/constants';
import { initializeApp as initReactApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';

// Utility imports
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute, addLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure, fixTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, addMainLandmark, isValidLandmark, loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks, validateInput, processData, formatResponse, createInPageButton } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';

// Configuration
const appConfig = {
  ...UTILS_CONFIG,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

let appState = {};

// Accessibility controller to handle insight report issues
class AccessibilityController {
  async addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.issues) {
      return;
    }

    insightReport.issues.forEach(issue => {
      switch (issue.type) {
        case 'REACT_015':
          // Add lang attribute to HTML element
          if (issue.element) {
            issue.element.setAttribute('lang', 'en');
          }
          break;
        case 'REACT_017':
          // Add landmark roles and fix landmark issues
          if (issue.element) {
            if (!issue.element.getAttribute('role')) {
              issue.element.setAttribute('role', 'main');
            }
          }
          break;
        case 'REACT_041':
          // Add accessible names to SVGs
          if (issue.element) {
            issue.element.setAttribute('role', 'img');
            issue.element.setAttribute('aria-label', issue.accessibleName || 'Accessible SVG Icon');
          }
          break;
        case 'REACT_025':
          // Ensure unique landmarks
          console.log('Ensuring unique landmarks');
          break;
        case 'REACT_036':
          // Fix fake link issues
          if (issue.element && issue.element.tagName === 'A' && !issue.element.getAttribute('href')) {
            issue.element.setAttribute('role', 'button');
          }
          break;
        case 'REACT_027':
          // Add scope to table elements
          if (issue.element && issue.element.tagName === 'TH') {
            if (!issue.element.getAttribute('scope')) {
              issue.element.setAttribute('scope', issue.element.parentNode.tagName === 'THEAD' ? 'col' : 'row');
            }
          }
          break;
        default:
          console.log('Unknown issue type:', issue.type);
      }
    });
  }
}

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

function initialize() {
  appConfig.apiUrl = process.env.API_URL || 'default';
  appConfig.timeout = 5000;
  appState = { initialized: true };
}

// Split routes for Screeps and React.
const routes = express.Router();
routes.get('/', (req, res) => {
  res.render('index', { appData });
});
app.use('/', routes);

// Run the Screeps server and React app in separate processes.
server.listen(() => {
  console.log('Screeps server started.');
});

// Cleanup and initialize the application before serving
clearCache();
initializeApp(app, PORT);

app.listen(PORT, () => {
  console.log(`App server started on port ${PORT}`);
});

function clearCache() {
  appState = {};
}

function App() {
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    const loadProgramData = async () => {
      const filePath = path.join(appConfig.dataPath, 'program.json');
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
    // ... Your accessible React Router setup ...
  );
}

export default App;

module.exports = {
  server,
  app,
  AccessibilityController,
  generateAccessibilityReport,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  validateInput,
  processData,
  formatResponse,
  config: appConfig,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  landmarkConfig: appConfig,
  initialize,
  initializeApp: initReactApp,
  clearCache
};