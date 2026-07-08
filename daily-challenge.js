// daily-challenge.js

const fs = require('fs');
const path = require('path');

/**
 * Reads the input file for the specified day.
 *
 * @param {string|number} day - The day number (e.g., 1, 2, '01', '02').
 * @returns {string[]} An array of input lines.
 */
function readInput(day) {
    const dayStr = String(day).padStart(2, '0');
    const filePath = path.join(__dirname, `input/day${dayStr}.txt`);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8').trim().split('\n') : [];
}

/**
 * Solve part 1 of a challenge. This is a placeholder implementation
 * that simply sums numeric lines. Replace with actual logic.
 *
 * @param {string[]} lines - The input lines.
 * @returns {number}
 */
function solvePart1(lines) {
    return lines.reduce((sum, line) => sum + Number(line), 0);
}

/**
 * Solve part 2 of a challenge. This is a placeholder implementation
 * that simply multiplies numeric lines. Replace with actual logic.
 *
 * @param {string[]} lines - The input lines.
 * @returns {number}
 */
function solvePart2(lines) {
    return lines.reduce((product, line) => product * Number(line), 1);
}

/**
 * Main entry point. Expects a day number as the first command line argument.
 */
function main() {
    const day = process.argv[2] || '01';
    const lines = readInput(day);

    if (!lines.length) {
        console.error(`No input found for day ${day}.`);
        process.exit(1);
    }

    const part1 = solvePart1(lines);
    const part2 = solvePart2(lines);

    console.log(`Day ${day} Part 1: ${part1}`);
    console.log(`Day ${day} Part 2: ${part2}`);
}

if (require.main === module) {
    main();
}

module.exports = { readInput, solvePart1, solvePart2 };
