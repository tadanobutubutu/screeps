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
  // New function added after the existing code
  calculateAverage
}

function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return null;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}