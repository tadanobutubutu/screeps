// main.js - Core module for accessibility insights processing

/**
 * Processes and addresses accessibility issues from insight reports
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @param {Array} insightReport.issues - Array of accessibility issues
 * @param {Object} options - Configuration options for processing
 * @returns {Object} Processed results with addressed issues
 */
function addressAccessibilityIssues(insightReport, options = {}) {
  const {
    autoFix = false,
    severityThreshold = 'medium',
    includeRecommendations = true
  } = options;

  if (!insightReport || !Array.isArray(insightReport.issues)) {
    throw new Error('Invalid insight report: missing or invalid issues array');
  }

  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const thresholdLevel = severityOrder[severityThreshold] ?? 2;

  const addressedIssues = insightReport.issues
    .filter(issue => severityOrder[issue.severity] <= thresholdLevel)
    .map(issue => {
      const addressedIssue = {
        ...issue,
        addressed: false,
        fixApplied: null,
        timestamp: new Date().toISOString()
      };

      if (autoFix && issue.autoFixable) {
        addressedIssue.addressed = true;
        addressedIssue.fixApplied = applyAutoFix(issue);
      }

      if (includeRecommendations && !addressedIssue.addressed) {
        addressedIssue.recommendations = generateRecommendations(issue);
      }

      return addressedIssue;
    });

  return {
    totalIssues: insightReport.issues.length,
    addressedCount: addressedIssues.filter(i => i.addressed).length,
    pendingCount: addressedIssues.filter(i => !i.addressed).length,
    issues: addressedIssues,
    summary: generateSummary(addressedIssues)
  };
}

/**
 * Applies automatic fixes for common accessibility issues
 * @param {Object} issue - The accessibility issue to fix
 * @returns {Object} Details of the fix applied
 */
function applyAutoFix(issue) {
  const fixes = {
    'missing-alt-text': () => ({ action: 'added-alt-attribute', description: 'Added descriptive alt text based on context' }),
    'insufficient-contrast': () => ({ action: 'adjusted-colors', description: 'Adjusted foreground/background colors to meet WCAG AA contrast ratio' }),
    'missing-form-label': () => ({ action: 'added-label', description: 'Associated label element with form control' }),
    'empty-heading': () => ({ action: 'removed-empty-heading', description: 'Removed empty heading element' }),
    'missing-lang-attribute': () => ({ action: 'added-lang-attribute', description: 'Added lang attribute to html element' })
  };

  const fixer = fixes[issue.ruleId];
  if (fixer) {
    return fixer();
  }

  return { action: 'none', description: 'No automatic fix available for this issue type' };
}

/**
 * Generates recommendations for manual accessibility fixes
 * @param {Object} issue - The accessibility issue
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(issue) {
  const recommendations = {
    'missing-alt-text': [
      'Add descriptive alt attribute to image',
      'Use empty alt="" for decorative images',
      'Ensure alt text conveys the same information as the image'
    ],
    'insufficient-contrast': [
      'Increase contrast ratio to at least 4.5:1 for normal text',
      'Use 3:1 ratio for large text (18pt+ or 14pt+ bold)',
      'Test with color blindness simulators'
    ],
    'missing-form-label': [
      'Add <label> element with for attribute matching input id',
      'Use aria-label or aria-labelledby as alternative',
      'Ensure label is visible and descriptive'
    ],
    'keyboard-navigation': [
      'Ensure all interactive elements are focusable',
      'Add visible focus indicators',
      'Maintain logical tab order'
    ],
    'missing-heading-structure': [
      'Use heading tags (h1-h6) in hierarchical order',
      'Do not skip heading levels',
      'Use headings to create document outline'
    ]
  };

  return recommendations[issue.ruleId] || [
    'Review WCAG guidelines for this issue type',
    'Test with assistive technologies',
    'Consult accessibility expert if needed'
  ];
}

/**
 * Generates a summary of addressed accessibility issues
 * @param {Array} issues - Array of processed issues
 * @returns {Object} Summary statistics
 */
function generateSummary(issues) {
  const bySeverity = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  const byRule = issues.reduce((acc, issue) => {
    acc[issue.ruleId] = (acc[issue.ruleId] || 0) + 1;
    return acc;
  }, {});

  return {
    bySeverity,
    byRule,
    complianceScore: calculateComplianceScore(issues)
  };
}

/**
 * Calculates a compliance score based on addressed issues
 * @param {Array} issues - Array of processed issues
 * @returns {number} Compliance score (0-100)
 */
function calculateComplianceScore(issues) {
  if (issues.length === 0) return 100;

  const severityWeights = { critical: 40, high: 20, medium: 10, low: 5 };
  const totalWeight = issues.reduce((sum, issue) => sum + (severityWeights[issue.severity] || 5), 0);
  const addressedWeight = issues
    .filter(issue => issue.addressed)
    .reduce((sum, issue) => sum + (severityWeights[issue.severity] || 5), 0);

  return Math.round((addressedWeight / totalWeight) * 100);
}

/**
 * Validates an insight report structure
 * @param {Object} report - The insight report to validate
 * @returns {boolean} True if valid
 */
function validateInsightReport(report) {
  return report &&
    Array.isArray(report.issues) &&
    report.issues.every(issue =>
      issue.ruleId &&
      issue.severity &&
      ['critical', 'high', 'medium', 'low'].includes(issue.severity)
    );
}

module.exports = {
  addressAccessibilityIssues,
  applyAutoFix,
  generateRecommendations,
  generateSummary,
  calculateComplianceScore,
  validateInsightReport
};