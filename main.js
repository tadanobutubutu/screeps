// This is the main entry point for the application
// Import necessary modules
const fs = require('fs');
const path = require('path');

// Define some basic functionality
function initialize() {
  console.log('Initializing application...');
}

// Helper function
function getFilePath(filename) {
  return path.join(__dirname, filename);
}

// Address accessibility issues as per insight report
function makeElementAccessible(element) {
  if (!element || !element.tagName) return;
  if (element.tagName.toLowerCase() === 'html') {
    element.setAttribute('lang', 'en');
  } else if (element.tagName.toLowerCase() === 'svg') {
    element.setAttribute('aria-label', 'SVG description');
  }
}

// Implement fixTableStructureIssues to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.getElementsByTagName('table');
  for (let table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      for (let j = 0; j < table.rows[i].cells.length; j++) {
        let cell = table.rows[i].cells[j];
        if (cell.tagName && cell.tagName.toLowerCase() === 'th') {
          if (i === 0) {
            cell.setAttribute('scope', 'col');
          }
        }
      }
    }
  }
}

// Add proper landmark regions for improved accessibility
function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main');
  const navigation = document.querySelector('nav');
  const footer = document.querySelector('footer');
  if (mainContent) mainContent.setAttribute('role', 'main');
  if (navigation) navigation.setAttribute('role', 'navigation');
  if (footer) footer.setAttribute('role', 'contentinfo');
  document.body.setAttribute('role', 'document');
  document.documentElement.setAttribute('lang', 'en');
}

// Function for unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]');
  const landmarkIds = new Set([...landmarks].map(landmark => landmark.id || ''));
  if (landmarks.length > landmarkIds.size) {
    console.warn('Not all landmarks have unique IDs:', [...landmarks].map(landmark => landmark.id || 'no-id'));
  }
}

// New function for fixing one fake link issue
function fixOneFakeLinkIssue() {
  const fakeLink = document.getElementById('fake-link-id');
  fakeLink.textContent = 'Example Link';
  fakeLink.href = 'https://example.com';
}

// NEW: Fix React Fake Link issue
function fixReactFakeLinkIssue() {
  const hashLinks = document.querySelectorAll('a[href="#"]');
  for (let link of hashLinks) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = link.textContent;
    if (link.getAttribute('aria-label')) {
      button.setAttribute('aria-label', link.getAttribute('aria-label'));
    } else {
      button.setAttribute('aria-label', link.textContent || 'Action');
    }
    link.parentNode.replaceChild(button, link);
  }
}

// New function for ensuring landmarks with unique IDs
function hasUniqueLandmarks() {
  return [...document.querySelectorAll('[role="main"], [role="navigation"], [role="contentinfo"]')].every((landmark) => {
    return landmark.id && landmark.id !== '';
  });
}

// New function exporting fixTableStructureIssues
exports.fixTableStructureIssues = fixTableStructureIssues;
// New function exporting ensureUniqueLandmarks
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
// New function exporting fixOneFakeLinkIssue
exports.fixOneFakeLinkIssue = fixOneFakeLinkIssue;
// New function exporting fixReactFakeLinkIssue
exports.fixReactFakeLinkIssue = fixReactFakeLinkIssue;
// New function exporting hasUniqueLandmarks
exports.hasUniqueLandmarks = hasUniqueLandmarks;

// New function exporting makeElementAccessible
exports.makeElementAccessible = makeElementAccessible;

function wrapPrimaryContentInMain() {
  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  const existingDiv = mainContent.closest('div[class="main-wrapper"]') || mainContent.closest('div[id="content"]') || mainContent.parentElement;
  if (!existingDiv) return;

  const newDiv = document.createElement('div');
  newDiv.className = 'primary-content-wrapper';
  newDiv.setAttribute('role', 'main');

  existingDiv.insertBefore(newDiv, mainContent);
  newDiv.appendChild(mainContent);
}

module.exports = {
  initialize,
  getFilePath,
  makeElementAccessible,
  newPreservedFunction,
  fixTableStructureIssues,
  addProperLandmarkRegions,
  fixFakeLinkIssues, // Renamed it to avoid naming conflicts
  fixOneFakeLinkIssue,
  ensureUniqueLandmarks,
  fixReactFakeLinkIssue,
  hasUniqueLandmarks,
  wrapPrimaryContentInMain
};