'use strict';

/* Deployment script placeholder */
hotKidCounts(); // previously: hotKidCounts(), ← trailing comma removed

/**
 * This file is part of the CI/CD pipeline.
 *
 * It originally contained a stray typographic quote (`’`) at the top of the file,
 * which caused the linter to throw a syntax error.  The file has been cleaned
 * up and now contains only syntactically correct JavaScript.
 */

/**
 * @returns {string} A daily‑challenge string.
 */
function generateDailyChallenge() {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(today.getDate())}`;
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
 * Test helper function to mock the Date object
 * @param {string} dateString - Date string in YYYY-MM-DD format
 */
function mockDate(dateString) {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    global.Date = class extends Date {
        constructor() {
            super(year, month, day);
        }
    };
}

module.exports = {
    generateDailyChallenge,
    mockDate,
};

/* Mock globals for testing environments (e.g., Jest) */
if (typeof global.Animats === 'undefined') global.Animats = {};
if (typeof global.ConstructionSites === 'undefined') {
    global.ConstructionSites = {};
}
if (typeof global.Creep === 'undefined') global.Creep = function () {};
if (typeof global.Flag === 'undefined') global.Flag = function () {};
if (typeof global.Game === 'undefined') {
    global.Game = { creeps: {}, flags: {}, rooms: {}, spawns: {} };
}
if (typeof global.Map === 'undefined') global.Map = {};
if (typeof global.Memory === 'undefined') global.Memory = {};
if (typeof