// main.js
// Main application logic

const fs = require('fs');
const path = require('path');

/**
 * Reads and parses the configuration file
 * @param {string} configPath - Path to config file
 * @returns {Object} - Parsed configuration
 */
function readConfig(configPath) {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error.message);
    return null;
  }
}

/**
 * Processes the insight report and returns a summary
 * @param {Object} report - The insight report
 * @returns {Object} - Report summary
 */
function processInsightReport(report) {
  if (!report || !report.issues) {
    return { error: 'Invalid report format' };
  }
  
  const summary = {
    total: report.issues.length,
    critical: 0,
    warning: 0,
    info: 0
  };
  
  report.issues.forEach(issue => {
    if (issue.severity === 'critical') summary.critical++;
    else if (issue.severity === 'warning') summary.warning++;
    else summary.info++;
  });
  
  return summary;
}

/**
 * Analyzes accessibility patterns in the code
 * @param {string} code - Source code to analyze
 * @returns {Array} - Found accessibility patterns
 */
function analyzeAccessibility(code) {
  const patterns = [];
  
  // Check for common accessibility issues
  if (!code.includes('aria-')) {
    patterns.push({ type: 'missing-aria', message: 'Consider adding ARIA attributes' });
  }
  
  if (!code.includes('alt=') && code.includes('<img')) {
    patterns.push({ type: 'missing-alt', message: 'Images should have alt attributes' });
  }
  
  return patterns;
}

// TODO: Implement function for addressing accessibility issues from insight report
// Placeholder for the new function

/**
 * Addresses accessibility issues from an insight report
 * Analyzes and processes accessibility violations to generate
 * recommended fixes and corrections
 * @param {Object} insightReport - The accessibility insight report containing issues
 * @param {Array} insightReport.issues - Array of accessibility issues
 * @param {Object} options - Optional configuration for addressing issues
 * @param {boolean} options.autoFix - Whether to attempt automatic fixes (default: false)
 * @returns {Object} - Summary of addressed issues with recommendations
 */
function addressAccessibilityIssues(insightReport, options = {}) {
  const { autoFix = false } = options;
  
  if (!insightReport || !insightReport.issues) {
    return {
      success: false,
      error: 'Invalid insight report format',
      addressedIssues: []
    };
  }
  
  const addressedIssues = [];
  const unresolvedIssues = [];
  
  insightReport.issues.forEach(issue => {
    const addressedIssue = {
      id: issue.id || `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: issue.description || 'Unknown issue',
      severity: issue.severity || 'info',
      type: issue.type || 'general',
      status: 'identified'
    };
    
    // Generate recommendation based on issue type
    addressedIssue.recommendation = generateAccessibilityRecommendation(issue);
    
    // Attempt auto-fix if enabled and applicable
    if (autoFix && isAutoFixable(issue)) {
      addressedIssue.fix = generateAutoFix(issue);
      addressedIssue.status = 'auto-fixed';
    } else {
      addressedIssue.status = 'requires-manual-review';
    }
    
    if (addressedIssue.status === 'auto-fixed') {
      addressedIssues.push(addressedIssue);
    } else {
      addressedIssues.push(addressedIssue);
      unresolvedIssues.push(addressedIssue);
    }
  });
  
  return {
    success: true,
    totalIssues: insightReport.issues.length,
    addressedCount: addressedIssues.filter(i => i.status === 'auto-fixed').length,
    reviewedCount: addressedIssues.length,
    unresolvedCount: unresolvedIssues.length,
    addressedIssues: addressedIssues,
    summary: generateSummary(addressedIssues)
  };
}

/**
 * Generates a recommendation for fixing an accessibility issue
 * @param {Object} issue - The accessibility issue to generate recommendation for
 * @returns {string} - Specific recommendation for fixing the issue
 */
function generateAccessibilityRecommendation(issue) {
  const issueType = issue.type || '';
  const lowerType = issueType.toLowerCase();
  
  const recommendations = {
    'missing-alt': 'Add descriptive alt text to images for screen reader users. Alt text should describe the image content or function.',
    'missing-aria-label': 'Add aria-label attribute to provide an accessible name for interactive elements.',
    'missing-aria-labelledby': 'Use aria-labelledby to associate labels with form controls or landmarks.',
    'missing-heading': 'Ensure proper heading hierarchy (h1-h6) for better document structure and screen reader navigation.',
    'low-contrast': 'Increase color contrast between text and background to meet WCAG 2.1 guidelines (minimum 4.5:1 for normal text).',
    'missing-form-label': 'Add label elements to form inputs for better accessibility and screen reader support.',
    'missing-link-text': 'Ensure link text is descriptive and meaningful. Avoid using "click here" or "read more".',
    'missing-button-name': 'Buttons should have accessible names. Use text content or aria-label.',
    'missing-image-alt': 'Add descriptive alt text to images for screen reader users.',
    'duplicate-id': 'Ensure all element IDs are unique within the document.',
    'missing-lang': 'Add lang attribute to the html element to specify the document language.',
    'missing-title': 'Add a title element to the document head for better accessibility.'
  };
  
  // Check for matching recommendation
  for (const [type, recommendation] of Object.entries(recommendations)) {
    if (lowerType.includes(type)) {
      return recommendation;
    }
  }
  
  // Default recommendation based on severity
  if (issue.severity === 'critical') {
    return `Critical accessibility issue: ${issue.description || 'Review and fix this issue immediately to ensure WCAG compliance.'}`;
  } else if (issue.severity === 'warning') {
    return `Accessibility warning: ${issue.description || 'Review this issue to improve accessibility compliance.'}`;
  }
  
  return issue.description || 'Review this accessibility issue and apply appropriate WCAG guidelines.';
}

/**
 * Determines if an accessibility issue can be automatically fixed
 * @param {Object} issue - The accessibility issue to check
 * @returns {boolean} - Whether the issue is auto-fixable
 */
function isAutoFixable(issue) {
  const autoFixableTypes = [
    'missing-lang',
    'missing-title',
    'duplicate-id'
  ];
  
  return autoFixableTypes.includes(issue.type) || false;
}

/**
 * Generates an automatic fix for a fixable accessibility issue
 * @param {Object} issue - The accessibility issue to fix
 * @returns {Object} - The generated fix with description and code changes
 */
function generateAutoFix(issue) {
  const fixableIssues = {
    'missing-lang': {
      description: 'Add lang attribute to html element',
      fix: 'Add lang="en" (or appropriate language code) to the <html> tag'
    },
    'missing-title': {
      description: 'Add title element to head',
      fix: 'Add <title>Your Page Title</title> in the <head> section'
    },
    'duplicate-id': {
      description: 'Make element IDs unique',
      fix: 'Ensure each id attribute value is unique within the document'
    }
  };
  
  const fix = fixableIssues[issue.type];
  if (fix) {
    return {
      description: fix.description,
      suggestion: fix.fix,
      original: issue.element || 'N/A'
    };
  }
  
  return {
    description: 'Manual fix required',
    suggestion: 'This issue requires manual review and correction'
  };
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} addressedIssues - Array of addressed issues
 * @returns {Object} - Summary statistics and key points
 */
function generateSummary(addressedIssues) {
  const summary = {
    bySeverity: { critical: 0, warning: 0, info: 0 },
    byStatus: { 'auto-fixed': 0, 'requires-manual-review': 0 },
    topRecommendations: []
  };
  
  addressedIssues.forEach(issue => {
    // Count by severity
    const severity = issue.severity || 'info';
    summary.bySeverity[severity] = (summary.bySeverity[severity] || 0) + 1;
    
    // Count by status
    summary.byStatus[issue.status] = (summary.byStatus[issue.status] || 0) + 1;
  });
  
  // Get top 3 recommendations
  const recommendations = addressedIssues
    .map(issue => issue.recommendation)
    .filter((rec, index, self) => rec && self.indexOf(rec) === index)
    .slice(0, 3);
  
  summary.topRecommendations = recommendations;
  
  return summary;
}

module.exports = {
  readConfig,
  processInsightReport,
  analyzeAccessibility,
  addressAccessibilityIssues,
  generateAccessibilityRecommendation,
  isAutoFixable,
  generateAutoFix,
  generateSummary
};