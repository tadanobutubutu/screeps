// Find the primary content element in the DOM
const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// TODO: This is the existing code that needs to be preserved

// TODO: Implement function for addressing accessibility issues from insight report

// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, ensureAccessibilityAttributesForAddBook } from './bookFunctions';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import fs from 'fs';
import './styles.css';
import './styles.less';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure, fixTableStructure } from './utils/tableAccessibilityUtils';
import { addMainLandmark, validateLandmark, validateLandmarkStructure, validateLandmarkAttributes } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { ensureUniqueLandmarks } from './utils/uniqueLandmarksUtils';
import { createInPageButton } from './utils/inPageButtonUtils';
import { createAccessibleLink, handleAccessibilityIssues, validateLandmarkData, ensureLandmarkUniqueness, addMainLandmark, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, createInPageButton } from './utils/landmarkUtils';
import { setSvgAttributes } from './utils/svgAccessibilityUtils';
import { ensureLandmarkUniqueness } from './utils/uniqueLandmarksUtils';
import { createInPageButton } from './utils/inPageButtonUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { calculateDependencyTree, generateDependencyString } from './utils/dependencyTree';
import { CONFIG } from './utils/constants';
import App from './App';
import { helper, formatDate } from './utils';
import { someFunction } from './utils/someFunction';
import express from 'express';
import path from 'path';
import { fetchUser, clearCache } from './utils/user';
import effectorSW from 'effector-sw';

// New functions to address the listed issues
function addLangAttribute(element) {
  // Adds lang attribute to the given HTML element
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', 'en');
  }
  return element;
}

const config = {
  port: PORT,
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

function addBook(bookData) {
  // ... Existing code ...
  return bookData;
}

function getLangAttribute() {
  // Determine the language based on content or default to English
  // This resolves the language attribute for accessibility
  return 'en';
}

function personName() {
  // Handle person name accessibility requirements
  // Returns a suitable name for accessibility purposes
  return 'Person Name';
}

function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (name) {
      setSvgAccessibilityProps(svg, name);
    }
  });
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  // Check for existing accessible name
  const ariaLabel = svgElement.getAttribute('aria-label');
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  const title = svgElement.querySelector('title');
  
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledBy) {
    const referenced = document.getElementById(ariaLabelledBy);
    if (referenced) return referenced.textContent;
  }
  if (title && title.textContent) return title.textContent;
  
  // Try to derive from context
  const parent = svgElement.parentElement;
  if (parent) {
    const label = parent.getAttribute('aria-label') || parent.textContent?.trim();
    if (label) return label;
  }
  
  return null;
}

function setSvgAccessibilityProps(svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }

  // Ensure SVG has role="img" if it's purely decorative or informative
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }

  return svgElement;
}

function validateTableAccessibility(table, index) {
  const issues = [];
  
  if (!table) {
    issues.push(`Table at index ${index}: Table element is missing or null`);
    return issues;
  }
  
  // Check for caption
  if (!table.querySelector('caption')) {
    issues.push(`Table at index ${index}: Missing <caption> element`);
  }
  
  // Check for header cells
  const hasTh = table.querySelector('th');
  if (!hasTh) {
    issues.push(`Table at index ${index}: Missing header cells (<th>)`);
  }
  
  // Check for scope attributes on headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, i) => {
    if (!th.getAttribute('scope')) {
      issues.push(`Table at index ${index}, header ${i}: Missing scope attribute`);
    }
  });
  
  // Check for proper table structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push(`Table at index ${index}: No rows found`);
  }
  
  return issues;
}

function validateTableStructure() {
  // Check 26 table structure issues
  // Also check the table structure and return a boolean value indicating the result
  const issues = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach((tableItem, index) => {
    const tableIssues = validateTableAccessibility(tableItem, index);
    issues.push(...tableIssues);
  });

  // Check for proper table nesting
  const nestedTables = document.querySelectorAll('table table');
  if (nestedTables.length > 0) {
    issues.push(`Found ${nestedTables.length} nested tables - consider avoiding nested tables for accessibility (REACT_027)`);
  }

  return issues;
}

function validateLandmark(element) {
  const resolveStructuralIssues = (element) => {
    const issues = [];
    const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

    if (!element.tagName) {
      issues.push('Missing tagName');
    } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
      issues.push(`Invalid landmark: ${element.tagName}`);
    }

    if (element.nodeName && element.nodeName.toLowerCase() === 'div' && !element.getAttribute('role')) {
      issues.push('Missing role attribute');
    }

    return issues;
  };

  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region',
    'form'
  ];

  if (!arguments.length) {
    return resolveStructuralIssues(document.documentElement);
  }

  const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

  const implicitLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form'
  };

  const issues = resolveStructuralIssues(element);
  
  return {
    success: issues.length === 0,
    issues
  };
}

function validateLandmarkStructure() {
  const issues = [];
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role="banner"], [role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="region"], [role="form"]');
  
  landmarks.forEach((landmark, index) => {
    const validation = validateLandmark(landmark);
    if (!validation.success) {
      validation.issues.forEach(issue => {
        issues.push(`Landmark ${index} (${landmark.tagName}): ${issue}`);
      });
    }
  });
  
  // Check for duplicate main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    issues.push(`Found ${mainElements.length} main landmarks - should have only one (REACT_025)`);
  }
  
  // Check for missing main landmark
  if (mainElements.length === 0) {
    issues.push('Missing main landmark (REACT_017)');
  }
  
  return issues;
}

function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length <= 1) return true;
  
  let fixed = false;
  for (let i = 1; i < mainElements.length; i++) {
    const element = mainElements[i];
    if (element.tagName.toLowerCase() === 'main') {
      element.outerHTML = element.outerHTML
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
    } else {
      element.removeAttribute('role');
      element.setAttribute('role', 'region');
    }
    fixed = true;
  }
  
  return fixed;
}

function createInPageButton(buttonId, buttonText) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  return button;
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }

  return svgElement;
}

function ensureElementHasId(element) {
  if (!element) return;
  const name = element.getAttribute('id');
  if (!name) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

function ensureElementId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!label) {
    throw new Error('aria-label value is required');
  }
  element.setAttribute('aria-label', label);
  return element;
}

function handleFakeLinks(issues) {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[onclick], div[onclick], span[onclick]');
  const fixed = [];
  
  fakeLinks.forEach((link, index) => {
    if (link.tagName.toLowerCase() === 'a' && (link.getAttribute('href') === '#' || link.getAttribute('href') === 'javascript:void(0)')) {
      // Convert to button
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.className = link.className;
      button.id = link.id;
      link.parentNode.replaceChild(button, link);
      fixed.push(`Converted fake link ${index} to button`);
    } else if ((link.tagName.toLowerCase() === 'div' || link.tagName.toLowerCase() === 'span') && link.onclick) {
      // Convert to button
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.className = link.className;
      button.id = link.id;
      button.onclick = link.onclick;
      link.parentNode.replaceChild(button, link);
      fixed.push(`Converted fake link ${index} (${link.tagName}) to button`);
    }
  });
  
  if (issues && Array.isArray(issues)) {
    issues.push(...fixed);
  }
  
  return fixed;
}

function validateLinkAccessibility(link) {
  const issues = [];
  
  if (!link) return issues;
  
  // Check if it's a real link or fake link
  const href = link.getAttribute('href');
  if (!href || href === '#' || href.startsWith('javascript:')) {
    issues.push('Fake link detected - should be a button');
  }
  
  // Check for accessible name
  const text = link.textContent?.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  
  if (!text && !ariaLabel && !ariaLabelledBy) {
    issues.push('Link missing accessible name');
  }
  
  // Check for meaningful text
  if (text && text.length < 2 && !ariaLabel && !ariaLabelledBy) {
    issues.push('Link text may be too short to be meaningful');
  }
  
  return issues;
}

function ensureUniqueLandmarksFromString(source) {
  const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

  const matches = Array.from(source.matchAll(mainBlockRegex));
  if (matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i][0];
    const fixedBlock = block
      .replace(/<main([^>]*)>/, '<section$1>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
}

function addressAccessibilityIssues(insightReport) {
  // If no report provided, return an empty array
  if (!Array.isArray(insightReport)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }

  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute();
  ensureUniqueLandmarks(landmarks);
  addMainLandmark();
  addSvgAccessibleNames();
  ensureLandmarkUniqueness(landmarks);
  fixFakeLinkIssue();
  fixTableStructure();
}

function initializeApp() {
  addressInsightIssues();
  wrapPrimaryContentInMain();
}

function fixFakeLinkIssue() {
  // Fix 1 fake link issue
}

// Render dependency graph function
export {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  createInPageButton,
  addSvgAccessibleName,
  handleFakeLinks,
  countDependencies,
  countPackageDependencies,
  addressAccessibilityIssues,
  addressNewAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  spawnCommand,
  processSvgElements,
  ensureElementId,
  ensureUniqueLandmarksFromString,
  addLangAttribute,
  getSvgAccessibleName,
  setSvgAccessibilityProps,
  validateLinkAccessibility,
  validateLandmarkStructure,
  createAccessibleLink,
  handleAccessibilityIssues,
  validateLandmarkData,
  ensureLandmarkUniqueness,
  setSvgAttributes,
  ensureUniqueLandmarks,
  landmarks,
  appData,
  icons,
  processInput
};

// Additional utility functions
export {
  countDependencies,
  addBook,
  BookItem,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  ensureDependencyGraphARIA,
  Main,
  validateLandmarkInput,
  landmarkStructureCheck,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  createInPageButtons,
  fixFakeLinkIssue,
  addSvgAccessibleNames,
  ensureUniqueLandmarksDoc,
  calculateDependencyTree,
  generateDependencyString,
  effectorSW,
  effector
};