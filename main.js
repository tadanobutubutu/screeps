function divide(a, b) {
  if (b === 0) {
    return 0;
  }
  return a / b;
}

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
  wrapPrimaryContentInMain,
  // New function added as per the issue
  calculatePercentage
}

function calculatePercentage(total, value) {
  return (value / total) * 100;
}