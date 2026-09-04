const CONFIG = {
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  name: 'MyApp',
  version: '1.0.0',
  debug: false
};

const config = CONFIG;

const books = [];
const safetyCategory = "User Safety: safe";

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');

const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks
} = require('./utils');

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  addProperLandmarkRegions,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks: handleFakeLinksLocal,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  landmarkStructureCheck
} = require('./somemodule');

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

let icons = {};
let userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

function calculateSafetyScore(safetyCategories) {
  const safetyCategoryMap = {
    'Unauthorized Advice': 1,
    'Dangerous Action': 2,
    'Potential Scam': 3,
    'Privacy Risk': 4
  };

  let totalRiskScore = 0;

  safetyCategories.forEach((category) => {
    totalRiskScore += safetyCategoryMap[category] || 0;
  });

  return totalRiskScore * 10;
}

function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
}

function getBooksList() {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
}

function ensureDependencyGraphAccessibility() {
  const dependencyGraphEl = document.getElementById('dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

function ensureUniqueLandmarksOriginal(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }

  const seen = new Set();
  return landmarksArray.map((landmark) => {
      const key = landmark.id + '_' + (landmark.role || 'default');
      if (!seen.has(key)) {
          seen.add(key);
          landmark.id = landmark.id || key;
          landmark = ensureElementHasId(landmark, landmark.id);
          if (!landmark.attributes || !landmark.attributes.aria) {
              landmark.attributes = landmark.attributes || {};
              landmark.attributes.aria = {};
          }
          landmark.attributes.aria.label = ensureLandmarkLabel(landmark);
          return landmark;
      }
      return null;
  }).filter(Boolean);
}

function calculateDiscount(price, discount) {
  return price - (price * discount);
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
}

function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.role;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

module.exports = {
  CONFIG,
  config,
  books,
  safetyCategory,
  userSafety,
  safetyCategories,
  calculateSafetyScore,
  addBook,
  announceBookAdded,
  getBooksList,
  ensureDependencyGraphAccessibility,
  ensureUniqueLandmarksOriginal,
  calculateDiscount,
  loadLandmarks,
  processLandmarks,
  isValidLandmark
};