import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';
import { greet, add, getDependencies, addDependency, removeDependency, countDependencies, appData, someFunction, validateInput, processData, formatResponse } from './mainAdapted';
import { validateTableAccessibility, validateTableStructure, fixTableStructure, addMainLandmark, validateLandmark, validateLandmarkAttributes, validateLandmarkStructure } from './mainAccessibility';
import express from 'express';
import axe from 'axe-core';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import { spawn } from 'child_process';

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

const config = CONFIG;

// Application state
let isInitialized = false;
const appData_originSide = {};
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

// Helper for input transformation
function helper(input) {
  return input ? input.toUpperCase() : '';
}

// Helper function to format dates
function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString();
}

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Landmark validation
function isValidLandmark(landmark) {
    return landmark && typeof landmark.id !== 'undefined' && landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function processLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }

    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarksList(validLandmarks);
    return uniqueLandmarks;
}

// REACT_015: Add lang attribute
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

function getLangAttribute() {
    return 'en';
}

// Ensure unique landmarks list
function ensureUniqueLandmarksList(landmarks) {
    const seen = new Map();
    return landmarks.map(landmark => {
        const tag = landmark.tagName?.toLowerCase() || landmark.type;
        if (seen.has(tag)) {
            landmark.ariaLabel = `${tag}-${seen.get(tag)}`;
            seen.set(tag, seen.get(tag) + 1);
        } else {
            seen.set(tag, 1);
        }
        return landmark;
    });
}

// TODO: Implement checkLandmarkElements
function checkLandmarkElements() {
    console.log('Checking landmark elements...');
}

// Function to create an in-page button with added accessibility improvements
function createInPageButton() {
    if (typeof document === 'undefined') return;
    const button = document.createElement('button');
    button.textContent = 'Accessibility Info';
    button.setAttribute('aria-label', 'Show accessibility information');

    button.setAttribute('role', 'button'); // Add role attribute for better accessibility
    button.setAttribute('tabindex', '-1'); // Add tabindex attribute to hide from initial focus

    return button;
}

// Function to add proper landmark regions function
function addLandmarkRegions() {
    if (typeof document === 'undefined') return;
    const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="complementary"], [role="contentinfo"], [role="search"]');

    landmarks.forEach(landmark => {
        if (landmark.innerText) {
            const label = document.createElement('span');
            label.className = 'sr-only';
            label.textContent = landmark.innerText || 'region';
            landmark.append(label);
        }

        if (landmark.parentElement && landmark.parentElement.parentNode.closest('[role="region"]')) {
            console.warn('Nested landmark regions detected. This may cause accessibility issues.');
        }

        // Example of a function call to be added here
        // function3();
    });
}

function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;
    return tableElement.hasAttribute('aria-labelledby');
}

function validateTableStructure(tableElement) {
    if (!tableElement) return false;

    // Check if table has proper row and cell structure
    const rows = tableElement.querySelectorAll('tr > td');
    let validStructure = true;

    rows.forEach(row => {
        if (row.tagName !== 'TD') {
            validStructure = false;
        }
    });

    return validStructure;
}

/**
 * Spawns a child process with the given command and arguments.
 * @param {string} command - The command to execute.
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {Object} options - Optional spawn options.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, options);

        child.on('error', reject);

        child.stdout.on('data', data => resolve({ ...data, exitCode: null }));
        child.stderr.on('data', data => reject({ ...data, exitCode: null }));
        child.on('close', code => resolve({ ...{}, exitCode: code }));
    });
}

/**
 * Spawns multiple processes concurrently with a limit on concurrency.
 * @param {Array<{command: string, args?: string[], options?: Object}>} tasks - Array of tasks to spawn.
 * @param {number} concurrency - Maximum number of concurrent processes.
 * @returns {Promise<Array<{stdout: string, stderr: string, exitCode: number}>>}
 */
async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then(result => {
                results.push(result);
                return result;
            })
            .catch(error => {
                console.error(error);
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return results;
}

// Function to trap focus in modal and announce welcome message
function trapFocusInModal() {
    if (a11y && a11y.trapFocus) {
        const modalElement = document.querySelector('#exampleModal');
        if (modalElement) {
            a11y.trapFocus(modalElement);
        }
    }

    if (a11y && a11y.announce) {
        a11y.announce('Welcome to the Bot!');
    }
}

// Function to validate a given function name, and execute it if found
function validateAndExecuteFunction(functionName, callback) {
    let functionToCall = null;
    const functions = [createInPageButton, addLangAttribute, getLangAttribute, ensureUniqueLandmarksList, checkLandmarkElements, addLandmarkRegions, trapFocusInModal];

    for (const fn of functions) {
        if (fn.name === functionName) {
            functionToCall = fn;
            break;
        }
    }

    if (functionToCall) {
        callback(functionToCall);
    } else {
        console.warn(`Function "${functionName}" not found`);
    }
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
    spawnProcess,
    spawnConcurrent,
    validateAndExecuteFunction
};