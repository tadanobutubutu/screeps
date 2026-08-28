// TODO: Implement wrapPrimaryContentInMain function, including the added logic

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"], .main-content, #main, article, section:first-child');
  if (!primaryContent) return;
  
  const main = doc.createElement('main');
  main.className = 'main';

  if (primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

// ADD THE NEW FUNCTION HERE
function ensureUniqueLandmarkNames(landmarks) {
  const landmarkNames = [];
  
  landmarks.forEach(landmark => {
    const existingName = landmark.getAttribute('aria-label') || 
                         landmark.getAttribute('aria-labelledby') ||
                         landmark.getAttribute('name');
    
    let uniqueName = existingName;
    let counter = 1;
    
    while (landmarkNames.includes(uniqueName)) {
      uniqueName = existingName ? `${existingName}-${counter}` : `landmark-${counter}`;
      counter++;
    }
    
    landmarkNames.push(uniqueName);
    
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', uniqueName);
    }
  });
  
  return landmarks;
}

function addUniqueLandmarkNames(doc) {
  const landmarks = doc.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  return ensureUniqueLandmarkNames(landmarks);
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction, addProperLandmarkRegions, addAriaToFormControls, replaceMyButtonId, getLangAttribute, getFullLangAttribute, validateLandmark, validateLandmarkStructure, validateTableAccessibility, validateTableStructure, getSvgAccessibleName } = require('./helpers');

module.exports = {
  addProperLandmarkRegions,
  addMissingExportFunction,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain, // Add the new function to the exports
  addUniqueLandmarkNames, // Add the new function to the exports
  getSvgAccessibleName
};