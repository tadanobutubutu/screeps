import './styles.css';
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = new Map();

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  debug: true,
  version: '1.0.0'
};

const config = CONFIG;

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

// Helper functions
function validateInput(input) {
  return input !== null && input !== undefined;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Initialize app function
const initializeApp = () => {
  initialize();
  return appState;
};

// Helper functions moved to a separate file
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./helpers');

// Validation functions
function validateLandmark(landmark) {
  const errors = [];
  if (!landmark) {
    errors.push('Landmark is required');
    return { success: errors.length === 0, issues: errors };
  }

  if (!landmark.tagName) {
    errors.push('Missing tagName');
  } else if (!['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'].includes(landmark.tagName.toLowerCase())) {
    errors.push(`Invalid landmark: ${landmark.tagName}`);
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  return { success: errors.length === 0, issues: errors };
}

module.exports = {
  app,
  initializeApp,
  ... // Rest of the exports
};