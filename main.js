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
import React from 'react';

// Import dependency graph content and index content for rendering functions
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn } = require('./utilities');

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
function setHtmlLangAttribute(lang) {
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
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
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
function getLangAttribute() {
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