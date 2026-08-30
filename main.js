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
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generates a human-readable summary of the validation result.
 * @param {Object} validationResult - Result from validateAccessibilityReport.
 * @returns {string} Formatted summary string.
 */
function formatValidationSummary(validationResult) {
  if (validationResult.error) {
    return `Validation Error: ${validationResult.error}`;
  }

  const { passed, summary, details } = validationResult;
  const status = passed ? 'PASSED' : 'FAILED';
  
  let output = `Accessibility Validation: ${status}\n`;
  output += `Total Issues: ${summary.critical + summary.serious + summary.moderate + summary.minor}\n\n`;
  
  output += 'Breakdown by Severity:\n';
  for (const [severity, data] of Object.entries(details)) {
    const statusIcon = data.passed ? '✓' : '✗';
    output += `  ${statusIcon} ${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${data.count}/${data.allowed}\n`;
  }

  return output;
}

module.exports = {
  validateAccessibilityReport,
  formatValidationSummary
};