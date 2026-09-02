import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import utils from './utils';
import axe from 'axe-core';
const express = require('express');

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
  title: 'Frontend Application',
  version: '1.0.0'
};

const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main']
};

let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

function generateDependencyReport(dependencies) {
  let graph = 'Dependency Tree:\n';
  dependencies.forEach(dep => {
    graph += `- ${dep.name}\n`;
  });
  return { graph };
}

function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
}

const accessiblyHelper = async (...args) => {
  return args;
};

let icons = {};

function validateLandmark(landmark) {
  const errors = [];

  //... Existing validation logic ...

  // Additional validation changes from the other branch
  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  // Check for updated validation changes from another branch that also checks for array composition
  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  // ... Integrated validation logic ...

  return {
    valid: errors.length === 0,
    errors
  };
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// ... Integrated accessibility function calls ...

// Ensure unique landmarks by filtering duplicates
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    // Merge both approaches for checking uniqueness
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

// ... landmarkStructureCheck function ...

// Set language attribute function
function setLanguageAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// Add landmark roles to elements
function addLandmarkRoles() {
  const landmarkSelectors = {
    'nav': 'navigation',
    'main': 'main',
    'footer': 'contentinfo',
    'aside': 'complementary',
    'section': 'region'
  };

  const results = [];
  Object.entries(landmarkSelectors).forEach(([selector, role]) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role);
        results.push({ element: selector, role });
      }
    });
  });

  return results;
}

function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const seen = new Map();
  return elements.filter(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (seen.has(key)) {
      return false;
    }
    seen.set(key, true);
    return true;
  });
}

// ... renderDependencyGraph function ...

// ... renderIndexView function ...

// Calculate sum function
function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    return 0;
  }
  return a + b;
}

// ... addProperLandmarkRegions function ...

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

export {
  validateLandmark,
  checkLandmarkElement,
  ensureUniqueLandmarks,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  processUniqueElements,
  calculateSum,
  ensureLandmarkUniqueness,
  CONFIG
};