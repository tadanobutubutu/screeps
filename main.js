// Main JavaScript file
// This file handles the main application logic

const fs = require('fs');
const path = require('path');
const axe = require('axe-core');

// DOM Elements
const dependencyGraph = document.getElementById('dependencyGraph');

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)

// Configuration and state
const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

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

// Function to create in-page buttons
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.onclick = onClick;
  button.setAttribute('aria-label', text);
  if (text.length === 0) {
    button.setAttribute('aria-label', 'Empty button');
  }
  return button;
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  const pagesDir = './pages';
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

// Function to generate a report based on accessibility issues
function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  const report = {
    introduction: 'Accessibility report for the application',
    data: {},
    conclusions: ''
  };

  writeReport(report);
  return report;
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Function to get the language attribute value
function getLangAttribute() {
  return document && document.documentElement ? document.documentElement.lang || 'en' : 'en';
}

// Function to get the full lang attribute value
function getFullLangAttribute() {
  return document && document.documentElement ? document.documentElement.lang || 'en' : 'en';
}

// Functions to add accessible names to SVGs
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

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    if (svg.setAttribute) {
      svg.setAttribute('role', 'img');
      if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
      }
    }
  }
  return svg;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return 'Accessible SVG Icon';

  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  const ariaLabel = svgElement.getAttribute ? svgElement.getAttribute('aria-label') : null;
  if (title) return title.textContent;
  if (ariaLabel) return ariaLabel;
  return 'Accessible SVG Icon';
}

function addSvgAccessibilityProps(svg, options = {}) {
  const enhancedSvg = { ...svg };

  if (options.ariaLabel) {
    enhancedSvg.ariaLabel = options.ariaLabel;
  }

  if (options.ariaHidden !== undefined) {
    enhancedSvg.ariaHidden = options.ariaHidden;
  }

  if (options.role) {
    enhancedSvg.role = options.role;
  }

  if (!enhancedSvg.ariaLabel && !enhancedSvg.ariaLabelledby && !enhancedSvg.title) {
    enhancedSvg.title = 'SVG graphic';
  }

  return enhancedSvg;
}

// Table validation functions
function validateTableStructure(tables) {
  const allIssues = [];
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

function validateTableAccessibility(table) {
  const issues = [];

  if (!table.headers) {
    issues.push('Missing headers attribute');
  }

  if (!table.scope) {
    issues.push('Missing scope attribute');
  }

  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  const headerCells = table.querySelectorAll ? table.querySelectorAll('th') : [];
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function fixTableStructure(table) {
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

// Landmark validation functions
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }
  if (!element.hasAttribute('id')) {
    issues.push('Missing id attribute');
  }
  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push(`Invalid landmark role: ${landmark.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure(landmarks) {
  const issues = [];

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    const allLandmarks = document ? document.querySelectorAll('[role]') : [];
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];

  landmarks.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      if (!duplicates.includes(name)) {
        duplicates.push(name);
      }
    } else {
      names.push(name);
    }
  });

  const elementsById = {};
  landmarks.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  const landmarksByRole = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute ? landmark.getAttribute('role') : null;
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

// Link and button validation functions
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Link missing href attribute');
  }

  if (!link.textContent && !link.ariaLabel && !link.ariaLabelledby) {
    issues.push('Link missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function validateButtonAccessibility(button) {
  const issues = [];

  if (!button.textContent && !button.ariaLabel && !button.ariaLabelledby) {
    issues.push('Button missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function checkLinkAndButtonAccessibility(elements) {
  const allIssues = [];

  const elementsToCheck = Array.isArray(elements) ? elements : [elements];

  elementsToCheck.forEach((element, index) => {
    const result = (element.tagName && element.tagName.toLowerCase() === 'a')
      ? validateLinkAccessibility(element)
      : validateButtonAccessibility(element);

    if (!result.success) {
      allIssues.push({
        elementIndex: index,
        elementTag: element.tagName ? element.tagName.toLowerCase() : 'unknown',
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

function handleFakeLinks(link) {
  if (link.href === '#' || link.href === 'javascript:void(0)' || link.href === '') {
    return createInPageButton({
      text: link.textContent,
      ariaLabel: link.ariaLabel,
      onClick: link.onClick
    });
  }
  return link;
}

function createAccessibleLink(href, text) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  link.setAttribute('aria-label', text);
  return link;
}

function handleAccessibilityIssues() {
  return true;
}

// Landmark regions handling
function addLandmarkRegions(document) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  regions.forEach(region => {
    const elements = document && document.querySelectorAll ? document.querySelectorAll(region.selector) : [];
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });

  return document;
}

function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

function addMainLandmark(document) {
  if (document) {
    const main = document.createElement ? document.createElement('main') : null;
    if (main) {
      main.setAttribute('role', 'main');
      if (document.body) {
        document.body.appendChild(main);
      }
    }
  }
  return document;
}

// Credential handling functions
function handleCredentialResponse(credentialResponse) {
  const issues = [];

  if (!credentialResponse) {
    return {
      success: false,
      issues: ['No credential response provided']
    };
  }

  if (credentialResponse.error) {
    issues.push(`Credential error: ${credentialResponse.error}`);
  }

  if (!credentialResponse.credential) {
    issues.push('Missing credential field');
  }

  let userData = null;
  if (credentialResponse.email) {
    userData = {
      email: credentialResponse.email,
      name: credentialResponse.name || '',
      picture: credentialResponse.picture || ''
    };
  }

  let parsedCredential = null;
  if (credentialResponse.credential) {
    try {
      const parts = credentialResponse.credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        parsedCredential = {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          iss: payload.iss,
          aud: payload.aud,
          exp: payload.exp,
          iat: payload.iat
        };
      }
    } catch (parseError) {
      issues.push('Failed to parse credential token');
    }
  }

  const success = issues.length === 0 && !credentialResponse.error;

  return {
    success,
    issues,
    userData: userData || parsedCredential,
    credential: credentialResponse.credential,
    parsedCredential
  };
}

function validateCredentialToken(token) {
  const issues = [];

  if (!token) {
    return {
      success: false,
      issues: ['No token provided']
    };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    issues.push('Invalid token format: expected JWT structure');
  }

  let tokenData = null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    tokenData = payload;

    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        issues.push('Token has expired');
      }
    }

    if (!payload.email) {
      issues.push('Token missing email claim');
    }
  } catch (parseError) {
    issues.push('Failed to decode token');
  }

  return {
    success: issues.length === 0,
    issues,
    tokenData
  };
}

function processCredentialAuthentication(credentialResponse) {
  const result = handleCredentialResponse(credentialResponse);

  if (!result.success) {
    return {
      authenticated: false,
      user: null,
      errors: result.issues
    };
  }

  const user = result.parsedCredential || result.userData;

  return {
    authenticated: true,
    user: {
      email: user.email,
      name: user.name,
      picture: user.picture
    },
    errors: []
  };
}

// System management functions
function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
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

function upgradeSystem() {
  const env = process.env;
  const systemConfig = getConfig();

  if (env.UPGRADE_NEEDED) {
    const currentVer = systemConfig.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    systemConfig.version = newVer + '.0.0';
    console.log(`System upgraded to version ${systemConfig.version}`);
  }

  return systemConfig;
}

// Legacy functions
function newBranchFunction() {
  return 'New branch function executed';
}

function existingFunction1() {
  // Existing function implementation
}

function existingFunction2() {
  // Existing function implementation
}

function newFunction() {
  // Implementation of new function
}

function function3() {
  console.log('Function3 is running.');
}

function analyzeAccessibility(issuesData) {
  return issuesData;
}

function renderDependencyGraph(container) {
  // Implementation for rendering dependency graph
}

function renderIndexView(container) {
  // Implementation for rendering index view
}

function ensureUniqueLandmarks() {
  const landmarks = [...document.querySelectorAll('[aria-landmark]')];
  const landmarkIds = landmarks.map(landmark => landmark.getAttribute('aria-landmark'));
}

// Main initialization
function addressAccessibilityIssues() {
  const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  document.querySelectorAll('button').forEach(function(button) {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });

  document.querySelectorAll('[role="button"]').forEach(function(button) {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

function wrapPrimaryContentInMain(content) {
  return `<main>${content}</main>`;
}

// Required exports
const exports = {
  wrapPrimaryContentInMain: wrapPrimaryContentInMain,
  existingFunction1: existingFunction1,
  existingFunction2: existingFunction2,
  newFunction: newFunction,
  getLangAttribute: getLangAttribute,
  getFullLangAttribute: getFullLangAttribute,
  validateTableAccessibility: validateTableAccessibility,
  validateTableStructure: validateTableStructure,
  validateLandmark: validateLandmark,
  validateLandmarkAttributes: validateLandmarkAttributes,
  validateLandmarkStructure: validateLandmarkStructure,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  getSvgAccessibleName: getSvgAccessibleName,
  createInPageButton: createInPageButton,
  createAccessibleLink: createAccessibleLink,
  handleAccessibilityIssues: handleAccessibilityIssues,
  addSvgAccessibilityProps: addSvgAccessibilityProps,
  handleCredentialResponse: handleCredentialResponse,
  addLangAttribute: addLangAttribute,
  fixTableStructure: fixTableStructure,
  addMainLandmark: addMainLandmark,
  setSvgAttributes: setSvgAttributes,
  handleFakeLinks: handleFakeLinks,
  addLandmarkRegions: addLandmarkRegions,
  newBranchFunction: newBranchFunction,
  initializeApp: initializeApp,
  getConfig: getConfig,
  validateInput: validateInput,
  processData: processData,
  validateCredentialToken: validateCredentialToken,
  processCredentialAuthentication: processCredentialAuthentication,
  upgradeSystem: upgradeSystem,
  validateLinkAccessibility: validateLinkAccessibility,
  validateButtonAccessibility: validateButtonAccessibility,
  checkLinkAndButtonAccessibility: checkLinkAndButtonAccessibility,
  countDependencies: countDependencies,
  newBranchFunction: newBranchFunction,
  function3: function3,
  analyzeAccessibility: analyzeAccessibility,
  renderDependencyGraph: renderDependencyGraph,
  renderIndexView: renderIndexView
};

module.exports = exports;

// Initialize on DOM ready
function initialize() {
  addressAccessibilityIssues();
  ensureUniqueLandmarks();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}