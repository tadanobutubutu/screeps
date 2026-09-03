import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import { requireCache } from 'fast-mapping';
import fs from 'fs';
import { validateTableAccessibility, validateTableStructure } from './tableAccessibilityUtils.js';
import { calculateSum, getLangAttribute } from './utils/index.js';
import { validateLandmark, validateLandmarkStructure } from './landmarkAccessibilityUtils.js';
import { setSvgAttributes } from './svgAccessibilityUtils.js';
import { validateLinkAccessibility } from './linkAccessibilityUtils.js';
import { validateButtonAccessibility } from './buttonAccessibilityUtils.js';
import { CONFIG } from './utils/constants.js';
import appData from './appData.json';

const config = CONFIG;

const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
  },
  silent: true,
};

function initialize() {
  const appDataUpdated = JSON.parse(JSON.stringify(appData)); // Make a shallow copy of appData

  // Implement accessibility fixes
  validateTableAccessibility(document.querySelector('table'));
  validateTableStructure(document.querySelector('table'));

  // Rest of your accessibility functions

  // Update appData with the fixed version
  const appDataFilePath = './appData.json';
  fs.writeFileSync(appDataFilePath, JSON.stringify(appDataUpdated));

  initializeApp();
}

initialize();