const main = require('./utilities')

function validateTableStructure(container) {
  return main.validateTableStructureForAccessibility(container);
}

function validateHeadingHierarchy(headings) {
  return main.validateTableAccessibility(headings);
}

function ensureHeadingHierarchy(container) {
  return main.ensureHeadingHierarchy(container);
}

function renderAdditionalContent(additionalData) {
  return main.renderAdditionalContentData(additionalData);
}

// Export functions to make them accessible
module.exports = {
  validateTableStructure,
  validateHeadingHierarchy,
  ensureHeadingHierarchy,
  renderAdditionalContent
}