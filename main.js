// Import dependencyGraphContent
const dependencyGraphContent = require('./dependencyGraph');

const fs = require('fs');
const path = require('path');

/**
 * Checks the landmark structure of the document
 * @returns {Object} An object containing landmark structure information
 */
function checkLandmarkStructure() {
  if (typeof document === 'undefined') {
    return {
      hasMain: false,
      hasNav: false,
      hasHeader: false,
      hasFooter: false,
      hasAside: false,
      landmarkCount: 0,
      landmarks: [],
      isValid: false
    };
  }

  const main = document.querySelector('main');
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  const aside = document.querySelector('aside');
  const sections = document.querySelectorAll('section');
  const articles = document.querySelectorAll('article');

  const landmarks = [];

  if (main) landmarks.push('main');
  if (nav) landmarks.push('nav');
  if (header) landmarks.push('header');
  if (footer) landmarks.push('footer');
  if (aside) landmarks.push('aside');
  sections.forEach(() => landmarks.push('section'));
  articles.forEach(() => landmarks.push('article'));

  return {
    hasMain: !!main,
    hasNav: !!nav,
    hasHeader: !!header,
    hasFooter: !!footer,
    hasAside: !!aside,
    landmarkCount: landmarks.length,
    landmarks: landmarks,
    isValid: landmarks.length > 0
  };
}

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(__dirname, 'package.json');

  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(dependencies).length;
    const devDependencyCount = Object.keys(devDependencies).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

// New function to convert anchor tags to buttons with specific id and text
function convertAnchorsToButtons() {
  if (typeof document !== 'undefined') {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
      const button = document.createElement('button');
      button.id = anchor.id;
      button.type = 'button';
      button.textContent = anchor.textContent;
      // Copy attributes from anchor to button
      Array.from(anchor.attributes).forEach(attr => {
        if (attr.name !== 'id') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      // Replace anchor with button
      anchor.parentNode.replaceChild(button, anchor);
    });
  }
}

// Export for use in other modules
module.exports = { countDependencies, dependencyGraphContent, convertAnchorsToButtons, checkLandmarkStructure };