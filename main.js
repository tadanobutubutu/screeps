function divide(a, b) {
  if (b === 0) {
    return 0;
  }
  return a / b;
}

// TODO: add the new functions or changes requested in the issue

module.exports = {
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  addressAccessibilityIssues,
  createInPageButton,
  validateTableAccessibility,
  validateLandmarkStructure,
  getLangAttribute,
  getSvgAccessibleName,
  personName,
  divide,
  checkLinkAccessibility,
  wrapPrimaryContentInMain
}