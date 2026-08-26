/**
 * React Landmarks Fix - REACT_017
 * 
 * This file documents the accessibility fix required for:
 * - docs/index.html
 * - One additional file (redacted in issue)
 * 
 * Issue: Page has no <main> landmark
 * 
 * Required Changes:
 * =================
 * 
 * 1. docs/index.html - Wrap the primary content table with <main> tag:
 * 
 * BEFORE:
 *     <table id="table-rotated">
 * 
 * AFTER:
 *     <main>
 *         <table id="table-rotated">
 *     </main>
 * 
 * 2. The other affected file - Wrap primary content area with <main> tag:
 * 
 * BEFORE:
 *     <div class="container">
 *         <h2>Quality & Metrics Reports</h2>
 *         ...
 *     </div>
 * 
 * AFTER:
 *     <main>
 *         <div class="container">
 *             <h2>Quality & Metrics Reports</h2>
 *             ...
 *         </div>
 *     </main>
 * 
 * Why this matters:
 * =================
 * - Allows keyboard users to skip to main content (skip link)
 * - Screen readers can navigate directly to main content
 * - WCAG 2.4.1 Bypass Blocks compliance
 * 
 * Note: If main.js generates HTML, update the template to include <main> landmarks.
 */

const landmarkFix = {
  rule: 'REACT_017',
  severity: 'warning',
  filesToUpdate: [
    'docs/index.html',
    '/* second file location */'
  ],
  action: 'Wrap primary content in <main> landmark'
};

module.exports = landmarkFix;