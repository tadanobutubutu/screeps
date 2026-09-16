// Import dependencyGraphContent
const dependencyGraphContent = require('./dependencyGraph.json');

// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Validates a landmark name
 * @param {string} landmarkName - The name of the landmark to validate
 * @returns {boolean} True if the landmark is valid, false otherwise
 */
function validateLandmark(landmarkName) {
  if (typeof landmarkName !== 'string' || landmarkName.trim() === '') {
    return false;
  }
  return true;
}

/**
 * Checks for landmark elements in the given HTML content
 * @param {string} content - HTML content to check for landmark elements
 * @returns {Object} An object containing information about landmark elements found
 */
function checkLandmarkElements(content) {
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const found = {};
  
  for (const tag of landmarkTags) {
    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
    const matches = content.match(regex);
    found[tag] = matches ? matches.length : 0;
  }
  
  return {
    landmarks: found,
    totalLandmarks: Object.values(found).reduce((a, b) => a + b, 0)
  };
}

/**
 * Generates an SVG badge string representing the total dependency count.
 * @returns {string} An SVG badge string showing the total dependency count.
 */
function generateDependencyBadge() {
  const counts = countDependencies();
  const total = counts.total;

  // Simple SVG badge
  const badgeWidth = 70;
  const badgeHeight = 20;
  const backgroundColor = '#4c1';
  const textColor = '#fff';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${badgeWidth}" height="${badgeHeight}">
  <rect width="${badgeWidth}" height="${badgeHeight}" fill="${backgroundColor}" rx="3"/>
  <text x="${badgeWidth / 2}" y="${badgeHeight / 2 + 5}" fill="${textColor}" text-anchor="middle" font-family="Verdana, Geneva, DejaVu Sans, sans-serif" font-size="11">
    dependencies: ${total}
  </text>
</svg>
  `.trim();

  return svg;
}

/**
 * Ensures that the landmarks array contains unique elements
 * @param {Array} landmarks - The array of landmarks to check for uniqueness
 * @returns {Array} The filtered array with unique landmarks
 */
function ensureUniqueLandmarks(landmarks) {
  const uniqueLandmarks = new Set(landmarks);
  return Array.from(uniqueLandmarks);
}

/**
 * Processes an insight report to address accessibility issues
 * @param {Object} insightReport - The insight report containing the accessibility issues
 */
function addressAccessibilityIssues(insightReport) {
  // TODO: Implement actual logic to address the accessibility issues based on the insight report structure
  // For now, we'll just log the issues for demonstration purposes
  insightReport.issues.forEach(issue => {
    console.log(`Accessibility issue found: ${issue.description}`);
    // Here you would add the logic to address the issue, such as logging, fixing, etc.
  });
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, addressAccessibilityIssues };