const fs = require('fs');
const path = require('path');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const { spawn } = require('child_process');
const accessiblyHelper = require('./accessibly-helper');

const {
  greet,
  add,
  getDependencies,
  addDependency,
  removeDependency,
  someFunction,
  validateInput,
  processData,
  formatResponse,
} = require('./mainAdapted');

const {
  validateTableAccessibility,
  validateTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  initialize: initializeAdapted,
} = require('./mainAccessibility');

const { getSafetyCategory, getSafetyCategoryDetailed, getUserSafetyInfo, isUserSafetyUnsafe, hasSafetyCategory, loadUserSafetyInfo } = require('./userSafety');

const CONFIG = {
  dataPath: './data',
  maxResults: 100,
};

const appData = {
  title: 'Screeps',
  version: '1.0.0',
};

const appData_originSide = {};
let dependencyGraph = {};
const userSafetyCategories = {
  unsafe: true,
  categories: ['Unauthorized Advice', 'Fraud/Deception', 'Controlled/Regulated Substances', 'Unauthorized Advice'],
};

const initExpress = () => {
  const app = express();
  const axeBrowser = accessiblyHelper.axeBrowser();

  app.use(async (req, res, next) => {
    const { url } = req;
    const { data } = await axeBrowser.analyze(url);
    if (data && data.violations.length > 0) {
      console.error(`Violations detected at ${url}:`, data.violations);
    }
    next();
  });

  app.post('/greet', greet);
  app.post('/add', add);
  app.post('/getDependencies', getDependencies);
  app.post('/addDependency', addDependency);
  app.post('/removeDependency', removeDependency);
  app.post('/someFunction', someFunction);
  app.post('/validateInput', validateInput);
  app.post('/processData', processData);
  app.post('/formatResponse', formatResponse);
  app.post('/validateTableAccessibility', validateTableAccessibility);
  app.post('/validateTableStructure', validateTableStructure);
  app.post('/init', initializeAdapted);
  app.post('/getSafetyCategory', getSafetyCategory);
  app.post('/getSafetyCategoryDetailed', getSafetyCategoryDetailed);
  app.post('/getUserSafetyInfo', getUserSafetyInfo);
  app.post('/isUserSafetyUnsafe', isUserSafetyUnsafe);
  app.post('/hasSafetyCategory', hasSafetyCategory);
  app.post('/loadUserSafetyInfo', loadUserSafetyInfo);

  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
};

const initialize = () => {
  console.log('Initializing application...');
  return true;
};

module.exports = {
  init: initExpress,
  initialize,
};