// Existing code that was not part of the conflict

// TODO: Address accessibility issues from insight report:

// New code or changes requested in the issue
/**
 * Generates a report based on accessibility issues found in the application
 * @param {Array} issues - Array of accessibility issues to include in the report
 * @returns {Object} - A report object containing summary and detailed information
 */
function generateAccessibilityReport(issues) {
  if (!Array.isArray(issues)) {
    throw new Error('Issues must be provided as an array');
  }

  const report = {
    summary: {
      totalIssues: issues.length,
      severityCounts: {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      },
      categories: {}
    },
    details: issues.map(issue => ({
      id: issue.id,
      message: issue.message,
      severity: issue.severity,
      context: issue.context,
      selector: issue.selector,
      helpUrl: issue.helpUrl
    }))
  };

  // Count severity levels
  issues.forEach(issue => {
    if (issue.severity in report.summary.severityCounts) {
      report.summary.severityCounts[issue.severity]++;
    }

    // Count by category
    const category = issue.helpUrl.split('/').pop().split('.')[0];
    if (category) {
      report.summary.categories[category] = (report.summary.categories[category] || 0) + 1;
    }
  });

  return report;
}

// Export the new function while preserving existing exports
export { generateAccessibilityReport };