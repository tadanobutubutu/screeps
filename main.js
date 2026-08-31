/**
 * Validates an accessibility report for issues.
 * @param {Object} report - The accessibility report to validate.
 * @param {Array} report.issues - Array of accessibility issues.
 * @param {Object} options - Validation options.
 * @param {number} options.maxCritical - Maximum allowed critical issues.
 * @param {number} options.maxSerious - Maximum allowed serious issues.
 * @param {number} options.maxModerate - Maximum allowed moderate issues.
 * @param {number} options.maxMinor - Maximum allowed minor issues.
 * @returns {Object} Validation result with passed status and details.
 */
function validateAccessibilityReport(report, options = {}) {
  if (!report || !Array.isArray(report.issues)) {
    return {
      passed: false,
      error: 'Invalid report format: missing issues array',
      summary: { critical: 0, serious: 0, moderate: 0, minor: 0 }
    };
  }

  const defaults = {
    maxCritical: 0,
    maxSerious: 0,
    maxModerate: 10,
    maxMinor: 50
  };

  const config = { ...defaults, ...options };

  const counts = report.issues.reduce((acc, issue) => {
    const severity = (issue.severity || issue.impact || '').toLowerCase();
    if (acc.hasOwnProperty(severity)) {
      acc[severity]++;
    }
    return acc;
  }, { critical: 0, serious: 0, moderate: 0, minor: 0 });

  const passed =
    counts.critical <= config.maxCritical &&
    counts.serious <= config.maxSerious &&
    counts.moderate <= config.maxModerate &&
    counts.minor <= config.maxMinor;

  const details = {
    critical: { count: counts.critical, allowed: config.maxCritical, passed: counts.critical <= config.maxCritical },
    serious: { count: counts.serious, allowed: config.maxSerious, passed: counts.serious <= config.maxSerious },
    moderate: { count: counts.moderate, allowed: config.maxModerate, passed: counts.moderate <= config.maxModerate },
    minor: { count: counts.minor, allowed: config.maxMinor, passed: counts.minor <= config.maxMinor }
  };

  return {
    passed,
    summary: counts,
    details
  };
}

function formatValidationSummary(result) {
  if (!result || typeof result !== 'object') {
    return 'Invalid validation result';
  }
  const summary = result.summary || {};
  return `Accessibility report: ${result.passed ? 'PASSED' : 'FAILED'} (critical: ${summary.critical || 0}, serious: ${summary.serious || 0}, moderate: ${summary.moderate || 0}, minor: ${summary.minor || 0})`;
}

function greet(name) {
  return `Hello, ${name}!`;
}

function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

exports.validateAccessibilityReport = validateAccessibilityReport;
exports.formatValidationSummary = formatValidationSummary;
exports.greet = greet;
exports.calculateSum = calculateSum;
exports.calculateProduct = calculateProduct;