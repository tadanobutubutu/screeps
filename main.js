const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  getUniqueLandmarks,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  addProperLandmarkRegions,
  createInPageButton,
  validateInput,
  processData,
  fixLinkAccessibility,
  generateAccessibilityReport,
  writeReport,
  upgradeSystem,
  enhanceSystemWithHarvestedData
} = require('./utils');

const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

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

function uniqueLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) return [];

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') continue;

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

function validateLandmark(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!landmark.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(landmark.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${landmark.tagName}`);
  }

  if (issues.length > 0) return { success: false, issues };

  // Add new validation checks for link accessibility
  if (landmark.tagName.toLowerCase() === 'a') {
    const checkResult = fixLinkAccessibility(landmark);
    if (!checkResult.valid) issues.push(...checkResult.issues);
  }

  return { success: issues.length === 0, issues };
}

// Helper function to check if a link is accessible or needs improvements
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

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  const issues = [];

  if (!link || typeof link !== 'object') {
    return { valid: false, issues: ['Invalid link object'] };
  }

  if (!link.href || (typeof link.href === 'string' && link.href.trim() === '')) {
    issues.push('Missing href attribute');
  }

  if (!link.textContent || link.textContent.trim() === '') {
    issues.push('Missing accessible text content');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// Export all existing and new functions
module.exports = {
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  getUniqueLandmarks,
  validateLinkAccessibility,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  addProperLandmarkRegions,
  createInPageButton,
  validateInput,
  processData,
  fixLinkIssues: fixLinkAccessibility,
  generateAccessibilityReport,
  writeReport,
  upgradeSystem,
  enhanceSystemWithHarvestedData
};