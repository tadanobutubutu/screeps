const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Assuming that pages are in './pages' directory with `.js` or `.jsx` extension
const pagesDir = path.join(__dirname, 'pages');

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility() {
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fileEmitted = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fileEmitted);

    if (violations.length > 0) {
      issues.push({
        file: filePath,
        issues: violations,
      });
    }
  }

  return issues;
}

// Function to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility_report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

module.exports = {
  // ... your existing exports ...

  generateAccessibilityReport: async function () {
    const report = await scanAccessibility();
    writeReport(report);
  },
};