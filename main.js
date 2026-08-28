// TODO: Implement wrapPrimaryContentInMain function, including the added logic

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('.primary-content');
  const main = doc.createElement('div');
  main.className = 'main';

  if (primaryContent.parentNode) {
    primaryContent.parentNode.insertBefore(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

/**
 * Add proper landmark regions to the document for accessibility.
 * Creates or updates landmark elements (header, navigation, main, footer)
 * with appropriate ARIA roles and unique IDs.
 *
 * @param { Document } doc - The document object to operate on
 * @returns { Array<{type:string, el:Document}> } List of created/updated landmark elements
 */
function addProperLandmarkRegions(doc) {
  // Counter for generating unique IDs
  let idCounter = 0;

  const landmarkTypes = ['header', 'navigation', 'main', 'footer'];
  const landmarks = [];

  landmarkTypes.forEach(type => {
    // Try to find an existing element with class 'landmark-' + type
    const existing = doc.querySelector(`[class="landmark-${type}"]`);
    if (existing) {
      // Update role and ensure a unique id
      const role = type === 'main'
        ? 'main'
        : type === 'header'
          ? 'header'
          : type === 'navigation'
            ? 'navigation'
            : 'complementary';
      existing.setAttribute('role', role);
      const id = `landmark-${idCounter++}-${type}`;
      existing.id = id;
    } else {
      // Create a new landmark element
      const el = doc.createElement('div');
      el.className = `landmark-${type}`;
      el.setAttribute('role', type === 'main'
        ? 'main'
        : type === 'header'
          ? 'header'
          : type === 'navigation'
            ? 'navigation'
            : 'complementary');
      el.id = `landmark-${idCounter++}-${type}`;
      doc.appendChild(el);
    }
    landmarks.push({ type, el });
  });

  return landmarks;
}

/**
 * Ensure that all landmark regions have unique IDs.
 * If duplicate IDs are found, they are renamed to avoid conflicts.
 *
 * @param { Array<{type:string, el:Document}> } landmarks - Landmark elements returned by addProperLandmarkRegions
 * @returns { Array<{type:string, el:Document}> } Updated landmarks with unique IDs
 */
function ensureUniqueLandmarkRegions(landmarks) {
  const idMap = new Map(); // maps original id -> new id
  const renamed = [];

  for (const lm of landmarks) {
    const id = lm.el.id;
    if (idMap.has(id)) {
      // Duplicate detected – generate a new unique id
      const newId = `landmark-${lm.type}-${idMap.get(id)}`;
      lm.el.id = newId;
      idMap.set(id, newId);
      renamed.push({ oldId: id, newId: newId });
    } else {
      idMap.set(id, id);
    }
  }

  // Optional: log warnings about duplicates
  if (renamed.length > 0) {
    console.warn('Duplicate landmark IDs detected and resolved:', renamed);
  }

  return landmarks;
}

// ADD THE NEW FUNCTION HERE
function addAndEnsureUniqueLandmarkRegions(doc) {
  const landmarks = addProperLandmarkRegions(doc);
  return ensureUniqueLandmarkRegions(landmarks);
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = require('./missingExportFile');

module.exports = {
  addProperLandmarkRegions,
  addAndEnsureUniqueLandmarkRegions,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain, // Add the new function to the exports
  addMissingExportFunction, // Add the new function to the exports
  getSvgAccessibleName
};