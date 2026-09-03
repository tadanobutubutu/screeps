const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks
} = require('./utils');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
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

  return svgElement.getAttribute('aria-label') || '';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && !cell.getAttribute('scope')) {
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
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.getAttribute('scope')) {
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
  const links = document.querySelectorAll('a[href]');

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
    if (link.tagName === 'A' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }
  return true;
}

function initialize() {
  console.log('Initializing application...');
  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;
    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinks();
    ensureUniqueLandmarks();
    // ... (rest of the initialize function remains unchanged)
  }
}

// ... (rest of the main.js code remains unchanged)

// New function to check link and button accessibility
function checkLinkAndButtonAccessibility() {
  const links = document.querySelectorAll('a[href], button');
  const accessibilityIssues = [];

  links.forEach(link => {
    if (!validateLinkAccessibility(link)) {
      accessibilityIssues.push(`Accessibility issue with link: ${link.href}`);
    }
    if (link.tagName === 'BUTTON' && !validateLandmarkStructure()) {
      accessibilityIssues.push(`Accessibility issue with button: ${link.textContent}`);
    }
  });

  return accessibilityIssues.length === 0;
}

// ... (rest of the main.js code remains unchanged)