// main.js - Application entry point
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// ADD: Address new accessibility issues from insight report

// ... (Existing code and exports)

// New function to add accessible names to custom HTML elements
function addAccessibleName(element) {
  if (typeof element.accessibleName !== 'string') {
    element.accessibleName = element.innerHTML;
  }
}

// New function to validate custom HTML elements accessibility
function validateCustomElementsAccessibility(elements) {
  for (const element of elements) {
    if (element.tagName !== 'BUTTON' && element.tagName !== 'A') {
      addAccessibleName(element);
    }
  }
}

// Appended new function to ensure unique landmarks for custom HTML elements by ID
function ensureUniqueCustomElementsById(elements) {
  const seen = new Set();
  const uniqueElements = [];

  for (const element of elements) {
    if (!element || typeof element.id === 'undefined') {
      continue;
    }

    const elementId = typeof element.id === 'string' ? element.id : String(element.id);

    if (!seen.has(elementId)) {
      seen.add(elementId);
      uniqueElements.push(element);
    }
  }

  return uniqueElements;
}

// New function to generate a report based on custom HTML elements accessibility
function generateCustomElementsAccessibilityReport(customElements) {
  const report = {
    customElementsAccessibility: {}
  };

  validateCustomElementsAccessibility(customElements);

  for (const element of customElements) {
    const { id, accessibleName } = element;
    const accessibleNameTrimmed = accessibleName.trim();

    if (accessibleNameTrimmed.length === 0 || id === null || typeof id !== 'string') {
      report.customElementsAccessibility[id] = {
        issue: 'accessibleName is missing or empty',
        message: `Element with ID "${id}" does not have accessibleName set.`
      };
    }
  }

  return report;
}

// Modified generateAccessibilityReport function to scan custom HTML elements accessibility
function generateAccessibilityReport() {
  const report = scanAccessibility();
  const linksReport = generateLinksAccessibilityReport();
  const customElementsReport = generateCustomElementsAccessibilityReport(document.getElementsByTagName('*'));

  report.linksAccessibility = linksReport;
  report.customElementsAccessibility = customElementsReport.customElementsAccessibility;
  writeReport(report);
  return report;
}

// Export new necessary functions
module.exports = {
  // ... (Existing exports)
  ensureUniqueCustomElementsById,
  generateCustomElementsAccessibilityReport
};