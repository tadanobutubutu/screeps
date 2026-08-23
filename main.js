const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

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

// Ensure that the primary content is wrapped in a <main> landmark
function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
}

function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.innerHTML = document.body.innerHTML;
    document.body.innerHTML = '';
    document.body.appendChild(mainElement);
  }
}

function wrapPrimaryContentInMain() {
  if (hasMultipleMainElements()) {
    console.warn('Multiple <main> elements detected. Only one <main> element should exist.');
    return;
  }

  addMainLandmark();
}

// Call the function to wrap the primary content in a <main> landmark
if (typeof document !== 'undefined') {
  wrapPrimaryContentInMain();
}

module.exports = app;
module.exports.fixDependencyDashboard = fixDependencyDashboard;