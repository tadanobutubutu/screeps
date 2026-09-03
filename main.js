import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';
import { calculateSum } from './utils/index.js';
import { getFullLangAttribute } from './utils/accessibilityUtils.js';
import { validateTableStructure } from './utils/tableAccessibilityUtils.js';
import { addProperLandmarkRegions } from './utils/landmarkUtils.js';
import { setSvgAttributes } from './utils/svgAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const config = CONFIG;

let isInitialized = false;
const appData_origin = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

const dependencyGraph = null;

function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
    const landmarkIds = elements.map(el => el.id || null);
    const uniqueIds = new Set(landmarkIds);
    return Array.from(uniqueIds);
  }
  return landmarks;
}

function getUniqueLandmarks() {
  // ... (existing function implementation)
}

function getSvgAccessibleName(svg) {
  // ... (existing function implementation)
}

function getLangAttribute() {
  if (navigator.languages && navigator.languages[0]) {
    return navigator.languages[0];
  } else if (navigator.language) {
    return navigator.language;
  } else if (navigator.userLanguage) {
    return navigator.userLanguage;
  }
}

function someNewFunction() {
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024; // MB

  if (process.memoryUsage().heapUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }
}

/**
 * Main entry point for the application (moved from the experience function)
 */
function experience() {
  // Function to get user safety
  function getUserSafety() {
    // Placeholder for actual safety logic
    return {
      safe: true,
      riskLevel: 'low'
    };
  }

  // Function to get safety categories
  function getSafetyCategories() {
    return [
      'Fraud/Deception',
      'Unauthorized Advice',
      'Financial Risk',
      'Security Vulnerability'
    ];
  }

  // Function to calculate discount
  function calculateDiscount(price, discountPercentage) {
    return price * (1 - discountPercentage / 100);
  }

  // New Function 1
  function newFunction() {
    // Implement the new functionality (as per the original commitment)
    return {
      message: 'New functionality activated',
      timestamp: new Date().toISOString()
    };
  }

  // New Function 2
  function newFunction2() {
    // Implement another new functionality
    return {
      message: 'Secondary new feature enabled',
      type: 'enhancement'
    };
  }

  // Existing functions
  function existingFunction1() {
    // Existing implementation
    return 'existing_function_1';
  }

  function existingFunction2() {
    // Existing implementation
    return 'existing_function_2';
  }

  // ... (existing implementation of experience function for the rest of safety functions, existingFunction1, and existingFunction2)
}

// User Safety: unsafe
// Safety Categories: Fraud/Deception, Unauthorized Advice

function checkLandmarkElement(elementOrId) {
  // Implementation addressed accessibility issues from insight report
  // Handle both DOM elements and id strings
  const element = (typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId);

  if (!element) {
    return false;
  }

  // Check if element has landmark-related attributes or proper role
  const hasRole = element.getAttribute && element.getAttribute('role');
  const hasAriaLabel = element.getAttribute && element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute && element.getAttribute('aria-labelledby');

  // Must have either a role or accessible name to be a valid landmark element
  if (!(hasRole || hasAriaLabel || hasAriaLabelledby)) {
    if (element.id) {
      const id = typeof elementOrId === 'string' ? elementOrId : element.id;
      if (id) {
        element.setAttribute('aria-labelledby', id);
      }
    }
  }

  return element;
}

function ensureUniqueLandmarks(landmarksArray, keepOriginal) {
  if (!landmarksArray || !Array.isArray(landmarksArray) || landmarksArray.length === 0) {
    return [];
  }

  const seen = new Set();

  return landmarksArray.filter((landmark, index, self) => {
    if (index !== self.findIndex(item => {
      if (keepOriginal && landmark.id === item.id) {
        return true;
      }

      const name = landmark.name || '';
      const role = landmark.role || 'default';
      const key = name + '_' + role;

      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })) {
      return false;
    }
    return true;
  });
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  // ... (existing implementation of the newFocusTrap function)
}

// ... (existing functions: addressInsightIssues, addFixLandmarkIssues, getSvgAccessibleName, validateTableAccessibility, validateTableStructure, scanAccessibility, validateLinkAccessibility, handleFakeLinks, validateLandmark, validateLandmarkStructure, initialize, loadLandmarks, processLandmarks, ensureUniqueLandmarks, checkLandmarkElement, validateLandmarkData, setSvgAttributes, getSvgProps, createAccessibleLink, getLangAttribute, createInPageButton, wrapPrimaryContentInMain, addLangAttribute)

module.exports = {
  getLangAttribute,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  validateLinkAccessibility,
  handleFakeLinks,
  checkLandmarkElement,
  newFocusTrap,
  addressInsightIssues,
  addFixLandmarkIssues,
  validateLandmarkStructure,
  scanAccessibility,
  someNewFunction,
  calculateSum,
  newFunction,
  newFunction2,
  experience
};