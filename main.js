const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const config = CONFIG;

const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');

const userSafety = 'unsafe';
const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];

export const checkUserSafety = () => {
  let userSafetyMessage = '';

  if (userSafety !== 'safe') {
    userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
  }

  return userSafetyMessage;
};

export const checkSafetyCategories = () => {
  let safetyCategoriesMessage = '';

  const dangerLevel = safetyCategories.reduce((acc, cat) => acc * 1.1, 1);

  if (dangerLevel > 4) {
    safetyCategoriesMessage = 'Safety categories contain unauthorized advice, dangerous actions, potential scams or privacy risks. Please review and update safety categories accordingly.';
  }

  return safetyCategoriesMessage;
};

function isValidLandmark(landmark) {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
}

// ... (Add functions from the both branches as necessary)

module.exports = {
  CONFIG,
  config,
  userSafety,
  safetyCategories,
  checkUserSafety,
  checkSafetyCategories,
  isValidLandmark,
  // ... (Add functions from both branches as necessary)
};