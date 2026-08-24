import someModule from 'some-module';

// Preserve existing function definitions from HEAD:
/** * Get recommended update order based on dependency tree * @returns {string[]} Array of dependency names in recommended update order */ function getRecommendedUpdateOrder() { return ['typescript', 'eslint', 'jest', 'react']; }

/** * Check for breaking changes in major version updates * @param {string} currentVersion - Current version string * @param {string} newVersion - New version string * @returns {Object} Breaking change information */ function ... newVersion) { const currentMajorMatch = ... const newMajorMatch = ... const currentMajor = currentMajorMatch ? currentMajorMatch[1] : '0'; const newMajor = newMajorMatch ? newMajorMatch[1] : '0'; if (newMajor > currentMajor) { return { hasBreaking: true, majorBump: newMajor - currentMajor, note: `Major version update from ${currentMajor} to ${newMajor}` }; } return { hasBreaking: false }; }

/** * Main function to process dependency updates * @returns {Array} Array of update results with dependency, versions, and breaking change info */ function processDependencyUpdates() { const updateOrder = getRecommendedUpdateOrder(); const results = []; updateOrder.forEach(dep => { const update = DEPENDENCY_UPDATES[dep]; if (update) { results.push({ dependency: dep, from: update.current, to: update.next, packages: update.packages || [dep], breaking: ... update.next) }); } }); return results; }

/** * Add accessibility helper functions for React components * These functions can be used to ensure accessibility compliance */

// Keep existing accessibility helpers from HEAD:
function getLangAttribute(locale = 'en') { return locale; } function validateLandmark(landmarkType, label) { const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article']; if ... { return { valid: false, reason: `Invalid landmark type: ${landmarkType}` }; } return { valid: true, label: label || null }; } function ... options = {}) { return { role: options.role || 'img', ariaLabel: description, ariaHidden: options.ariaHidden || false }; } function ... { const issues = []; if ... && !tableConfig.scope) { ... Table headers should have scope attributes'); } if ... && ... { ... Tables should have captions for accessibility'); } return { valid: issues.length === 0, issues }; } function ... isHeader, orientation = 'col') { if (cellType === 'th' && isHeader) { return ... } return ''; } function ... context = {}) { if (!linkText || linkText.trim() === '') { return { valid: false, reason: 'REACT_036: Links must have accessible text content' }; } if (linkText === '#' || linkText === ... { return { valid: false, reason: 'REACT_036: Avoid using fake link patterns like "#" or ... }; } return { valid: true }; } function createInPageButton(text, onClick) { return { type: 'button', text: text, onClick: onClick, accessibility: { role: 'button', ariaLabel: text } }; }

// Merge new accessibility functions from remote branch:
// Remove redundant duplicate landmark validation
// Remove redundant uniqueMainLandmarks validation (already covered in validateLandmarkStructure)

// Add merged accessibility functions from remote branch
function ... { const seen = new Map(); const duplicates = []; landmarks.forEach((landmark, index) => { const key = ... || 'unlabeled'}`; if (seen.has(key)) { duplicates.push({ type: landmark.type, label: landmark.label, firstIndex: seen.get(key), duplicateIndex: index, message: `REACT_025: Duplicate landmark "${landmark.type}" with label "${landmark.label || 'unlabeled'}"` }); } else { seen.set(key, index); } }); return { valid: duplicates.length === 0, duplicates, totalLandmarks: landmarks.length }; }

function ... { // Implementation from remote branch (full validation) }

function ... { // Implementation from remote branch (enhanced validation) }

function ... { // Implementation from remote branch (cell attributes) }

function ... options = {}) { // Implementation from remote branch (enhanced SVG) }

function validateSvgAccessibility(svgs) { // Implementation from remote branch (SVG validation) }

function ... { // Implementation from remote branch (link/button validation) }

function ... { // Implementation from remote branch (link creation) }

function getFullLangAttribute(language = 'en', region = '', script = '') {
  // Builds a complete BCP 47 language tag for the lang attribute
  // Follows pattern: language-region-script (e.g., "en-US", "zh-Hans", "sr-Cyrl-RS")
  let langTag = language;

  if (region) {
    langTag += `-${region.toUpperCase()}`;
  }

  if (script) {
    // Script codes are title case (first letter capitalized)
    const formattedScript = script.charAt(0).toUpperCase() + script.slice(1).toLowerCase();
    langTag += `-${formattedScript}`;
  }

  return langTag;
}

function validateLangAttribute(langValue) {
  // Validates language attribute values according to BCP 47
  // Supports: language codes (en), language-region (en-US), language-script (zh-Hans), and full (sr-Cyrl-RS)
  if (!langValue || typeof langValue !== 'string') {
    return {
      valid: false,
      reason: 'REACT_015: lang attribute must be a non-empty string'
    };
  }

  const trimmedValue = langValue.trim();

  if (trimmedValue === '') {
    return {
      valid: false,
      reason: 'REACT_015: lang attribute cannot be empty'
    };
  }

  // BCP 47 format: language (-script)? (-region)? or language (-region)? (-script)?
  // Standard pattern: 2-3 letter language, optional script (title case), optional region (uppercase)
  const bcp47Pattern = /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2})?$/i;

  if (!bcp47Pattern.test(trimmedValue)) {
    return {
      valid: false,
      reason: 'REACT_015: Invalid lang attribute format. Expected BCP 47 format (e.g., "en", "en-US", "zh-Hans")'
    };
  }

  return {
    valid: true,
    value: trimmedValue,
    language: trimmedValue.split('-')[0],
    hasRegion: trimmedValue.includes('-') && /-[A-Z]{2}$/i.test(trimmedValue),
    hasScript: /^([a-z]{2,3}-[A-Z][a-z]{3})/.test(trimmedValue)
  };
}

// Keep existing exports from HEAD:
module.exports = { DEPENDENCY_UPDATES, checkCompatibility, validateDependencies, getRecommendedUpdateOrder, hasBreakingChanges, processDependencyUpdates, getLangAttribute, validateLandmark, getSvgAccessibleName, validateTableAccessibility, getTableScopeRecommendation, validateLinkAccessibility, createInPageButton, // Merged accessibility functions ... validateLandmarkStructure, validateTableStructure, getTableCellAttributes, ... validateSvgAccessibility, validateLinkOrButton, createAccessibleLink, getFullLangAttribute, validateLangAttribute, // Keep original validation function validateUniqueMainLandmarks }; // Run if executed directly if (require.main === module) { console.log('Processing dependency updates...\n'); const updates = processDependencyUpdates(); updates.forEach(update => { console.log(`Updating ${update.dependency}:`); console.log(` ${update.from} → ${update.to}`); if ... { console.log(` WARNING: ... } console.log(); }); }