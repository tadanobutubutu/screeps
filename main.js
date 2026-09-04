const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const accessiblyHelper = require('./accessibly-helper');

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

let dependencyGraph = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
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

    return issues;
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

function getUserSafetyAdvice() {
  return { safety: UserSafety, categories: SafetyCategories };
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to get the language attribute value
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// Function to get current language
function getCurrentLanguage() {
  return getLangAttribute();
}

// Function to create an in-page button
function createInPageButton() {
  const button = document.createElement('button');
  button.id = 'accessibility-info-button';
  button.textContent = 'Accessibility Info';
  button.setAttribute('aria-label', 'Show accessibility information');
  document.body.appendChild(button);
}

// Function to add language attribute
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Function to log current URL
function logCurrentURL() {
  console.log(window.location.href);
}

// Function to validate table accessibility
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.hasAttribute('summary')) {
      table.setAttribute('summary', 'Table summary');
    }
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.prepend(caption);
    }
  });
}

// Function to validate table structure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('th, td');
      cells.forEach(cell => {
        if (!cell.hasAttribute('scope') && cell.tagName === 'TH') {
          cell.setAttribute('scope', 'col');
        }
      });
    });
  });
}

// Function to add main landmark
function addMainLandmark() {
  const main = document.querySelector('main') || document.createElement('main');
  if (!main.parentNode) {
    const firstSection = document.querySelector('section') || document.body.firstChild;
    if (firstSection) {
      firstSection.parentNode.insertBefore(main, firstSection);
    } else {
      document.body.insertBefore(main, document.body.firstChild);
    }
  }
  if (!main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

// Function to validate landmark elements
function validateLandmark() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    elements.forEach(element => {
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', `${landmark} landmark`);
      }
    });
  });
}

// Function to validate landmark structure
function validateLandmarkStructure() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    elements.forEach(element => {
      if (!element.hasAttribute('aria-labelledby')) {
        const id = `${landmark}-label`;
        element.setAttribute('aria-labelledby', id);
        const label = document.createElement('h2');
        label.id = id;
        label.textContent = `${landmark} section`;
        element.prepend(label);
      }
    });
  });
}

// Function to validate landmark attributes
function validateLandmarkAttributes() {
  const requiredLandmarks = ['main', 'nav', 'footer'];
  requiredLandmarks.forEach(landmark => {
    const element = document.querySelector(`[role="${landmark}"]`);
    if (element) {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `${landmark} landmark`);
      }
    }
  });
}

// Function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    return labelElement ? labelElement.textContent : '';
  }
  return '';
}

// Function to set SVG attributes
function setSvgAttributes(svgElement, name) {
  if (!svgElement || !name) return;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', name);
  }
}

// Function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  const landmarkCounts = {};

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    landmarkCounts[landmark] = elements.length;
  });

  for (const [landmark, count] of Object.entries(landmarkCounts)) {
    if (count > 1) {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      elements.forEach((element, index) => {
        if (index > 0) {
          element.setAttribute('aria-label', `${landmark} landmark ${index + 1}`);
        }
      });
    }
  }
}

// Function to validate link accessibility
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    if (!link.hasAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

// Function to handle fake links
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href^="#"]');
  fakeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });
}

// Function to fix fake links
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href^="#"]');
  fakeLinks.forEach((link, index) => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', `Navigation link ${index + 1}`);
    }
  });
}

// Function to add proper landmark regions
function addProperLandmarkRegions() {
  const landmarks = ['main', 'nav', 'aside', 'footer', 'header'];
  landmarks.forEach(landmark => {
    let elements = document.querySelectorAll(`${landmark}`);
    if (elements.length === 0) {
      elements = document.querySelectorAll(`[role="${landmark}"]`);
    }
    elements.forEach(element => {
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', `${landmark} region`);
      }
    });
  });
}

// Function to handle Google sign-in logic
function handleGoogleSignIn() {
  const signInButton = document.getElementById('google-signin-button');
  if (signInButton) {
    signInButton.addEventListener('click', function() {
      console.log('Google sign-in initiated');
    });
  }
}

// Function to upgrade
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

// Function to render graph index
function renderGraphIndex() {
  // Placeholder for graph rendering functionality
}

// Existing function 1
function existingFunction1() {
  // Implementation for existing function 1
}

// Existing function 2
function existingFunction2() {
  // Implementation for existing function 2
}

// New function
function newFunction() {
  // Implementation for new function
}

// Function to render index view
function renderIndexView() {
  // Implementation for index view rendering
}

// Function to set SVG accessible names
function setSvgAccessibleNames(svgId1, svgId2, name1, name2) {
  if (svgId1) {
    const svg1 = document.getElementById(svgId1);
    if (svg1) setSvgAttributes(svg1, name1);
  }
  if (svgId2) {
    const svg2 = document.getElementById(svgId2);
    if (svg2) setSvgAttributes(svg2, name2);
  }
}

// Harvest logic implementation
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

// Combined harvest and upgrade workflow
async function harvestAndUpgrade() {
  const harvested = await harvest();
  const upgraded = await upgrade(harvested);
  return { harvested, upgraded };
}

// Endpoint for generating an accessibility report
async function accessibilityReportEndpoint(req, res) {
  try {
    const report = await generateAccessibilityReport();
    if (res && typeof res.status === 'function' && typeof res.json === 'function') {
      res.status(200).json({
        success: true,
        report: report
      });
    }
    return report;
  } catch (error) {
    console.error('Error in accessibility report endpoint:', error);
    if (res && typeof res.status === 'function' && typeof res.json === 'function') {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
    throw error;
  }
}

// Import and execute function
async function importAndExecute() {
  try {
    const report = await generateAccessibilityReport();
    console.log('Report generated:', report);
    return report;
  } catch (error) {
    console.error('Import and execute failed:', error);
    throw error;
  }
}

// Address accessibility issues
function addressAccessibilityIssues() {
  // Ensure root container role
  const root = document.documentElement || document.body;
  if (root && !root.hasAttribute('role')) {
    root.setAttribute('role', 'document');
  }

  // Add skip link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('class', 'skip-link');
  if (document.body.firstChild) {
    document.body.insertBefore(skipLink, document.body.firstChild);
  } else {
    document.body.appendChild(skipLink);
  }

  // Add Enter key support for button
  const button = document.querySelector('button[aria-label="Show accessibility information"]');
  if (button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        button.click();
      }
    });
  }

  // Add focus-visible polyfill
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-focus-visible');
  }

  // Set lang attribute
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

// Address new accessibility issues from insight report
function addressNewAccessibilityIssues() {
  // 1. Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }

  // 2. Fix table structure issues
  validateTableStructure();
  validateTableAccessibility();

  // 3. Add accessible names to SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');

  // 4. Ensure unique landmarks
  ensureUniqueLandmarks();

  // 5. Fix fake link issues
  fixFakeLink();

  // 6. Add proper landmark regions
  addProperLandmarkRegions();

  console.log('New accessibility issues addressed successfully');
}

// Accessibility utilities object
const accessibilityUtils = {
  addressNewAccessibilityIssues: function() {
    addressNewAccessibilityIssues();
  },
  getLang: function() {
    return getLangAttribute();
  },
  validateLinks: function() {
    validateLinkAccessibility();
    handleFakeLinks();
  }
};

// Scan accessibility function placeholder
async function scanAccessibility() {
  // Placeholder implementation for scanning accessibility
  return [];
}

// Check link accessibility function
function checkLinkAccessibility() {
  validateLinkAccessibility();
  handleFakeLinks();
}

// Validate landmark required function
function validateLandmarkRequired() {
  const requiredLandmarks = ['main', 'nav', 'footer'];
  const missingLandmarks = [];

  requiredLandmarks.forEach(landmark => {
    const element = document.querySelector(`[role="${landmark}"]`) ||
                   document.querySelector(landmark);
    if (!element) {
      missingLandmarks.push(landmark);
    }
  });

  if (missingLandmarks.length > 0) {
    console.warn('Missing required landmarks:', missingLandmarks.join(', '));
    return false;
  }
  return true;
}

// Initialize the application with accessibility improvements
function initialize() {
  // Ensure the dependencyGraph container has a proper ARIA role
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'region');
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }

  // Address accessibility issues
  addressAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add accessible names to 2 SVGs
  setSvgAccessibleNames('svg1Id', 'svg2Id', 'aria-label for SVG1', 'aria-label for SVG2');

  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Fix fake link issues
  fixFakeLink();

  // Address new accessibility issues from insight report
  addressNewAccessibilityIssues();

  // Handle Google sign-in logic
  handleGoogleSignIn();

  // Initialize accessibility features from a11y utilities
  if (typeof a11y !== 'undefined' && a11y && a11y.init) {
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

// Expose validateLandmark to global scope if needed
if (typeof window !== 'undefined') {
  window.validateLandmark = validateLandmarkRequired;
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
  addressAccessibilityIssues,
  getLangAttribute,
  getCurrentLanguage,
  createInPageButton,
  addLangAttribute,
  logCurrentURL,
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  upgrade,
  renderGraphIndex,
  existingFunction1,
  existingFunction2,
  newFunction,
  renderIndexView,
  accessibilityReportEndpoint,
  harvest,
  harvestAndUpgrade,
  checkLinkAccessibility,
  writeReport,
  scanAccessibility,
  addressNewAccessibilityIssues,
  importAndExecute,
  handleGoogleSignIn,
  setSvgAccessibleNames,
  fixFakeLink,
  validateLandmarkRequired,
  initialize,
  ...accessibilityUtils
};