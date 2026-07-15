'use strict';

/* Safely invoke hotKidCounts if it is defined. Previously this line had a stray '('. */
if (typeof hotKidCounts === 'function') hotKidCounts(); // previously: hotKidCounts(), ← trailing comma removed

/**
 * This file is part of the CI/CD pipeline.
 *
 * It originally contained a stray typographic quote (`’`) at the top of the file,
 * which caused the linter to throw a syntax error. The file has been cleaned
 * up and now contains only syntactically correct JavaScript.
 *
 * @returns {string} A daily‑challenge string.
 */
function generateDailyChallenge() {
    // Use a standard Date formatting for consistency in tests.
    const today = new Date();
    const dateString = `${today.getFullYear()}-${addZero(today.getMonth() + 1)}-${addZero(
        today.getDate()
    )}`;

    // A deterministic, easy‑to‑assert message that contains a template literal.
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
 * Helper function to check Node.js version compatibility
 * @returns {boolean} True if running on Node.js 24 or higher
 */
function isNode24OrHigher() {
    const version = process.versions.node.split('.')[0];
    return parseInt(version) >= 24;
}

/**
 * Get the current Node.js version.
 * @returns {string} The current Node.js version
 */
function getNodeVersion() {
    return process.versions.node;
}

/**
 * Test helper function to mock the Date object.
 * @param {string} dateString - Date string in YYYY-MM-DD format
 */
function mockDate(dateString) {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const mockedDate = new Date(year, month, day);
    // Override the Date constructor to return the mocked date
    const OriginalDate = Date;
    global.Date = function (...args) {
        return args.length === 0 ? mockedDate : new OriginalDate(...args);
    };
    global.Date.now = () => mockedDate.getTime();
    global.Date.parse = OriginalDate.parse;
    global.Date.UTC = OriginalDate.UTC;
}



---

**Support Pollinations.AI:**

---

🌸 **Ad** 🌸
Powered by Pollinations.AI free text APIs. [Support our mission](https://pollinations.ai/redirect/kofi) to keep AI accessible for everyone.