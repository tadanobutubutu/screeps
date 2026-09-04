// Main.js - Screeps Bot with Web Interface

// Module imports and configuration
const express = require('express');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const axios = require('axios');
const cheerio = require('cheerio');
const axeCore = require('axe-core');

const CONFIG = {
  port: 3000,
  maxResults: 1000,
  debug: false,
};

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

function computeSafetyScore(safetyCategories) {
  const safetyCategory = safetyCategories.reduce((score, category) => {
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
  return safetyCategory;
}

const books = [];
const safetyCategory = "User Safety: safe";

// Book-related functions
function addBook(title, author) {
  const bookObject = {
    title,
    author,
  };
  books.push(bookObject);
  // console.log(JSON.stringify(bookObject));
  return bookObject;
}

function announceBookAdded(book) {
  console.log(
    `New book added: ${book.title} by ${book.author}.`,
  );
}

// Harvest data function placeholder
function harvestData(context) {
  const dataToReturn = {
    'harvestCount': 1,
    'harvestList': [],
  };
  const contextType = typeof context;
  if (contextType === 'object' && context !== null) {
    for (const key in context) {
      // console.log(key);
    }
  }
  // console.log('Harvesting data...');
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

// Upgrade logic: process harvested data arrays into system improvements
function performUpgrade(harvestedData) {
  if (!harvestedData || !harvestedData.length) {
    return {
      success: false,
      message: 'No harvested data available for upgrade'
    };
  }

  const improvements = {
    efficiency: 0,
    capacity: 0,
    upgrades: []
  };

  for (const data of harvestedData) {
    if (data.type === 'energy') {
      improvements.efficiency += (data.amount || 0) * 0.1;
    }
    if (data.type === 'resource') {
      improvements.capacity += (data.amount || 0) * 0.05;
    }
    if (data.metadata && data.metadata.upgradeable) {
      improvements.upgrades.push({
        target: data.id,
        level: (data.metadata.level || 0) + 1
      });
    }
  }

  // Add new function for HTML accessibility enhancements in React
  function addLandmarkRolesToElements(elements) {
    if (!Array.isArray(elements)) return [];
    return elements.map(el => {
      if (el.tagName) {
        const tag = el.tagName.toLowerCase();
        const roleMap = { nav: 'navigation', main: 'main', footer: 'contentinfo', aside: 'complementary' };
        if (roleMap[tag] && !el.getAttribute('role')) {
          el.setAttribute('role', roleMap[tag]);
        }
      }
      return el;
    });
  }

  return {
    success: true,
    improvements: improvements,
    timestamp: Date.now(),
    addLandmarkRolesToElements: addLandmarkRolesToElements
  };
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

function applySystemUpgrades(harvestedData) {
  const upgradeResult = performUpgrade(harvestedData);

  if (upgradeResult.success) {
    console.log(`System upgraded: Efficiency +${upgradeResult.improvements.efficiency.toFixed(2)}`);
    console.log(`Capacity increased by ${upgradeResult.improvements.capacity.toFixed(2)}`);
  }

  return upgradeResult;
}

const app = express();

// Express middleware and routes
app.use(express.json());

// Accessibility improvement functions
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

// New functions to integrate
function newFunction() {
  return 'Hello World';
}

function newFunction2() {
  return 'Goodbye World';
}

function calculateDiscount(price, discountPercentage) {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return discountedPrice;
}

// Accessibility improvement function for SVGs
function addSvgAccessibleNames(dom) {
  const svgs = dom.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const role = svg.getAttribute('role');
    if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (role === 'img' && !svg.getAttribute('aria-label') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', 'Image with no description.');
    } else if (svg.getAttribute('role') === 'none') {
      // Do nothing
    } else {
      svg.setAttribute('aria-label', 'Image with no description.');
    }
  });
}

// Function to fix fake links for web scrapers
function fixFakeLinks(dom) {
  const anchorTagsWithClickEvents = dom.querySelectorAll('a[onclick]');
  anchorTagsWithClickEvents.forEach((tag) => {
    const onClickAttributeValue = tag.getAttribute('onclick');
    const matchResult = onClickAttributeValue && onClickAttributeValue.match(/window\.location(?:[^=]+)?\(['"]([^'"]+)['"]/);
    const hrefValue = matchResult && matchResult[1];
    tag.setAttribute('href', hrefValue);
    tag.setAttribute('onclick', '');
  });
  return dom;
}

// DOM-based versions of accessibility functions using cheerio
function addSvgAccessibleNamesDom(dom) {
  const $ = cheerio.load(dom);
  $('svg').each((i, elem) => {
    const $svg = $(elem);
    const role = $svg.attr('role');
    if (role === 'img' && !$svg.attr('aria-label') && !$svg.attr('title')) {
      $svg.attr('aria-label', 'Image with no description.');
    } else if (role === 'img' && !$svg.attr('aria-label') && !$svg.attr('title')) {
      $svg.attr('aria-label', 'Image with no description.');
    } else if ($svg.attr('role') === 'none') {
      // Do nothing
    } else {
      $svg.attr('aria-label', 'Image with no description.');
    }
  });
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

main();

// Export functions for use in other modules
module.exports = {
  books,
  safetyCategory,
  safetyCategories,
  userSafety,
  getUserSafetyAdvice,
  computeSafetyScore,
  upgradeSystem,
  loadHarvestedData,
  addBook,
  announceBookAdded,
  harvestData,
  analyzeModuleDependencies,
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructure,
  fixLandmarks,
  newFunction,
  newFunction2,
  calculateDiscount,
  addSvgAccessibleNames,
  fixFakeLinks,
  addSvgAccessibleNamesDom,
  fixFakeLinksDom,
  performUpgrade,
  applySystemUpgrades,
};