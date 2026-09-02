import React from 'react';

module.exports = {
  wrapPrimaryContentInMain: (content) => `<main>${content}</main>`,
  // Existing exports... (preserve all)
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  ensureUniqueLandmarks,
  createInPageButton,
  personName,
  // New accessibility exports
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  meetsContrastRequirement,
  validateHeadingHierarchy,
  validateFormLabels,
  getImageAltText,
  validateImageAltText,
  validateAriaAttributes,
  focusElement,
  runAccessibilityAudit
};