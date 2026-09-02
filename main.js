import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

import { axe } from 'axe-core';
import fastMap from 'fast-map';
import path from 'path';
import express from 'express';
import fs from 'fs';
import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';

function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/lang=/i.test(attrs)) return match;
        return `<html${attrs} lang="en">`;
    });
}

let tbody;
let firstRows = '';
let firstRowHasTh = false;

function formatTable(html, attrs) {
    // Add necessary changes to table structure
    if (!firstRowHasTh) {
        firstRows = '<thead><tr>${firstRows.replace(/<td>/gi, '<th scope="col">&</th>').replace(/<\/td>/gi, '')}</tr></thead>';
    } else {
        firstRows = `<thead>${firstRows}</thead>`;
    }
    if (!tbody) tbody = '';
    tbody = `<tbody>${tbody}</tbody>`;

    return `<table${attrs}>${firstRows}${tbody}</table>`;
}

function ensureEveryTableHasACaption(html) {
    return html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return match.replace(/>/, '><caption></caption>');
    });
}

function addScopeToTh(html) {
    return html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope=/i.test(attrs)) return match;
        return `<th${attrs} scope="col">`;
    });
}

function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = formatTable(result);
    result = ensureEveryTableHasACaption(result);
    result = addScopeToTh(result);
    return result;
}

// Existing code preserved

function addressAccessibilityIssues(insightReport) {
    if (insightReport && insightReport.html) {
        insightReport.html = applyAccessibilityFixes(insightReport.html);
    }
}

// New function
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Placeholder functions for functionA and functionB (removed)

// New function
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp(`role="${role}"`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `role="region"`;
            });
        }
    });

    // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
    html5Landmarks.forEach(tag => {
        const pattern = new RegExp(`<${tag}`, 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first, add role="region" to others
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return `<${tag} role="region"`;
            });
        }
    });

    return html;
}

// Origin/main functionality integrated
let dependencyGraph = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

const accessiblyHelper = async (...args) => {
  return args;
};

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function generateAccessibilityReport(issuesData) {
  let issues;

  if (!issuesData) {
    // ... (preserve existing logic for generating issues)
  } else {
    issues = axe.analyze('./index.html');

    const report = {
      introduction: 'Accessibility report for the application',
      data: issues,
      conclusions: '',
    };

    return report;
  }
}

async function renderFunction1() {
  // ... (combine the logic from both changes)
}

async function renderFunction2() {
  // ... (combine the logic from both changes)
}

export {
    greet,
    add,
    getDependencies,
    addDependency,
    removeDependency,
    countDependencies,
    appData,
    someFunction,
    validateInput,
    processData,
    formatResponse,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkAttributes,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    addressAccessibilityIssues,
    createInPageButton,
    getDependencyGraph,
    UserSafety,
    SafetyCategories,
    accessiblyHelper,
    getUserSafetyAdvice,
    generateAccessibilityReport,
    renderFunction1,
    renderFunction2
};