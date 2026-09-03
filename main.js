const express = require('express');
const fs = require('fs');
const path = require('path');

const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFn,
  addLangAttribute: addLangAttributeFn,
  getLangAttribute: getLangAttributeFn,
  validateTableAccessibility: validateTableAccessibilityFn,
  validateTableStructure: validateTableStructureFn,
  validateLandmarkStructure: validateLandmarkStructureFn,
  validateLinkAccessibility: validateLinkAccessibilityFn,
  handleFakeLinks: handleFakeLinksFn,
  someFunction: someFunctionFn,
  fetchUser: fetchUserFn,
  clearCache: clearCacheFn,
  calculateSum,
  getSvgAccessibleName,
  setSvgAttributes,
  fixTableStructure,
  fixTableHeaderScope,
  addProperLandmarkRegions,
  createAccessibleLink,
  fixFakeLinkIssues
} = require('./utils');

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  generateKey: generateKeyLocal,
  BookItem: BookItemLocal,
  addBook: addBookLocal,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton: createInPageButtonLocal,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName: getSvgAccessibleNameLocal,
  setSvgAttributes: setSvgAttributesLocal,
  ensureUniqueLandmarks: ensureUniqueLandmarksLocal,
  addProperLandmarkRegions: addProperLandmarkRegionsLocal,
  validateLinkAccessibility: validateLinkAccessibilityLocal,
  handleFakeLinks: handleFakeLinksLocal,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  landmarkStructureCheck
} = require('./somemodule');

const {
  sortByTitle: sortByTitleFn,
  sortByAuthor: sortByAuthorFn,
  generateKey: generateKeyFn,
  BookItem: BookItemFn,
  addBook: addBookFn,
  ...otherBookFunctions
} = require('./bookFunctions');

const {
  setDependencyGraph,
  ...otherReduxActions
} = require('./redux/actions');

const accessiblyHelper = require('./accessibly-helper');
const { registerSW } = require('effector-sw');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import App from './App';
import * as newFunctions from './newFunctions';
import axe from 'axe-core';

require('./styles.css');
require('./styles.less');

const CONFIG = require('./utils/constants').CONFIG;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

let isInitialized = false;
let dependencyGraph = null;
const books = [];

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

function ensureDependencyGraphAccessibility() {
  const dependencyGraphEl = document.getElementById('dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

function ensureUniqueLandmarks(landmarksArray) {
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

function ensureElementHasId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function ensureLandmarkLabel(landmark) {
  if (landmark.name) {
    return landmark.name;
  }
  if (landmark.role) {
    return landmark.role.charAt(0).toUpperCase() + landmark.role.slice(1) + ' Landmark';
  }
  return 'Unnamed Landmark';
}

const sortByTitle = sortByTitleLocal || sortByTitleFn;
const sortByAuthor = sortByAuthorLocal || sortByAuthorFn;

export const validateLandmark = (landmark) => {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude !== undefined && landmark.longitude !== undefined) {
    if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
      errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
      errors.push('Landmark latitude must be between -90 and 90');
    }

    if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
      errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
      errors.push('Landmark longitude must be between -180 and 180');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export const checkLinkAccessibility = (url) => {
  if (!url) {
    return false;
  }
  return true;
};

export const newExportedFunction = () => {
  return { success: true };
};

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    const lang = document.documentElement.lang || 'en';
    if (!document.documentElement.hasAttribute('lang')) {
      document.documentElement.setAttribute('lang', lang);
    }
  }
}

function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  const ariaLabel = svgElement.getAttribute('aria-label') || '';
  return ariaLabel;
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && cell.tagName === 'TH') {
      return false;
    }
  }

  return true;
}

function validateTableStructure(tableElement) {
  if (!tableElement) return false;

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('td, th');
    for (const cell of cells) {
      if (cell.tagName === 'TH') {
        hasHeader = true;
        if (!cell.id) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.href) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('[role]');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role]');

  for (const landmark of landmarks) {
    if (!landmark.id && landmark.getAttribute('role')) {
      return false;
    }
  }

  return true;
}

function loadLandmarks() {
  try {
    const dataPath = CONFIG.dataPath || './data';
    const filePath = path.join(dataPath, 'landmarks.json');
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

  const validLandmarks = landmarks.filter(l => l && l.id);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults || 100);
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function addSvgAttributes(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getAriaProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getAriaProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelled