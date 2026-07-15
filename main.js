'use strict';

/** Safely invoke hotKidCounts if it is defined. */
/* (This is kept for backward compatibility with older scripts.) */
if (typeof hotKidCounts === 'function') {
    hotKidCounts();
}

/** Generate a deterministic daily challenge string. */
function generateDailyChallenge() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
    return `Today's challenge (${dateString}): Practice coding in JavaScript!`;
}

/*********************************************************************
 * Utility helpers
 *********************************************************************/

/** Pad a number with a leading zero if it's less than 10. */
function addZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

/** Get the current Node.js version. */
function getNodeVersion() {
    try {
        return process.version;
    } catch (e) {
        return 'Node.js version unavailable';
    }
}

/** Get the current TypeScript version. */
function getTypeScriptVersion() {
    try {
        const ts = require('typescript');
        return ts.version;
    } catch (e) {
        return 'TypeScript not installed';
    }
}

/** Get the current Python version. */
function getPythonVersion() {
    try {
        const { execSync } = require('child_process');
        return execSync('python --version', { encoding: 'utf8' }).trim();
    } catch (e) {
        return 'Python not installed';
    }
}

module.exports = {
    generateDailyChallenge,
    addZero,
    getNodeVersion,
    getTypeScriptVersion,
    getPythonVersion
};