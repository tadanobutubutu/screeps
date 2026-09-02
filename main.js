const books = [];
const safetyCategory = "User Safety: safe";
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

const safetyCategories = ["Unauthorized Advice"];
const utils = require('./utils');

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

let isInitialized = false;

function helpler(input) {
  return input ? input.toUpperCase() : '';
}

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function validateLandmark(landmark) {
  const errors = [];
  // Existing code that should be preserved
  // Update landmark validation logic if needed
  const role = landmark && landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
  if (role && !CONFIG.allowedRoles.includes(role)) {
    errors.push('Invalid landmark role: ' + role);
  }
  // Additional validation for null/undefined landmark
  if (!landmark) {
    errors.push('Landmark is null or undefined');
  }
  // Additional check for non-object input
  if (typeof landmark !== 'object') {
    errors.push('Landmark must be an object');
  }
  return errors;
}

function validateLandmarkStructure(landmarks) {
  const issues = [];
  let hasMain = false;
  let hasNavigation = false;

  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmarkSingle(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  } else {
    const allLandmarks = document.querySelectorAll ? document.querySelectorAll('header, nav, main, aside, footer, section, article') : [];
    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
  }

  if (!hasMain) console.warn('Missing main landmark');
  if (!hasNavigation) console.warn('Missing navigation landmark');

  return {
    success: hasMain && hasNavigation && issues.length === 0,
    issues
  };
}

function validateLandmarkSingle(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push('Invalid landmark: ' + element.tagName);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

// ... (Remaining exported functions and modules not listed here)

module.exports = {
  // ... (Remaining exported functions)
};