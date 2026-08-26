/**
 * main.js
 * 
 * Resolves Renovate issue: "Updating multiple npm lock files is deprecated"
 * by consolidating dependency management to a single lock file.
 */

const fs = require('fs');
const path = require('path');

/**
 * Detect multiple npm lock files in the repository.
 * @returns {string[]} List of lock file paths found.
 */
function detectMultipleLockFiles() {
  const lockFiles = [];
  const possibleLockFiles = [
    'package-lock.json',
    'dashboard/package-lock.json',
  ];

  for (const lockFile of possibleLockFiles) {
    const fullPath = path.resolve(process.cwd(), lockFile);
    if (fs.existsSync(fullPath)) {
      lockFiles.push(lockFile);
    }
  }

  return lockFiles;
}

/**
 * Check whether the repository has more than one npm lock file.
 * @returns {boolean} True if multiple lock files exist.
 */
function hasMultipleLockFiles() {
  return detectMultipleLockFiles().length > 1;
}

module.exports = {
  detectMultipleLockFiles,
  hasMultipleLockFiles,
};