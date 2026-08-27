// main.js - React Application Entry Point
// Import the necessary functions to read files and check for the presence of the scope attribute
const fs = require('fs');
const path = require('path');
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';

// Function to check if all <th> elements have the scope attribute
function checkThScopeAttribute(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const thElements = fileContent.match(/<th\b[^>]*>/g);
  if (!thElements) {
    return true; // No <th> elements found, so no issue
  }

  const hasNoScope = thElements.some((th) => {
    return !th.includes('scope="');
  });

  return !hasNoScope;
}

// Function to test the presence of the scope attribute in all <th> elements
function testThScopeAttribute() {
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
  const hasScopeAttribute = checkThScopeAttribute(filePath);

  if (!hasScopeAttribute) {
    throw new Error('Not all <th> elements have the scope attribute.');
  }

  console.log('All <th> elements have the scope attribute.');
}

// Function to add proper landmark regions
function addProperLandmarkRegions() {
  // Implementation to add proper landmark regions
}

// Function to fix fake link issues
function fixFakeLinkIssue() {
  // Implementation to fix fake link issues
}

// Function to fix SVG accessible name issues
function fixSvgAccessibility() {
  // Implementation to fix SVG accessible name issues
}

// Function to add lang attribute to html element
function addHtmlLangAttribute() {
  // Implementation to add lang attribute to html element
}

// Run the test
testThScopeAttribute();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);