const insightApi = require('./insightApi');

// 47: // TODO: Implement function for addressing accessibility issues from insight report
const addressAccessibilityIssues = (insightReport) => {
  const recommendations = [];
  
  if (!insightReport || !insightReport.accessibility || !insightReport.accessibility.issues) {
    return recommendations;
  }

  const issues = insightReport.accessibility.issues;
  
  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'critical':
        recommendations.push(`[CRITICAL] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'high':
        recommendations.push(`[HIGH] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'medium':
        recommendations.push(`[MEDIUM] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'low':
        recommendations.push(`[LOW] ${issue.id}: ${issue.description}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      default:
        recommendations.push(`[UNKNOWN] ${issue.id}: ${issue.description}`);
    }
  });

  // New code to check for tables and push recommendations if issues found
  if (insightReport.accessibility.tableIssues) {
    const tableIssues = insightReport.accessibility.tableIssues;
    tableIssues.forEach((tableIssue) => {
      recommendations.push(`[TABLE] ${tableIssue.id}: ${tableIssue.description}`);
      if (tableIssue.suggestedFix) {
        recommendations.push(`  Fix: ${tableIssue.suggestedFix}`);
      }
    });
  }

  return recommendations;
};

const generateInsightReport = async (options) => {
  try {
    const report = await insightApi.getReport(options);
    return report;
  } catch (error) {
    console.error('Error generating insight report:', error);
    throw error;
  }
};

module.exports = {
  generateInsightReport,
  addressAccessibilityIssues
};