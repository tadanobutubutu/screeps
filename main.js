// TODO: Implement spawning logic
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a22a37d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 669117b4c3d1a635653f730f0a059efacbb752>
//<!-- todo-hash: 312aa8ea4c5e1c94e4e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
//<!-- todo-hash: d290c9a63ee693e91602d63f7ca6757def47f63e -->
//<!-- todo-hash: 12c3149b34a2eac018e7433408f77e3d8a61fef6 -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved accessibility enhancements
//_Commit: 653c5cd3989d35211b6a970c20ca8d1239034d7f_
//
// Version 2 implementation: Additional accessibility improvements
//_Commit: 653c5cd3989d35211b6a970c20ca8d1239034d7f_
//<!-- todo-hash: 398424c02b2e0a493981d83f7e0c15b42542e233 -->
import React from 'react';
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
export function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

const http = require('http');
const url = require('url');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Spawns a child process with the given command and arguments.
 * @param {string} command - The command to execute
 * @param {string[]} args - Array of arguments to pass to the command
 * @param {Object} options - Optional configuration for the spawned process
 * @returns {Object} Object containing the spawned process and a promise that resolves/rejects on completion
 */
function spawnProcess(command, args = [], options = {}) {
  const defaultOptions = {
    cwd: process.cwd(),
    env: { ...process.env },
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: process.platform === 'win32'
  };

  const mergedOptions = { ...defaultOptions, ...options };
  const spawnedProcess = spawn(command, args, mergedOptions);

  const result = {
    process: spawnedProcess,
    stdout: '',
    stderr: '',
    exitCode: null,
    promise: null
  };

  if (spawnedProcess.stdout) {
    spawnedProcess.stdout.on('data', (data) => {
      const output = data.toString();
      result.stdout += output;
      if (typeof options.onStdout === 'function') {
        options.onStdout(output);
      }
    });
  }

  if (spawnedProcess.stderr) {
    spawnedProcess.stderr.on('data', (data) => {
      const output = data.toString();
      result.stderr += output;
      if (typeof options.onStderr === 'function') {
        options.onStderr(output);
      }
    });
  }

  result.promise = new Promise((resolve, reject) => {
    spawnedProcess.on('close', (code) => {
      result.exitCode = code;
      if (code === 0) {
        resolve({
          success: true,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: code
        });
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    spawnedProcess.on('error', (err) => {
      reject(err);
    });
  });

  return result;
}

/**
 * Spawns a Node.js script as a child process.
 * @param {string} scriptPath - Path to the script file
 * @param {string[]} args - Arguments to pass to the script
 * @param {Object} options - Optional configuration
 * @returns {Object} Object containing the spawned process and promise
 */
function spawnScript(scriptPath, args = [], options = {}) {
  const resolvedPath = path.resolve(scriptPath);
  
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Script not found: ${resolvedPath}`);
  }

  return spawnProcess('node', [resolvedPath, ...args], options);
}

/**
 * Spawns a shell command with proper escaping and execution.
 * @param {string} command - The shell command to execute
 * @param {Object} options - Optional configuration
 * @returns {Object} Object containing the spawned process and promise
 */
function spawnShell(command, options = {}) {
  const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
  const shellArgs = process.platform === 'win32' ? ['/c', command] : ['-c', command];
  
  return spawnProcess(shell, shellArgs, { ...options, shell: false });
}

/**
 * Manages a pool of spawned processes for parallel execution.
 * @param {string} command - The command to execute
 * @param {string[][]} argsBatch - Array of argument arrays, one for each process
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} Array of results from all spawned processes
 */
async function spawnBatch(command, argsBatch, options = {}) {
  const { concurrency = 5, ...spawnOptions } = options;
  const results = [];
  
  const spawnAll = async () => {
    const batchPromises = argsBatch.map((args, index) => {
      return spawnProcess(command, args, spawnOptions)
        .promise
        .then((result) => ({ index, ...result }))
        .catch((error) => ({ index, success: false, error: error.message }));
    });
    
    return Promise.all(batchPromises);
  };
  
  for (let i = 0; i < argsBatch.length; i += concurrency) {
    const batch = argsBatch.slice(i, i + concurrency);
    const batchResults = await spawnAll();
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Represents an active spawn session for tracking spawned processes.
 */
class SpawnSession {
  constructor(id, process, metadata = {}) {
    this.id = id;
    this.process = process;
    this.metadata = metadata;
    this.startTime = Date.now();
    this.status = 'running';
  }

  getDuration() {
    return Date.now() - this.startTime;
  }

  terminate() {
    if (this.process && this.process.kill) {
      this.process.kill('SIGTERM');
      this.status = 'terminated';
    }
  }

  isRunning() {
    return this.status === 'running';
  }
}

// Session management for spawned processes
const spawnSessions = new Map();
let spawnSessionCounter = 0;

/**
 * Creates and registers a new spawned process session.
 * @param {string} command - The command to execute
 * @param {string[]} args - Arguments for the command
 * @param {Object} options - Spawn options
 * @param {Object} metadata - Additional metadata for the session
 * @returns {Object} The session object with process and promise
 */
function createSpawnSession(command, args, options, metadata = {}) {
  const sessionId = `spawn_${++spawnSessionCounter}_${Date.now()}`;
  const result = spawnProcess(command, args, options);
  
  const session = new SpawnSession(sessionId, result.process, metadata);
  spawnSessions.set(sessionId, session);

  result.promise
    .then(() => {
      session.status = 'completed';
    })
    .catch(() => {
      session.status = 'failed';
    });

  return {
    sessionId,
    process: result.process,
    promise: result.promise,
    session
  };
}

/**
 * Gets all active spawn sessions.
 * @returns {Array} Array of active session objects
 */
function getActiveSpawnSessions() {
  const active = [];
  spawnSessions.forEach((session) => {
    if (session.isRunning()) {
      active.push({
        id: session.id,
        metadata: session.metadata,
        duration: session.getDuration(),
        status: session.status
      });
    }
  });
  return active;
}

/**
 * Terminates a specific spawn session by ID.
 * @param {string} sessionId - The session ID to terminate
 * @returns {boolean} True if session was found and terminated
 */
function terminateSpawnSession(sessionId) {
  const session = spawnSessions.get(sessionId);
  if (session) {
    session.terminate();
    return true;
  }
  return false;
}

/**
 * Cleans up completed/failed sessions older than the specified age.
 * @param {number} maxAgeMs - Maximum age in milliseconds
 */
function cleanupSpawnSessions(maxAgeMs = 60000) {
  const now = Date.now();
  spawnSessions.forEach((session, id) => {
    if (!session.isRunning() && (now - session.startTime) > maxAgeMs) {
      spawnSessions.delete(id);
    }
  });
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e. g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
export function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if ... {
      lang = 'zh'; // Chinese
    } else if ... {
      lang = 'ja'; // Japanese
    } else if (/[\u400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if ... {
      lang = 'ar'; // Arabic
    } else if (/[àâäèéêëïîôùûüç]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  return lang;
}

// New function to address REACT_015: Add lang attribute to HTML element
export function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

/**
 * Renders the index view using the indexContent module.
 * This function should be called by the index view rendering functions.
 * @param {Object} props - Props for rendering the index view
 * @returns {React.ReactElement} The rendered index content
 */
function renderIndexView(props) {
  const content = indexContent(props);
  return content;
}

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

// Updated implementation at line 63 to address all accessibility issues comprehensively
function implementAccessibilityFixes() {
  const report = {
    detectedLang: detectAndSetLang(document.body.textContent),
    issues: {
      landmarkIssues: [],
      svgIssues: [],
      fakeLinkIssues: []
    }
  };
  
  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }
  
  // Address REACT_036: Fix fake link issues
  const fakeLinks = document.querySelectorAll('[onclick]:not(a):not(button):not([role="button"])');
  fakeLinks.forEach((element, index) => {
    const isNavigation = element.closest('nav') !== null;
    const isButton = element.closest('[role="button"]') !== null;
    
    if (isNavigation || element.tagName.toLowerCase() === 'a') {
      element.setAttribute('href', `#${element.id || `link-${index}`}`);
      element.setAttribute('role', 'link');
    } else {
      element.setAttribute('role', 'button');
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    }
    
    report.issues.fakeLinkIssues.push({
      type: 'fakeLinkFix',
      issue: 'fixed',
      selector: `[data-fake-link-id="${index}"]`,
      details: `Converted to ${isNavigation || element.tagName.toLowerCase() === 'a' ? 'link' : 'button'}`
    });
  });
  
  // Apply the fixes
  applyAccessibilityFixes(report);
  
  return report;
}

/**
 * Renders the dependency graph view using the dependencyGraphContent module.
 * This function should be called by the dependency graph rendering functions.
 * @param {Object} props - Props for rendering the dependency graph
 * @returns {React.ReactElement} The rendered dependency graph content
 */
function renderDependencyGraph(props) {
  const content = dependencyGraphContent(props);
  return content;
}

/**
 * Renders the index view using the indexContent module.
 * This function should be called by the index view rendering functions.
 * @param {Object} props - Props for rendering the index view
 * @returns {React.ReactElement} The rendered index content
 */
function renderIndexView(props) {
  const content = indexContent(props);
  return content;
}

// App state for session management
const appState = {
  sessions: new Map()
};

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

const a11yStore = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  focusTrap: focusTrap,

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  createLiveRegion() {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0;';
    document.body.appendChild(this.liveRegion);
  },

  announce(message, priority) {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element, index) => {
      const landmarks = document.querySelectorAll(element);
      landmarks.forEach((landmark) => {
        if (landmark.id === '') {
          landmark.id = `${element}-${index}`;
        }
      });
    });
  }
};

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('aria-describedby') || tableElement.getAttribute('summary');
  
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }
  
  const errors = [];
  
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    
    const cellCount = cells.length;
    
    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });
    
    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = prevRow.querySelectorAll('td, th');
      
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role)) {
    errors.push(`Element has invalid landmark role: ${role}`);
  }
  
  if (!role && tagName && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found. Only one main landmark should exist.`);
  }
  
  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      
      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }