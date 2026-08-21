import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Set lang attribute on document
document.documentElement.lang = 'en';

/**
 * React Accessibility Rules
 * Ensures accessibility best practices in React components
 */
const { astHasJSX } = require('../helpers/ast');
const { getAttr, hasAttr, attrValue } = require('../helpers/attributes');
const { isFromReactPackage } = require('../helpers/packages');
const { isJSXElement } = require('../helpers/jsx');
const { isTag } = require('../helpers/tags');

/**
 * Rule: REACT_027 - React Table Structure
 * Ensures all <th> elements have proper scope attributes for accessibility
 */
function REACT_027(node, config) {
  // Check if this is a <th> element
  if (!isJSXElement(node) || !isTag(node, 'th')) {
    return [];
  }

  const errors = [];

  // Check if scope attribute exists
  if (!hasAttr(node, 'scope')) {
    errors.push({
      ruleId: 'REACT_027',
      message: 'React Table Structure: <th> has no scope',
      line: node.loc.start.line,
      column: node.loc.start.column,
      severity: getSeverity(config),
    });
  }

  return errors;
}

/**
 * Get severity from config or default to warning
 */
function getSeverity(config) {
  if (config && config.severity) {
    return config.severity;
  }
  return 2; // warning
}

function setFavicon(iconData) {
  // Set the favicon for the page
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = iconData;
  document.getElementsByTagName('head')[0].appendChild(link);
}

function addAccessibleName(svgString) {
  // Check if the SVG string contains an accessible name or is decorative
  const isDecorative = /<svg.*>([\s\S]*?)<\/svg>/i.test(svgString) && !/<title.*?>|aria-label.*?>/i.test(svgString);
  if (isDecorative) {
    // Add an aria-hidden attribute to make the SVG decorative and hidden to screen readers
    const modifiedSvgString = svgString.replace('<svg', '<svg aria-hidden="true"');
    return modifiedSvgString;
  }
  return svgString;
}

// Assuming 'main.js' imports the SVG strings for favicons from other parts of the code
const faviconSvgString = import('path/to/favicon/svg').then((module) => module.default);

// Example usage:
faviconSvgString.then((svgString) => {
  const updatedSvgString = addAccessibleName(svgString);
  // Now, the updated SVG string can be used to set the favicon or anywhere else in the application
  setFavicon('data:image/svg+xml,' + encodeURIComponent(updatedSvgString));
});

// Add a method to change the language of the document dynamically
function changeDocumentLanguage(language) {
  document.documentElement.lang = language;
}

// ... other code ...

module.exports = {
  REACT_027,
  getSeverity,
};