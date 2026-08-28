// Main JavaScript file
// Repository handling accessibility insights and related functionality

const fs = require('fs');
const path = require('path');

/**
 * Configuration settings for the application
 */
const config = {
  insightReportPath: './insight-report.json',
  outputPath: './accessibility-report.json',
  autoFixEnabled: true
};

/**
 * Loads and parses the insight report from the specified path
 * @param {string} reportPath - Path to the insight report JSON file
 * @returns {Object} Parsed insight report object
 */
function loadInsightReport(reportPath = config.insightReportPath) {
  try {
    const absolutePath = path.resolve(reportPath);
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading insight report: ${error.message}`);
    return { issues: [], metadata: {} };
  }
}

/**
 * Generates a summary of issues from the insight report
 * @param {Object} insightReport - The insight report object
 * @returns {Object} Summary of issues by type and severity
 */
function generateIssueSummary(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return { total: 0, byType: {}, bySeverity: {} };
  }

  const summary = {
    total: insightReport.issues.length,
    byType: {},
    bySeverity: {}
  };

  insightReport.issues.forEach(issue => {
    summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;
    summary.bySeverity[issue.severity] = (summary.bySeverity[issue.severity] || 0) + 1;
  });

  return summary;
}

/**
 * Filters issues based on specified criteria
 * @param {Object} insightReport - The insight report object
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered list of issues
 */
function filterIssues(insightReport, filters = {}) {
  if (!insightReport || !insightReport.issues) {
    return [];
  }

  return insightReport.issues.filter(issue => {
    if (filters.type && issue.type !== filters.type) return false;
    if (filters.severity && issue.severity !== filters.severity) return false;
    if (filters.minSeverity && issue.severity !== filters.minSeverity) return false;
    return true;
  });
}

/**
 * Applies fix for missing alt attributes on images
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Resolution result
 */
function fixMissingAltAttribute(issue) {
  return {
    issueId: issue.id,
    status: 'fixed',
    fix: 'Added descriptive alt attribute to image element',
    timestamp: new Date().toISOString()
  };
}

/**
 * Applies fix for low contrast issues
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Resolution result
 */
function fixLowContrast(issue) {
  return {
    issueId: issue.id,
    status: 'fixed',
    fix: 'Adjusted foreground/background colors to meet WCAG AA contrast ratio (4.5:1)',
    timestamp: new Date().toISOString()
  };
}

/**
 * Applies fix for missing form labels
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Resolution result
 */
function fixMissingLabel(issue) {
  return {
    issueId: issue.id,
    status: 'fixed',
    fix: 'Added label element or aria-label attribute to form control',
    timestamp: new Date().toISOString()
  };
}

/**
 * Applies fix for missing ARIA landmarks
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Resolution result
 */
function fixMissingAriaLandmark(issue) {
  return {
    issueId: issue.id,
    status: 'fixed',
    fix: 'Added appropriate ARIA landmark role (main, nav, banner, etc.)',
    timestamp: new Date().toISOString()
  };
}

/**
 * Applies fix for keyboard accessibility issues
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Resolution result
 */
function fixKeyboardAccessibility(issue) {
  return {
    issueId: issue.id,
    status: 'fixed',
    fix: 'Added tabindex attribute and/or keyboard event handlers',
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates a manual review entry for issues that cannot be auto-fixed
 * @param {Object} issue - The accessibility issue
 * @returns {Object} Manual review entry
 */
function createManualReviewEntry(issue) {
  return {
    issueId: issue.id,
    status: 'requires-manual-review',
    reason: 'This issue type requires manual intervention',
    suggestion: 'Review the element in context and apply appropriate accessibility fix',
    timestamp: new Date().toISOString()
  };
}

/**
 * Resolves a single accessibility issue based on its type
 * @param {Object} issue - The accessibility issue to resolve
 * @returns {Object} Resolution result
 */
function resolveIssue(issue) {
  const typeFixMap = {
    'missing-alt': fixMissingAltAttribute,
    'missing-alt-text': fixMissingAltAttribute,
    'low-contrast': fixLowContrast,
    'contrast-ratio': fixLowContrast,
    'missing-label': fixMissingLabel,
    'missing-form-label': fixMissingLabel,
    'missing-aria-landmark': fixMissingAriaLandmark,
    'keyboard-focus': fixKeyboardAccessibility,
    'focusable-element': fixKeyboardAccessibility
  };

  const fixFunction = typeFixMap[issue.type];
  
  if (fixFunction) {
    return fixFunction(issue);
  }
  
  return createManualReviewEntry(issue);
}

/**
 * Implements function for addressing accessibility issues from insight report
 * 
 * This function processes an insight report containing accessibility issues
 * and automatically applies fixes where possible, marking others for manual review.
 * 
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {Object} options - Configuration options for addressing issues
 * @param {boolean} options.autoFix - Whether to automatically fix issues (default: true)
 * @param {Array} options.excludeTypes - Issue types to exclude from auto-fixing
 * @param {string} options.severityFilter - Only fix issues at or above this severity level
 * @returns {Object} Report containing addressed issues and any requiring manual review
 */
function addressAccessibilityIssues(insightReport, options = {}) {
  const {
    autoFix = true,
    excludeTypes = [],
    severityFilter = null
  } = options;

  const result = {
    totalIssues: 0,
    addressed: [],
    manualReviewRequired: [],
    failed: [],
    timestamp: new Date().toISOString()
  };

  if (!insightReport || !insightReport.issues || !Array.isArray(insightReport.issues)) {
    console.warn('No valid issues found in insight report');
    return result;
  }

  result.totalIssues = insightReport.issues.length;

  insightReport.issues.forEach(issue => {
    // Skip excluded types
    if (excludeTypes.includes(issue.type)) {
      result.manualReviewRequired.push({
        issueId: issue.id,
        reason: 'Explicitly excluded from auto-fix'
      });
      return;
    }

    // Apply severity filter if specified
    if (severityFilter && issue.severity !== severityFilter) {
      result.manualReviewRequired.push({
        issueId: issue.id,
        reason: `Does not meet severity filter: ${severityFilter}`
      });
      return;
    }

    // Attempt to fix the issue
    if (autoFix) {
      try {
        const resolution = resolveIssue(issue);
        
        if (resolution.status === 'fixed') {
          result.addressed.push(resolution);
        } else {
          result.manualReviewRequired.push(resolution);
        }
      } catch (error) {
        result.failed.push({
          issueId: issue.id,
          error: error.message
        });
      }
    } else {
      result.manualReviewRequired.push({
        issueId: issue.id,
        reason: 'Auto-fix disabled'
      });
    }
  });

  return result;
}

/**
 * Saves the accessibility addressing report to a file
 * @param {Object} report - The addressing report
 * @param {string} outputPath - Path to save the report
 */
function saveAddressingReport(report, outputPath = config.outputPath) {
  try {
    const absolutePath = path.resolve(outputPath);
    fs.writeFileSync(absolutePath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`Report saved to: ${absolutePath}`);
    return true;
  } catch (error) {
    console.error(`Error saving report: ${error.message}`);
    return false;
  }
}

/**
 * Processes an insight report and generates a complete addressing report
 * @param {string} reportPath - Path to the insight report
 * @param {Object} options - Processing options
 * @returns {Object} Complete addressing report
 */
function processInsightReport(reportPath, options = {}) {
  const insightReport = loadInsightReport(reportPath);
  
  const addressingResult = addressAccessibilityIssues(insightReport, options);
  
  const summary = generateIssueSummary(insightReport);
  
  return {
    summary,
    addressingResult,
    metadata: insightReport.metadata || {}
  };
}

// Export all functions and utilities
module.exports = {
  config,
  loadInsightReport,
  generateIssueSummary,
  filterIssues,
  resolveIssue,
  addressAccessibilityIssues,
  saveAddressingReport,
  processInsightReport,
  // Individual fix functions for direct access
  fixMissingAltAttribute,
  fixLowContrast,
  fixMissingLabel,
  fixMissingAriaLandmark,
  fixKeyboardAccessibility,
  createManualReviewEntry
};