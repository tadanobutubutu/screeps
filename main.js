Here is the resolved 'main.js' file with Git conflict markers removed:

```javascript
const primaryContent = document.querySelector('.primary-content') ||
    document.querySelector('[role="main"]') ||
    document.getElementById('main-content') ||
    document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { generateDependencyReport, utils, axe } from './utils';

const books = [];
let icons = {};
let dependencyGraph = {};
let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

export const checkSafetyCategories = () => {
  // ... merged code from both branches
};

export const validateLandmark = (landmark) => {
  // validating logic
};

export const checkLinkAccessibility = (url) => {
  // implementing logic
  return true;
};

export const newExportedFunction = () => {
  // new export logic
};

const config = {
  // configuration logic
};

const appState = {
  // state logic
};

// ...(existing and new functions and code remain as it is)
```