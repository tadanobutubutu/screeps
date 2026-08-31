// Accessibility Report Generator
// This function generates a formatted report based on accessibility issues

function generateAccessibilityReport(issues, options = {}) {
  const {
    includeHeader = true,
    outputFormat = 'markdown'
  } = options;

  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const moderateIssues = issues.filter(i => i.severity === 'moderate').length;
  const minorIssues = issues.filter(i => i.severity === 'minor').length;

  let report = '';

  if (includeHeader) {
    report += '# Accessibility Report\n\n';
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  }

  report += '## Summary\n\n';
  report += `- Total Issues: ${totalIssues}\n`;
  report += `- Critical: ${criticalIssues}\n`;
  report += `- Moderate: ${moderateIssues}\n`;
  report += `- Minor: ${minorIssues}\n\n`;

  if (totalIssues > 0) {
    report += '## Issues\n\n';

    const groupedByType = issues.reduce((acc, issue) => {
      const type = issue.type || 'Unknown';
      if (!acc[type]) acc[type] = [];
      acc[type].push(issue);
      return acc;
    }, {});

    Object.keys(groupedByType).forEach(type => {
      report += `### ${type}\n\n`;
      groupedByType[type].forEach((issue, index) => {
        report += `${index + 1}. **${issue.message}**\n`;
        if (issue.line) {
          report += `   - Line: ${issue.line}\n`;
        }
        if (issue.selector) {
          report += `   - Selector: \`${issue.selector}\`\n`;
        }
        if (issue.suggestion) {
          report += `   - Suggestion: ${issue.suggestion}\n`;
        }
        report += '\n';
      });
    });
  } else {
    report += '## No accessibility issues found. Great job!\n';
  }

  return report;
}

function exportReportAsJSON(issues) {
  return JSON.stringify({
    generatedAt: new Date().toISOString(),
    summary: {
      total: issues.length,
      bySeverity: {
        critical: issues.filter(i => i.severity === 'critical').length,
        moderate: issues.filter(i => i.severity === 'moderate').length,
        minor: issues.filter(i => i.severity === 'minor').length
      }
    },
    issues: issues
  }, null, 2);
}

// Export for testing and external use
module.exports = {
  generateAccessibilityReport,
  exportReportAsJSON
};