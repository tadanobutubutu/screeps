import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import fs from 'fs';
import path from 'path';
import axe from 'axe-core';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  return button;
}

// Function to get the language attribute for HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to generate accessibility report based on optional issues data
function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    const images = document.querySelectorAll('img');
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

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = input.getAttribute('aria-label');
        const hasLabel = document.querySelector(`label[for="${input.id}"]`) || labelId || labelText;
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

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index: index,
          message: `${heading.tagName.toLowerCase()} at index ${index} has no text content`
        });
      }
    });
  } else {
    issues = analyzeAccessibility(issuesData);
  }

  const report = {
    introduction: 'Accessibility report for the application',
    data: issues,
    conclusions: '',
  };

  console.log('Accessibility Report:', report);
  return report;
}

// Table accessibility validation functions
function validateTableAccessibility() {
  // Implementation to validate accessibility of tables
}

function validateTableStructure() {
  // Implementation to validate structure of tables
}

// SVG accessibility functions
function getSvgAccessibleName() {
  // Implementation to get accessible names for SVGs
}

function setSvgAttributes() {
  // Implementation to set attributes for SVGs
}

// Landmark functions
function ensureUniqueLandmarks() {
  // Implementation to ensure unique landmarks
}

function addMainLandmark() {
  // Implementation to add main landmark
}

function validateLandmark() {
  // Implementation to validate landmarks
}

function validateLandmarkStructure() {
  // Implementation to validate landmark structure
}

function validateLandmarkAttributes() {
  // Implementation to validate landmark attributes
}

function addProperLandmarkRegions() {
  // Implementation to add proper landmark regions
}

// Link accessibility functions
function validateLinkAccessibility() {
  // Implementation to validate link accessibility
}

function handleFakeLinks() {
  // Implementation to handle fake links
}

// Helper function to check if a link is accessible
function checkLinkAccessibility(linkUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  return fetch(linkUrl, { method: 'HEAD', signal: controller.signal })
    .then(response => {
      clearTimeout(timeout);
      return response.ok;
    })
    .catch(() => {
      clearTimeout(timeout);
      return false;
    });
}

// New function3 logic
function function3() {
  console.log('Function3 is running.');
}

// Function to get the language attribute for HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function for generating a report based on accessibility issues
export { createInPageButton, getLangAttribute, generateAccessibilityReport, a11y, checkLinkAccessibility, function3 };

// Uncommented implementation of addressAccessibilityIssues
function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  document.querySelectorAll('button').forEach(function(button) {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  const buttonsWithRoleButton = document.querySelectorAll('[role="button"]');
  buttonsWithRoleButton.forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
  });

  a11y.announce('Welcome to the bot!', 'assertive');

  const imageElement = document.querySelector('img[alt=""]');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }

  const divElement = document.querySelector('div[role="list"]');
  if (divElement) {
    divElement.setAttribute('role', 'list');
  }

  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Accessibility utilities
const accessibilityUtils = {
  addressNewAccessibilityIssues: function(issues) {
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
};

// File paths for scanning
const pagesDir = './pages'; // Assuming pages directory exists

// Function to scan pages for accessibility issues
async function scanAccessibility() {
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fileEmitted = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fileEmitted);

    if (violations.length > 0) {
      issues.push({
        file: filePath,
        issues: violations,
      });
    }
  }

  return issues;
}

// Function to write the generated report
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to add lang attribute
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Function to fix table structure
function fixTableStructure() {
  // Implementation to fix table structure issues
}

// Functions to add accessible SVG names
function setSvgAccessibleNames(svgId1, svgId2, accessibleNames1, accessibleNames2) {
  const svg1 = document.getElementById(svgId1);
  const svg2 = document.getElementById(svgId2);

  if (svg1) {
    svg1.setAttribute('aria-labelledby', `svg-${svgId1}-label`);
    const labelDiv = document.createElement('div');
    labelDiv.id = `svg-${svgId1}-label`;
    labelDiv.textContent = accessibleNames1;
    svg1.appendChild(labelDiv);
  }

  if (svg2) {
    svg2.setAttribute('aria-labelledby', `svg-${svgId2}-label`);
    const labelDiv = document.createElement('div');
    labelDiv.id = `svg-${svgId2}-label`;
    labelDiv.textContent = accessibleNames2;
    svg2.appendChild(labelDiv);
  }
}

// Function to fix fake links
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll(':not([href])[role="link"]');
  fakeLinks.forEach(link => {
    link.removeAttribute('role');
    link.setAttribute('href', '#');
  });

  const modalElement = document.querySelector('.modal');
  if (modalElement && a11y && a11y.trapFocus) {
    a11y.trapFocus(modalElement);
  }
  if (a11y && a11y.announce) {
    a11y.announce('Welcome to the bot!', 'assertive');
  }

  const imageElement = document.querySelector('.main-image');
  if (imageElement) {
    imageElement.setAttribute('alt', 'A description of the image');
  }
}

// Function to count dependencies
function countDependencies() {
  console.log('Counting dependencies...');
}

// Harvest logic
async function harvest() {
  try {
    const report = await scanAccessibility();
    const harvestedData = {
      timestamp: new Date().toISOString(),
      pagesScanned: report.length,
      totalIssues: report.reduce((acc, curr) => acc + curr.issues.length, 0),
      details: report
    };

    const harvestFile = path.join(__dirname, 'harvest_data.json');
    fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

    return harvestedData;
  } catch (error) {
    console.error('Harvest failed:', error);
    throw error;
  }
}

// Upgrade logic
async function upgrade(harvestedData) {
  try {
    const data = harvestedData || (() => {
      const harvestFile = path.join(__dirname, 'harvest_data.json');
      if (fs.existsSync(harvestFile)) {
        return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
      }
      return null;
    })();

    if (!data) {
      throw new Error('No harvested data available for upgrade');
    }

    const upgradePlan = {
      timestamp: new Date().toISOString(),
      basedOnHarvest: data.timestamp,
      improvements: [],
      applied: false
    };

    if (data.details && data.details.length > 0) {
      data.details.forEach(page => {
        page.issues.forEach(violation => {
          upgradePlan.improvements.push({
            file: page.file,
            rule: violation.id,
            impact: violation.impact,
            description: violation.description,
            recommendation: `Fix ${violation.id} issue in ${page.file}`
          });
        });
      });
    }

    const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    upgradePlan.applied = true;
    upgradePlan.appliedAt = new Date().toISOString();

    fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

    return upgradePlan;
  } catch (error) {
    console.error('Upgrade failed:', error);
    throw error;
  }
}

// Combined workflow
async function harvestAndUpgrade() {
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// Initialize function
function initialize() {
  const dependencyGraph = document.getElementById('dependency-graph') || document.querySelector('.dependency-graph');
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

  addressAccessibilityIssues();

  createInPageButton('Accessibility Info', () => {
    console.log('Accessibility Info button clicked');
  });

  setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');

  ensureUniqueLandmarks();

  fixFakeLink();

  if (a11y && a11y.init) {
    a11y.init();
  }
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

export {
  createInPageButton,
  getLangAttribute,
  generateAccessibilityReport,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  addProperLandmarkRegions,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLinkAccessibility,
  function3,
  addLangAttribute,
  fixTableStructure,
  setSvgAccessibleNames,
  fixFakeLink,
  countDependencies,
  accessibilityUtils,
  harvest,
  upgrade,
  harvestAndUpgrade,
  scanAccessibility,
  writeReport,
  addressAccessibilityIssues,
  initialize,
  a11y
};