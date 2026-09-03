const express = require('express');
const fs = require('fs');
const path = require('path');
const axe = require('axe-core');
const { a11y } = require('@accessible/react');
import React, { useState, useEffect, useRef } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import App from './App';
import * as newFunctions from './newFunctions';

const config = require('./config');
const logger = require('./utils/logger');

function initializeApp() {
    logger.info('Application starting...');
    appState.initialized = true;
    appState.data = config || {};
    return appState;
}

const { calculateSum } = require('./utils');
const { getLangAttribute: getLangAttributeFromUtils, getFullLangAttribute, validateTableAccessibility: validateTableAccessibilityFromUtils, validateTableStructure: validateTableStructureFromUtils, validateLandmark: validateLandmarkFromUtils, validateLandmarkStructure: validateLandmarkStructureFromUtils, getSvgAccessibleName: getSvgAccessibleNameFromUtils, setSvgAttributes, validateLinkAccessibility: validateLinkAccessibilityFromUtils, handleFakeLinks: handleFakeLinksFromUtils, landmarkStructureCheck } = require('./utils');
const { sortByTitle: sortByTitleLocal, sortByAuthor: sortByAuthorLocal, generateKey: generateKeyLocal, BookItem: BookItemLocal, addBook: addBookLocal, validateTableAccessibility: validateTableAccessibilityLocal, validateLinkAccessibility: validateLinkAccessibilityLocal, handleFakeLinks: handleFakeLinksLocal } = require('./somemodule');
const { sortByTitle: sortByTitleFn, sortByAuthor: sortByAuthorFn, generateKey: generateKeyFn, BookItem: BookItemFn, addBook: addBookFn, ...otherBookFunctions } = require('./bookFunctions');
const { setDependencyGraph, ...otherReduxActions } = require('./redux/actions');
const accessiblyHelper = require('./accessibly-helper');

const { react015, react017, react025, react027, react036, react037, react040, react041, react042 } = require('./reactions');

const CONFIG = {
    dataPath: './data',
    maxResults: 100,
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: 5000,
    name: 'ScreepsBot',
    version: '1.0.0',
    debug: false
};

const appState = {
    initialized: false,
    data: null,
    cache: {}
};

let isInitialized = false;
let dependencyGraph = null;
let books = [];

react015();
react017();
react025();

function ensureDependencyGraphAccessibility() {
    const dependencyGraphEl = document.getElementById('dependencyGraph');
    if (dependencyGraphEl) {
        dependencyGraphEl.setAttribute('role', 'region');
    }
}

function ensureUniqueLandmarks(landmarksArray) {
    if (!landmarksArray || landmarksArray.length === 0) {
        return [];
    }

    const seen = new Set();
    return landmarksArray.map((landmark) => {
        const key = landmark.id + '_' + (landmark.role || 'default');
        if (!seen.has(key)) {
            seen.add(key);
            landmark.id = landmark.id || key;
            landmark = ensureElementHasId(landmark, landmark.id);
            if (!landmark.attributes || !landmark.attributes.aria) {
                landmark.attributes = landmark.attributes || {};
                landmark.attributes.aria = {};
            }
            landmark.attributes.aria.label = ensureLandmarkLabel(landmark);
            return landmark;
        }
        return null;
    }).filter(Boolean);
}

function ensureElementHasId(element, id) {
    if (!element.id) {
        element.id = id;
    }
    return element;
}

function ensureLandmarkLabel(landmark) {
    if (landmark.name) {
        return landmark.name;
    }
    if (landmark.role) {
        return landmark.role.charAt(0).toUpperCase() + landmark.role.slice(1) + ' Landmark';
    }
    return 'Unnamed Landmark';
}

const landmarkSelectors = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'section:not([role])'
];

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

const sortByTitle = sortByTitleLocal || sortByTitleFn;
const sortByAuthor = sortByAuthorLocal || sortByAuthorFn;
const validateLandmark = landmarkStructureCheck || validateLandmarkFromUtils;
const checkLinkAccessibility = validateLinkAccessibilityLocal || validateLinkAccessibilityFromUtils;

export const newExportedFunction = newFunctions.default || newFunctions.function3;

function addLangAttribute() {
    if (typeof document !== 'undefined' && document.documentElement) {
        const lang = document.documentElement.lang || 'en';
        if (!document.documentElement.hasAttribute('lang')) {
            document.documentElement.setAttribute('lang', lang);
        }
    }
}

function getLangAttribute(el) {
    if (typeof document !== 'undefined') {
        return (el || document.documentElement).lang || 'en';
    }
    return 'en';
}

function createInPageButton(buttonText, onClickHandler) {
    return {
        button: {
            onClick: onClickHandler,
            lang: getLangAttribute(),
            text: buttonText
        }
    };
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';

    if (typeof svgElement === 'string') {
        const id = svgElement;
        const svg = document.getElementById(id);
        if (svg) {
            return getSvgAccessibleNameFromUtils ? getSvgAccessibleNameFromUtils(svg) : getSvgAccessibleNameFromElement(svg);
        }
        return '';
    }

    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent;
    }

    const desc = svgElement.querySelector('desc');
    if (desc) {
        return desc.textContent;
    }

    const ariaLabel = svgElement.getAttribute('aria-label') || '';
    return ariaLabel;
}

function getSvgAccessibleNameFromElement(svgElement) {
    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent;
    }
    const desc = svgElement.querySelector('desc');
    if (desc) {
        return desc.textContent;
    }
    return svgElement.getAttribute('aria-label') || '';
}

function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;

    if (typeof tableElement === 'undefined') {
        return validateTableAccessibilityFromUtils ? validateTableAccessibilityFromUtils(document) : false;
    }

    const rows = tableElement.querySelectorAll('tr');
    let hasHeader = false;

    for (const row of rows) {
        const cells = row.querySelectorAll('td, th');
        for (const cell of cells) {
            if (cell.tagName === 'TH') {
                hasHeader = true;
                if (!cell.id) {
                    return false;
                }
            }
        }
    }
    return hasHeader;
}

function validateTableStructure(tableElement) {
    if (!tableElement) return false;

    if (typeof tableElement === 'undefined') {
        return validateTableStructureFromUtils ? validateTableStructureFromUtils(document) : false;
    }

    const cells = tableElement.querySelectorAll('td, th');

    for (const cell of cells) {
        if (cell.tagName === 'TH') {
            if (!cell.id && cell.tagName === 'TH') {
                return false;
            }
        }
    }
    return true;
}

function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('.fake-link, a:not([href])');
    fakeLinks.forEach(link => {
        if (link.tagName === 'A' && !link.href) {
            link.setAttribute('role', 'button');
        }
        if (!link.getAttribute('role')) {
            link.setAttribute('role', 'button');
        }
    });
}

function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        table.setAttribute('role', 'table');
        if (table.caption) {
            table.caption.setAttribute('role', 'caption');
        }
        if (table.tHead) {
            table.tHead.setAttribute('role', 'header');
        }
        if (table.tFoot) {
            table.tFoot.setAttribute('role', 'footer');
        }
        Array.from(table.rows).forEach(row => {
            row.setAttribute('role', 'row');
            Array.from(row.querySelectorAll('th')).forEach(th => {
                th.setAttribute('role', 'columnheader');
                if (!th.scope) {
                    th.setAttribute('scope', 'column');
                }
            });
            Array.from(row.querySelectorAll('td')).forEach(td => {
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
        mainEl.setAttribute('aria-label', getFullLangAttribute ? getFullLangAttribute('main_landmark') : 'Main');
    }
}

function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        const id = svg.getAttribute('id');
        const label = getLangAttribute(id) || svg.getAttribute('aria-label');
        if (!label) {
            svg.setAttribute('aria-label', getLangAttribute() || 'Image');
        }
    });
}

function handleFakeLinks() {
    const fakeLinks = document.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
        if (link.href && (link.href.startsWith('http') || link.href.startsWith('mailto'))) {
            link.setAttribute('role', 'link');
        } else {
            link.setAttribute('role', 'button');
        }
    });
}

async function scanAccessibility() {
    const violations = [];

    if (typeof document !== 'undefined') {
        const results = await axe.run(document);
        violations.push(...results.violations);
    }

    return { violations };
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

function fixIssue(issue) {
    switch (issue.type) {
        case 'fakeLink':
            fixFakeLinks();
            break;
        case 'missingLang':
            addLangAttribute();
            break;
        case 'tableIssue':
            fixTableStructureIssues();
            fixTableHeaderCellScope();
            break;
        case 'dupLandmark':
            ensureUniqueLandmarks();
            break;
        case 'emptyAccessibleName':
            addSvgAccessibleNames();
            break;
        case 'tableStructure':
            fixTableStructureIssues();
            break;
        case 'landmarkStructure':
            validateLandmarkStructure();
            break;
        case 'linkAccessibility':
            validateLinkAccessibility();
            break;
        default:
            break;
    }
}

function setSvgAccessibleNames(id1, id2, label1, label2) {
    if (id1) setSvgAttributes(id1, label1);
    if (id2) setSvgAttributes(id2, label2);
}

function validateLandmarkStructure() {
    return validateLandmarkStructureFromUtils ? validateLandmarkStructureFromUtils(document) : false;
}

function validateLinkAccessibility(url) {
    if (url) {
        return checkLinkAccessibility(url);
    }
    return validateLinkAccessibilityFromUtils ? validateLinkAccessibilityFromUtils(document) : true;
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

function wrapPrimaryContentInMain() {
    const primaryContent = document.querySelector('.primary-content') ||
                            document.querySelector('[role="main"]') ||
                            document.getElementById('main-content') ||
                            document.querySelector('#content');

    if (primaryContent && !primaryContent.closest('main')) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(primaryContent);
        return mainElement;
    }
    return null;
}

exports.validateLandmark = validateLandmark;
exports.validateLinkAccessibility = checkLinkAccessibility;
exports.fixFakeLinks = fixFakeLinks;
exports.scanAccessibility = scanAccessibility;
exports.newExportedFunction = newExportedFunction;
exports.addLangAttribute = addLangAttribute;
exports.createInPageButton = createInPageButton;
exports.getSvgAccessibleName = getSvgAccessibleName;
exports.validateTableAccessibility = validateTableAccessibility;
exports.validateTableStructure = validateTableStructure;
exports.fixTableStructureIssues = fixTableStructureIssues;
exports.fixTableHeaderCellScope = fixTableHeaderCellScope;
exports.addMainLandmark = addMainLandmark;
exports.addSvgAccessibleNames = addSvgAccessibleNames;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.analyzeAccessibility = analyzeAccessibility;
exports.addressAccessibilityIssues = addressAccessibilityIssues;
exports.handleFakeLinks = handleFakeLinks;
exports.getUniqueLandmarks = getUniqueLandmarks;
exports.validateLandmarkStructure = validateLandmarkStructure;
exports.setSvgAccessibleNames = setSvgAccessibleNames;