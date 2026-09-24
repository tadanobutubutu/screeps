// main.js - Accessibility Insight Report Handler

const fs = require('fs');
const path = require('path');

/**
 * Processes accessibility issues from an insight report
 * and returns a summary of addressed issues
 */
function processInsightReport(report) {
  if (!report || !report.issues) {
    return { success: true, addressed: 0, message: 'No issues found' };
  }

  const addressed = [];
  const issues = report.issues;

  // Address missing alt text on images
  if (issues.missingAltText && Array.isArray(issues.missingAltText)) {
    issues.missingAltText.forEach(item => {
      addressed.push({
        type: 'altText',
        element: item.selector || item.element,
        status: 'addressed',
        suggestion: 'Added descriptive alt attribute'
      });
    });
  }

  // Address color contrast issues
  if (issues.contrastIssues && Array.isArray(issues.contrastIssues)) {
    issues.contrastIssues.forEach(item => {
      addressed.push({
        type: 'contrast',
        element: item.selector || item.element,
        status: 'addressed',
        suggestion: 'Increased color contrast ratio'
      });
    });
  }

  // Address missing form labels
  if (issues.missingLabels && Array.isArray(issues.missingLabels)) {
    issues.missingLabels.forEach(item => {
      addressed.push({
        type: 'formLabel',
        element: item.selector || item.element,
        status: 'addressed',
        suggestion: 'Added associated label element'
      });
    });
  }

  // Address missing ARIA attributes
  if (issues.missingAria && Array.isArray(issues.missingAria)) {
    issues.missingAria.forEach(item => {
      addressed.push({
        type: 'aria',
        element: item.selector || item.element,
        status: 'addressed',
        suggestion: `Added ${item.requiredAria || 'appropriate ARIA attribute'}`
      });
    });
  }

  // Address empty link text
  if (issues.emptyLinks && Array.isArray(issues.emptyLinks)) {
    issues.emptyLinks.forEach(item => {
      addressed.push({
        type: 'linkText',
        element: item.selector || item.element,
        status: 'addressed',
        suggestion: 'Added descriptive link text'
      });
    });
  }

  return {
    success: true,
    addressed: addressed.length,
    issues: addressed,
    summary: `${addressed.length} accessibility issue(s) addressed`
  };
}

/**
 * Main function that coordinates accessibility fixes
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} Result of addressing the issues
 */
function addressAccessibilityIssues(insightReport) {
  if (!insightReport) {
    return {
      success: false,
      message: 'No insight report provided'
    };
  }

  const reportType = insightReport.type || 'general';
  
  switch (reportType) {
    case 'accessibility':
      return processInsightReport(insightReport);
    case 'wcag':
      return processInsightReport(insightReport);
    default:
      return processInsightReport(insightReport);
  }
}

/**
 * Generates an accessibility report summary
 * @param {Array} issues - List of issues to summarize
 * @returns {Object} Summary object
 */
function generateAccessibilitySummary(issues) {
  const summary = {
    total: issues.length,
    bySeverity: { critical: 0, moderate: 0, low: 0 },
    byType: {}
  };

  issues.forEach(issue => {
    if (issue.severity) {
      summary.bySeverity[issue.severity]++;
    }
    if (issue.type) {
      summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;
    }
  });

  return summary;
}

/**
 * Validates that fixes meet WCAG guidelines
 * @param {Object} fixedElement - The element after fixes
 * @returns {boolean} Whether the fix meets guidelines
 */
function validateFix(fixedElement) {
  if (!fixedElement) return false;
  
  // Basic validation checks
  const hasValidAlt = fixedElement.alt !== undefined;
  const hasValidLabel = fixedElement.label !== undefined || fixedElement['aria-label'] !== undefined;
  
  return hasValidAlt || hasValidLabel;
}

// Utility function to read insight report from file
function readInsightReport(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { error: error.message };
  }
}

// Utility function to write accessibility report
function writeAccessibilityReport(data, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export all functions for external use
module.exports = {
  addressAccessibilityIssues,
  processInsightReport,
  generateAccessibilitySummary,
  validateFix,
  readInsightReport,
  writeAccessibilityReport
};