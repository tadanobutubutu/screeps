const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getLangAttribute,
  validateLinkAccessibility,
  analyzeAccessibility,
  addressAccessibilityIssues,
  handleFakeLinks
} = require('./utils');

import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute as getLangAttributeFromUtils, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility as validateTableAccessibilityFromUtils, validateTableStructure as validateTableStructureFromUtils } from './utils/tableAccessibilityUtils';
import { validateLandmark as validateLandmarkFromUtils, validateLandmarkStructure as validateLandmarkStructureFromUtils } from './utils/landmarkUtils';
import { validateLinkAccessibility as validateLinkAccessibilityFromUtils, handleFakeLinks as handleFakeLinksFromUtils } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

export const validateLandmark = (landmark) => {
  const errors = [];

  // Validation logic

  return {
    valid: errors.length === 0,
    errors
  };
};

export const checkLinkAccessibility = (url) => {
  // Implementation logic here...
  return true;
};

export const newExportedFunction = () => {
  // New export logic here...
};

// Ensure accessibility attributes are set when adding a book
ensureAccessibilityAttributesForAddBook();

// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      return mainElement;
  }
  return null;
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Add ARIA roles
    table.setAttribute('role', 'table');
    table.getElementsByTagName('caption')[0].setAttribute('role', 'caption');
    table.tHead.setAttribute('role', 'header');
    table.tFoot.setAttribute('role', 'footer');
    table.rows.forEach(row => {
      row.setAttribute('role', 'row');
      row.getElementsByTagName('th').forEach(th => {
        th.setAttribute('role', 'columnheader');
      });
      row.getElementsByTagName('td').forEach(td => {
        td.setAttribute('role', 'cell');
      });
    });
  });
}

function fixTableHeaderCellScope() {
  const tableHeadings = document.querySelectorAll('thead th, tbody th, tfoot th');
  tableHeadings.forEach(heading => {
    if (!heading.scope) {
      heading.setAttribute('scope', 'column');
    }
  });
}

function addMainLandmark() {
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.setAttribute('id', 'mainLandmark');
    mainEl.setAttribute('aria-label', getFullLangAttribute('main_landmark'));
  }
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const id = svg.getAttribute('id');
    const label = getLangAttribute(id) || svg.getAttribute('aria-label');
   if (!label) {
      svg.setAttribute('aria-label', getLangAttribute('default_svg'));
    }
  });
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function getLangAttribute(el = document.documentElement) {
  return el.lang || getLangAttributeFromUtils();
}

function validateTableAccessibility() {
  return validateTableAccessibilityFromUtils(document);
}

function validateTableStructure() {
  return validateTableStructureFromUtils(document);
}

function validateLandmark() {
  return validateLandmarkFromUtils(document);
}

function validateLandmarkStructure() {
  return validateLandmarkStructureFromUtils(document);
}

function validateLandmarkAttributes() {
  return validateLandmarkAttributesFromUtils(document);
}

function getSvgAccessibleName(id = null, label = null) {
  if (id) {
    const svg = document.getElementById(id);
    if (svg) {
      setSvgAttributes(id, label || getLangAttribute(id));
    }
  }

  return [];
}

function validateLinkAccessibility() {
  return validateLinkAccessibilityFromUtils(document);
}

function analyzeAccessibility(issuesData) {
  return issuesData || [];
}

function addressAccessibilityIssues() {
  const accessibilityIssues = analyzeAccessibility(document);

  if (accessibilityIssues.length > 0) {
    accessibilityIssues.forEach(issue => {
      fixIssue(issue);
    });
  }
}

function createInPageButton() {
  const buttonEl = createInPageButtonFromUtils(getLangAttribute());
  if (buttonEl) {
    document.body.appendChild(buttonEl);
  }
}

function setSvgAccessibleNames(id1, id2, label1, label2) {
  setSvgAttributes(id1, label1);
  setSvgAttributes(id2, label2);
}

function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.textContent.trim()) {
      link.textContent = getLangAttribute(link);
    }
  });
}

function validateLinkAccesibility(url) {
  // Implementation logic here...
  return checkLinkAccessibility(url);
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link.href.startsWith('http') || link.href.startsWith('mailto')) {
      link.setAttribute('role', 'link');
    } else {
      link.setAttribute('role', 'button');
    }
  });
}

function fixIssue(issue) {
  switch (issue.type) {
    case 'fakeLink':
      fixFakeLink();
      break;
    case 'missingLang':
      setLanguageAttribute();
      break;
    case 'tableIssue':
      fixTableStructureIssues();
      fixTableHeaderCellScope();
      break;
    case 'dupLandmark':
      ensureUniqueLandmarks();
      break;
    case 'emptyAccessibleName':
      setSvgAccessibleNames();
      break;
    case 'tableStructure':
      fixTableStructureIssues();
      break;
    case 'landmarkStructure':
      checkLandmarkElement();
      break;
    case 'landmarkAttribute':
      checkLandmarkAttributes();
      break;
    case 'linkAccessibility':
      validateLinkAccesibility();
      break;
    default:
      break;
  }
}

function setLanguageAttribute() {
  document.documentElement.lang = getLangAttribute();
}

function checkLandmarkElement(id) {
  return document.getElementById(id) !== null;
}

function checkLandmarkAttributes() {
  const landmarks = getElementsBySelector(landmarkSelectors.join(','), true);
  landmarks.forEach(landmark => {
    // Check for missing required attributes
    const ariaAttributes = ['id', 'role'];
    ariaAttributes.forEach(attribute => {
      if (!landmark.hasAttribute(attribute)) {
        landmark.setAttribute(attribute, '');
      }
    });
  });
}

// Utility functions
function getElementsBySelector(selector, isString) {
  let elements = Array.from(document.querySelectorAll(selector));
  if (isString) {
    elements = document.getElementsByClassName(selector);
  }
  return elements;
}

module.exports = {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  createInPageButton,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateLinkAccessibility,
  analyzeAccessibility,
  addressAccessibilityIssues,
  handleFakeLinks
};