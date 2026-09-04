const CONFIG = {
  outputPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000,
  rules: {
    'color-contrast': { enabled: false },
    'aria-roles': { enabled: false },
    'aria-properties': { enabled: false },
    getSvgAccessibleName: getSvgAccessibleNameUtil,
    setSvgAttributes: setSvgAttributesUtil
    // Add any custom rules you want to use here
  }
};

const axe = axe.createInstance(CONFIG);
const fs = require('fs');
const path = require('path');
const { utils: validators, helpers, svgHelpers, svg } = require('./');
const { getLangAttribute, addLangAttribute } = require('./utils/lang');

// Utilities
function scanAccessibility(rootElement) {
  const results = axe.run(rootElement);

  if (results.violations.length > 0) {
    console.warn('Accessibility issues found:', results);

    // You can implement custom handling for accessibility issues here
    // For example, create an accessibility report or perform fixes automatically

    // Generate an accessibility report based on scan results
<<<<<<< HEAD
    const accessibilityReport = generateAccessibilityReport(results);
=======
    const accessibilityReport = generateReport(results);
>>>>>>> origin/main
    // Save the report to a file or send it elsewhere
  }
}

// Import helper functions
const { validateInput, processData, formatResponse } = helpers;
const { getSvgAccessibleName: getSvgAccessibleNameUtil, setSvgAttributes: setSvgAttributesUtil } = svgHelpers;

// User Safety: unsafe
// Safety Categories: Other, Unauthorized Advice, Needs Caution

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return navigator.language || navigator.userLanguage;
}

// Adding lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  const lang = getLangAttribute();
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', lang);
  }
}

// TODO: Implement function for generating a report based on accessibility issues
function generateReport(results) {
  const report = {
    violations: [],
    passes: [],
    ignored: []
  };

  results.violations.forEach(violation => {
    const { impact, description, help, rules } = violation;
    report.violations.push({
      impact,
      description,
      help,
      rules
    });
  });

  results.passes.forEach(pass => {
    report.passes.push({
      description: pass.description,
      rules: pass.rules
    });
  });

  results.ignored.forEach(ignored => {
    report.ignored.push({
      description: ignored.description,
      details: ignored.details
    });
  });

  return report;
}

module.exports = {
  CONFIG,
  config: CONFIG,
  isInitialized: false,
  appData: { resources: [] },
  getLangAttribute,
  addLangAttribute,
  scanAccessibility,
  validateInput,
  processData,
  formatResponse,
  getSvgAccessibleNameUtil,
  setSvgAttributesUtil,
  createInPageButtons,
  fixUniqueLandmarks,
  validateTableAccessibility: validators.validateTableAccessibility,
  validateTableStructure: validators.validateTableStructure,
  fixTableStructure: validators.fixTableStructure,
  addMainLandmark: svg.addMainLandmark,
  validateLandmark: validators.validateLandmark,
  validateLandmarkStructure: validators.validateLandmarkStructure,
  validateLandmarkAttributes: validators.validateLandmarkAttributes,
  isValidLandmark: validators.isValidLandmark,
  loadLandmarks: validators.loadLandmarks,
  processLandmarks: validators.processLandmarks,
  sortLandmarks: validators.sortLandmarks,
  findLandmarkById: validators.findLandmarkById,
  ensureUniqueLandmarks: validators.ensureUniqueLandmarks,
  writeReport: validators.writeReport,
  generateReport,
  validateItem: validators.validateItem,
  implementNewFunction,
  logCurrentURL,
  createInPageButtons: svg.createInPageButtons,
  validateLinkAccessibility: validators.validateLinkAccessibility,
  fixFakeLinks,
  fixTableStructureIssues: validators.fixTableStructureIssues,
  fixTableHeaderCellScope: validators.fixTableHeaderCellScope,
  addSvgAccessibleNames: svg.addSvgAccessibleNames
};