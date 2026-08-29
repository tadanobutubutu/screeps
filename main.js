const fs = require('fs');
const path = require('path');

// Main game loop for Screeps
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(filePath);
    });
}

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.setAttribute('lang', 'en');
}

// Import accessibility helper functions
const {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
} = require('./accessibilityHelperFunctions');

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
document.documentElement.setAttribute('lang', 'en');
document.body.appendChild(mainElement);

// Add the requested function here
function updateThScopeAttribute(filePath) {
  // Open the HTML file
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Find all the <th> elements
  const thElements = fileContent.match(/<th.*?>/g);

  if (thElements) {
    for (const th of thElements) {
      // Generate a unique id for each TH element
      const id = `th-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
      // Add 'scope="col"' attribute to the TH element using the id
      const updatedTh = th.replace(/<\/th>/, ` id="${id}" scope="col" />`);

      // Replace the originally found TH element with the updated one in the HTML content
      fileContent = fileContent.replace(th, updatedTh);
    }

    // Save the updated HTML file
    fs.writeFileSync(filePath, fileContent, 'utf8');
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Game-related functions and exports

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

module.exports = {
  run,
  main,
  SomeClass,
  someUtility,
  config,
  countDependencies,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink,
  a11yStore,
  mainElement,
  // Add the new export here
  updateThScopeAttribute
};