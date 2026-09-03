import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';
import {
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  validateTableStructure as validateTableStructureLocal,
  someNewFunction,
  newFocusTrap,
  addressInsightIssues
} from './utils/index.js';
import { CONFIG, safetyCategory } from './utils/constants.js';

let isInitialized = false;
const appData = {};

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function someNewFunction() {
  // Safety check function for the bot
  const config = CONFIG || {};
  const maxMemoryUsage = config.maxMemory ? config.maxMemory : 1024 * 1024; // MB

  if (process.memoryUsage().heapUsed / 1024 / 1024 > maxMemoryUsage) {
    console.warn('High memory usage detected');
    return true;
  }

  // Additional safety validation logic
  return false;
}

function newFocusTrap(containerElement, options = {}) {
  // Function to handle focus trap for keyboard navigation (merged from both changes)
  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let trapActivate = null;

  const getFocusableElements = (container) => {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ];

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(containerElement);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const activate = () => {
    previouslyFocusedElement = document.activeElement;
    updateFocusableElements();

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    trapActivate = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else { // tab
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', trapActivate);
  };

  const deactivate = () => {
    document.removeEventListener('keydown', trapActivate);
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    previouslyFocusedElement = null;
  };

  return {
    activate,
    deactivate
  };
}

function addressInsightIssues() {
  // Function to address accessibility issues as per the insight report
  // Include accessibility improvements merged from both commits
  const insightReport = someNewFunction() ? { html: '' } : /* original implementation here */;

  // REACT_015: Add lang attribute
  insightReport.html = addLangAttribute(insightReport.html);
  // REACT_027: Fix table structure issues
  insightReport.html = fixTableStructure(insightReport.html);
  insightReport.html = validateTableStructureLocal(insightReport.html);
  insightReport.html = validateTableAccessibility(insightReport.html);
  // REACT_017: Ensure unique landmarks
  insightReport.html = ensureUniqueLandmarks(insightReport.html);
  insightReport.html = ensureUniqueLandmarksById(insightReport.html);
  // REACT_041: Add accessible names to 2 SVGs
  insightReport.html = addSvgAccessibleNames(insightReport.html);
  insightReport.html = addSvgAccessibleNamesDom(insightReport.html);
  // REACT_036: Fix 1 fake link issue
  insightReport.html = fixFakeLinks(insightReport.html);
  insightReport.html = fixFakeLinksDom(insightReport.html);
  // REACT_042: Ensure dependencyGraph container has proper ARIA role
  insightReport.html = setDependencyGraphAriaRole(insightReport.html);
  // New: Implement focus trap for keyboard navigation
  insightReport.html = newFocusTrap(insightReport.html);

  return insightReport;
}

export {
  initializeApp,
  registerSW,
  express,
  axe,
  fs,
  fastMap,
  path,
  accessiblyHelper,
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  someNewFunction,
  newFocusTrap,
  addressInsightIssues,
  // Remaining exports ...
};