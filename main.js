const books = [];
const safetyCategory = "User Safety: safe";

const utils = require('./utils');
const axe = require('axe-core');

// Accessibility alerts and handling
const accessiblyHelper = require('./accessibly-helper');

const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

const CONFIG = {
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxResults: 100,
  dataPath: './data',
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true
};

const mergedConfig = CONFIG;

// Accessibility management features
export const upgradeUserSettings = () => {
  let upgradeMessage = '';
  const upgrades = [];

  if (userSafety !== 'safe') {
    upgrades.push({ field: 'userSafety', from: userSafety, to: 'safe' });
  }

  if (safetyCategories.includes('Unauthorized Advice')) {
    upgrades.push({ field: 'safetyCategories', from: safetyCategories, to: ['Authorized Advice'] });
  }

  if (upgrades.length > 0) {
    upgradeMessage = `Upgrade needed: ${upgrades.length} setting(s) require update.`;
  }

  return {
    message: upgradeMessage,
    upgrades: upgrades,
    requiresUpgrade: upgrades.length > 0
  };
};

const userSafety = 'unsafe';
let safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  if (safetyCategories.includes('Unauthorized Advice')) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

const booksFunctions = require('./booksFunctions'); // Import new book management functions
const landmarkValidation = require('./landmarkValidation'); // Import landmark validation functions
const accessibilityAnalysis = require('./accessibilityAnalysis'); // Import accessibility analysis functions
const dependencyAnalysis = require('./dependencyAnalysis'); // Import module dependency analysis functions

module.exports = {
  config,
  CONFIG,
  mergedConfig,

  ...booksFunctions,
  safetyCategory,
  accessiblyHelper,

  ...landmarkValidation,
  userSafety,
  safetyCategories,
  checkUserSafety,
  checkSafetyCategories,

  ...accessibilityAnalysis,
  axeConfig,

  ...dependencyAnalysis,

  // ... Other exported functions and objects
};