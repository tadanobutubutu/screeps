/* Deployment script placeholder */

if (typeof hotKidCounts === 'function') hotKidCounts();

'use strict';

/**
 * This file is part of the CI/CD pipeline.
 *
 * It originally contained a stray typographic quote (`’`) at the top of the file,
 * which caused the linter to throw a syntax error. The file has been cleaned
 * up and now contains only syntactically correct JavaScript.
 *
 * @returns {string} A daily-challenge string.
 */
function generateDailyChallenge() {
    // Use a standard Date formatting for consistency in tests.
    const today = new Date();
    const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;

    // A deterministic, easy-to-assert message that contains a template literal.
    return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/**
 * Pad single digit numbers with a leading zero.
 * @param {number} num
 * @returns {string}
 */
function addZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/**
 * Get the current Node.js version
 * @returns {string} Node.js version
 */
function getNodeVersion() {
    return process.version;
}

/**
 * Get the current TypeScript version
 * @returns {string} TypeScript version
 */
function getTypeScriptVersion() {
    try {
        const ts = require('typescript');
        return ts.version;
    } catch (e) {
        return 'TypeScript not installed';
    }
}

/**
 * Get the current Python version
 * @returns {string} Python version
 */
function getPythonVersion() {
    try {
        const { execSync } = require('child_process');
        return execSync('python --version').toString().trim();
    } catch (e) {
        return 'Python not installed';
    }
}

/**
 * Get the current pnpm version
 * @returns {string} pnpm version
 */
function getPnpmVersion() {
    try {
        const { execSync } = require('child_process');
        return execSync('pnpm --version').toString().trim();
    } catch (e) {
        return 'pnpm not installed';
    }
}

/**
 * Get the current PostHog version
 * @returns {string} PostHog version
 */
function getPostHogVersion() {
    try {
        const posthog = require('posthog-node');
        return typeof posthog.version === 'function' ? posthog.version() : (posthog.version || 'PostHog version unknown');
    } catch (e) {
        return 'PostHog not installed';
    }
}

module.exports = {
    generateDailyChallenge,
    addZero,
    getNodeVersion,
    getTypeScriptVersion,
    getPythonVersion,
    getPnpmVersion,
    getPostHogVersion
};