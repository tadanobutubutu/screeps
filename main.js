// main.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axios = require('axios');
const cheerio = require('cheerio');
const axeCore = require('axe-core');

// Configuration
const CONFIG = {
  port: 3000,
  maxResults: 1000,
  debug: false,
  dataPath: './data'
};

// Application data structures
const books = [];
const safetyCategory = "User Safety: safe";

const appData = {
  userAction: "Unknown",
  previousUserActions: [],
  lastUserActionId: "Unknown",
  userActionStack: [],
};

const appState = {
  lastUserAction: "Unknown",
  previousUserActions: [],
  lastUserActionId: "Unknown",
  userActionStack: [],
  previousUserSafety: 'safe',
  previousUserSafetyScore: 0,
};

// Safety Categories and User Safety Functions
const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
let userSafety = 'safe';

function getUserSafetyAdvice() {
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function computeSafetyScore(categories) {
  return categories.reduce((score, category) => {
    switch (category) {
      case 'Unauthorized Advice':
        return score + 1;
      case 'Dangerous Action':
        return score + 2;
      case 'Potential Scam':
        return score + 3;
      case 'Privacy Risk':
        return score + 4;
      default:
        return score;
    }
  }, 0);
}

// Book-related functions
function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);
  return bookObject;
}

function announceBookAdded(book) {
  console.log(`New book added: ${book.title} by ${book.author}.`);
}

// Harvest data function
function harvestData(context) {
  const dataToReturn = {
    harvestCount: 1,
    harvestList: [],
  };
  const contextType = typeof context;
  if (contextType === 'object' && context !== null) {
    for (const key in context) {
      // console.log(key);
    }
  }
  return dataToReturn;
}

// Analyze module dependencies
function analyzeModuleDependencies(modules) {
  const dependencyGraph = {};
  modules.forEach((module) => {
    dependencyGraph[module.name] = module.requires || [];
  });
  return dependencyGraph;
}

// Upgrade logic: use harvested data to improve the system
function upgradeSystem(harvestedData) {
  if (harvestedData) {
    if (harvestedData.maxResults) {
      CONFIG.maxResults = harvestedData.maxResults;
    }
    if (harvestedData.debug !== undefined) {
      CONFIG.debug = harvestedData.debug;
    }
  }
  return true;
}

function loadHarvestedData() {
  const filePath = path.join(__dirname, 'harvested_data.json');
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error loading harvested data: ${error.message}`);
    return null;
  }
}

// Accessibility improvement functions (server-side with cheerio)
function addLangAttribute(html) {
  const $ = cheerio.load(html);
  $('html').attr('lang', 'en');
  return $.html();
}

function ensureLangAttribute(html) {
  const $ = cheerio.load(html);
  if ($('html').attr('lang') === undefined) {
    $('html').attr('lang', 'en');
  }
  return $.html();
}

function fixTableStructure(html) {
  const $ = cheerio.load(html);
  $('table').each((i, elem) => {
    const $table = $(elem);
    const hasHeaderRow = $table.find('tr').first().find('th').length > 0;
    if (!hasHeaderRow) {
      $table.find('tr').first().prepend('<th scope="col"></th>');
      $table.find('td').each((j, cell) => {
        $(cell).prependTo($table.find('tr').first());
      });
    }
  });
  return $.html();
}

function fixLandmarks(html) {
  const $ = cheerio.load(html);
  $('header').attr('role', 'banner');
  $('nav').attr('role', 'navigation');
  $('main').attr('role', 'main');
  $('footer').attr('role', 'contentinfo');
  return $.html();
}

// SVG accessibility functions
function addSvgAccessibleNames(dom) {
  const svgs = dom.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const role = svg.getAttribute('role');
    if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (role === 'none') {
      // Do nothing for decorative images
    } else if (!svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    }
  });
}

function addSvgAccessibleNamesDom(dom) {
  const $ = cheerio.load(dom);
  $('svg').each((i, elem) => {
    const $svg = $(elem);
    const role = $svg.attr('role');
    if (role === 'img' && !$svg.attr('aria-label') && !$svg.attr('title')) {
      $svg.attr('aria-label', 'Image with no description.');
    } else if (role === 'none') {
      // Do nothing for decorative images
    } else if (!$svg.attr('aria-label') && !$svg.attr('title')) {
      $svg.attr('aria-label', 'Image with no description.');
    }
  });
}

// Fix fake links for web scrapers
function fixFakeLinks(dom) {
  const anchorTagsWithClickEvents = dom.querySelectorAll('a[onclick]');
  anchorTagsWithClickEvents.forEach((tag) => {
    const onClickAttributeValue = tag.getAttribute('onclick');
    const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
    const hrefValue = matchResult && matchResult[1];
    if (hrefValue) {
      tag.setAttribute('href', hrefValue);
      tag.setAttribute('onclick', '');
    }
  });
  return dom;
}

function fixFakeLinksDom(dom) {
  const $ = cheerio.load(dom);
  $('a[onclick]').each((i, elem) => {
    const $tag = $(elem);
    const onClickAttributeValue = $tag.attr('onclick');
    const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
    const hrefValue = matchResult && matchResult[1];
    if (hrefValue) {
      $tag.attr('href', hrefValue);
      $tag.attr('onclick', '');
    }
  });
}

// Client-side accessibility functions (for browser context)
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return null;
  
  const primaryContent = document.querySelector('.primary-content') ||
                          document.querySelector('[role="main"]') ||
                          document.getElementById('main-content') ||
                          document.querySelector('#content');

  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);

    if (document.documentElement.lang) {
      mainElement.setAttribute('lang', document.documentElement.lang);
    }
    return mainElement;
  }
  return null;
}

function addressInsightIssues(form) {
  if (!form || typeof document === 'undefined') return;

  if (!form.getAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id || input.getAttribute('name');
    const label = document.querySelector(`label[for="${id}"]`);
    if (id && !label) {
      input.setAttribute('aria-label', input.name || 'Form input');
    }
    if (input.required) {
      input.setAttribute('aria-required', 'true');
    }
  });

  const submitButton = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
  if (submitButton && !submitButton.getAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

function enhanceAccessibilityForAddBook(form) {
  if (!form || typeof document === 'undefined') return;

  if (!form.getAttribute('role')) {
    form.setAttribute('role', 'form');
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id || input.getAttribute('name');
    if (!input.getAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${input.id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.getAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }

  return form;
}

function addLandmarkRegions(container) {
  if (!container || typeof document === 'undefined') return [];

  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  const addedRegions = [];

  regions.forEach(role => {
    const existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      const region = document.createElement('div');
      region.setAttribute('role', role);
      container.appendChild(region);
      addedRegions.push(role);
    }
  });

  return addedRegions;
}

// Google Sign-In handler (client-side)
const googleSignIn = {
  initialize: function(clientId) {
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: this.handleCredentialResponse.bind(this)
      });
      return true;
    }
    return false;
  },

  renderButton: function(elementId) {
    const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
    if (element && typeof window !== 'undefined' && window.google && window.google.accounts) {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'sign_in_with'
      });
      return true;
    }
    return false;
  },

  handleCredentialResponse: function(response) {
    if (!response) {
      console.error('Credential response is required');
      return { success: false, error: 'Credential response is required' };
    }

    try {
      let parsedResponse = response;
      if (typeof response === 'string') {
        parsedResponse = JSON.parse(response);
      }

      const validationResult = validateCredentialResponseEx(parsedResponse);
      if (!validationResult.valid) {
        console.error('Credential response validation failed:', validationResult.errors);
        return { success: false, error: validationResult.errors.join(', ') };
      }

      const credentialData = extractCredentialDataEx(parsedResponse);
      storeCredentialDataEx(credentialData);

      if (typeof onCredentialSuccess === 'function') {
        onCredentialSuccess(credentialData);
      }

      console.log('Google Sign-In successful');
      return { success: true, credentialData };
    } catch (error) {
      console.error('Error handling Google Sign-In response:', error);
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
};

// Helper functions for Google Sign-In (stubs - implement as needed)
function validateCredentialResponseEx(response) {
  return { valid: true, errors: [] };
}

function extractCredentialDataEx(response) {
  return response;
}

function storeCredentialDataEx(data) {
  // Implement storage logic
  console.log('Storing credential data:', data);
}

// Landmark processing (server-side)
function loadAndProcessLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const landmarks = JSON.parse(data);
    return processLandmarks(landmarks);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
  }
}

function processLandmarks(landmarks) {
  // Process landmarks data
  return landmarks;
}

// Process accessibility issues (client-side)
function processAccessibilityIssues(document) {
  if (!document) return [];
  
  const issues = [];

  if (!document.documentElement.lang) {
    issues.push('Missing lang attribute on html element');
  }

  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    issues.push('Missing main landmark');
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') ||
                             svg.getAttribute('aria-labelledby') ||
                             svg.querySelector('title');
    if (!hasAccessibleName) {
      issues.push(`SVG at index ${index} missing accessible name`);
    }
  });

  return issues;
}

// Utility functions
function newFunction() {
  return 'Hello World';
}

function newFunction2() {
  return 'Goodbye World';
}

function calculateDiscount(price, discountPercentage) {
  const discountAmount = (price * discountPercentage) / 100;
  return price - discountAmount;
}

// Express app setup
const app = express();
app.use(express.json());

// Main entry point
const main = () => {
  const harvestedData = loadHarvestedData();
  if (harvestedData) {
    upgradeSystem(harvestedData);
  }

  app.listen(CONFIG.port, () => {
    console.log(`App listening at http://localhost:${CONFIG.port}`);
  });
};

// Event emitter for user actions
const mainObj = {
  on: function (event, callback) {
    if (event === 'userAction') {
      setInterval(() => {
        if (appData.userAction !== appState.lastUserAction) {
          callback(appData.userAction);
          appState.lastUserAction = appData.userAction;
          appState.previousUserActions.push(appData.userAction);
        }
      }, 1000);
    }
  },
};

// Export all functions for use in other modules
module.exports = {
  // Configuration
  CONFIG,
  appData,
  appState,
  
  // Books
  books,
  safetyCategory,
  addBook,
  announceBookAdded,
  
  // Safety
  safetyCategories,
  userSafety,
  getUserSafetyAdvice,
  computeSafetyScore,
  
  // System upgrade
  upgradeSystem,
  loadHarvestedData,
  
  // Data harvesting
  harvestData,
  analyzeModuleDependencies,
  
  // Accessibility (server-side)
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  addSvgAccessibleNamesDom,
  fixFakeLinksDom,
  
  // Accessibility (client-side)
  wrapPrimaryContentInMain,
  addressInsightIssues,
  enhanceAccessibilityForAddBook,
  addLandmarkRegions,
  processAccessibilityIssues,
  loadAndProcessLandmarks,
  
  // Google Sign-In
  googleSignIn,
  
  // Utilities
  newFunction,
  newFunction2,
  calculateDiscount,
  
  // Main
  main,
  mainObj,
  app
};

// Run if this is the main module
if (require.main === module) {
  main();
}