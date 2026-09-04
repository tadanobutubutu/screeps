import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const { spawn } = require('child_process');

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Landmark validation
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
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

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);
    return uniqueLandmarks;
}

// Ensure unique landmarks list
function ensureUniqueLandmarksList(landmarks) {
    const seen = new Map();
    return landmarks.map(landmark => {
        const tag = landmark.tagName?.toLowerCase() || landmark.type;
        if (seen.has(tag)) {
            landmark.ariaLabel = `${tag}-${seen.get(tag)}`;
            seen.set(tag, seen.get(tag) + 1);
        } else {
            seen.set(tag, 1);
        }
        return landmark;
    });
}

// React improvements
async function renderFunction1() {
  // Existing functionality
  const moduleAReturnValue = await accessiblyHelper(undefined);

  return { moduleAReturnValue };
}

async function renderFunction2() {
  // Existing functionality
  const moduleBReturnValue = await accessiblyHelper(undefined);

  return { moduleBReturnValue };
}

// Accessibility functions
function accessiblyHelper(issuesData) {
  // Implementation placeholder for accessibility helper
  if (issuesData) {
      return issuesData;
  }
  return [];
}

async function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    // Check for images without alt attributes
    const images = document.querySelectorAll('img');
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

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Check if link has href and is not empty
  if (!link.href || link.href.trim() === '') {
    return false;
  }

  // Check if link has accessible name
  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  return true;
}

// New function to handle fake links
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
  });
}

function initialize() {
  console.log('Initializing application...');

  // Add the existing accessibility initialisation logic here if needed
  addMainLandmark();

  // Existing initialization logic preserved

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
}

// Function to set language attribute on the document
function setLanguageAttribute() {
  document.documentElement.lang = 'en';
}

// Function to add landmark roles to main containers
function addLandmarkRoles() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
}

// Function to add the main landmark for accessibility
function addMainLandmark() {
  const mainContent = document.querySelector('main') || document.querySelector('#main');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
    mainContent.setAttribute('aria-label', 'Main content area');
  }
}

// Function to fix fake links (links without href)
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button');
    }
  });
}

export {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    appData,
    someFunction,
    validateInput,
    processData,
    formatResponse,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    setLanguageAttribute,
    addLandmarkRoles,
    addMainLandmark,
    fixFakeLinks,
    validateLinkAccessibility,
    handleFakeLinks,
    initialize,
    generateAccessibilityReport,
    accessiblyHelper
};

// Added wspawnProcess and spawnConcurrent functions
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then((result) => {
                results.push({ success: true, ...result });
                return result;
            })
            .catch((error) => {
                results.push({ success: false, error: error.message });
                throw error;
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return Promise.all(executing).then(() => results);
}