const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.newExport = function() {
    // Add your new function logic here
};

app.setLanguageAttribute = function(lang) {
    // Assuming the document object is available in the global scope
    if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
    }
};

app.calculateAverage = function(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

app.ensureUniqueLandmarks = function() {
    // Accessibility fix for REACT_025: Ensure unique landmarks
    // This function ensures that landmark elements have proper labeling for accessibility
    const landmarkSelectors = ['header:not([role])', 'footer:not([role])', 'nav:not([role])', 'main:not([role])', '[role="banner"]', '[role="main"]', '[role="contentinfo"]'];
    const allLandmarks = document.querySelectorAll(landmarkSelectors.join(','));
    const landmarkCounts = {};
    allLandmarks.forEach(landmark => {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || '';
        const key = role || tagName;
        landmarkCounts[key] = (landmarkCounts[key] || 0) + 1;
    });
    const secondPassLandmarks = document.querySelectorAll(landmarkSelectors.join(','));
    const tagCounts = {};
    secondPassLandmarks.forEach(landmark => {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || '';
        const key = role || tagName;
        if (!landmark.id && landmarkCounts[key] > 1) {
            tagCounts[key] = (tagCounts[key] || 0) + 1;
            landmark.id = key + '-' + tagCounts[key];
        } else if ((tagName === 'header' || tagName === 'footer') && landmarkCounts[key] > 1) {
            tagCounts[key] = (tagCounts[key] || 0) + 1;
            landmark.id = key + '-' + tagCounts[key];
        }
    });
};

app.hasMultipleMainElements = function() {
    return document.querySelectorAll('main').length > 1;
};

function fixDependencyDashboard() {
  const workflowPath = path.join(__dirname, '.github', 'workflows', 'gitstream.yml');
  if (fs.existsSync(workflowPath)) {
    let content = fs.readFileSync(workflowPath, 'utf8');
    content = content.replace(
      /linear-bots\/gitstream-github-action\s+v2/g,
      'linear-bots/gitstream-github-action@v2'
    );
    fs.writeFileSync(workflowPath, content, 'utf8');
  }
}

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }
// ----- END ORIGINAL CODE-----

// Add the new function to generate HTML with lang attribute
function generateHtmlWithLang() {
  const html = `
<html lang="en">
<!-- ... Your existing html content ... -->
</html>
  `;

  return html;
}

// Modify the build script to use the new function
const html = generateHtmlWithLang();

// Adding the lang attribute to the root HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
}

module.exports = app;
module.exports.fixDependencyDashboard = fixDependencyDashboard;