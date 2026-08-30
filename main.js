import insightApi from './insightApi';

// Existing exports (preserved)
export function getValue() {
  return 42;
}

export function processItem(item) {
  return item * 2;
}

export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}

export function formatString(text) {
  return text.toUpperCase();
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Implemented function for addressing accessibility issues from insight report
export const addressAccessibilityIssues = (insightReport) => {
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

  return recommendations;
};

export const generateInsightReport = async (options) => {
  try {
    const report = await insightApi.getReport(options);
    return report;
  } catch (error) {
    console.error('Error generating insight report:', error);
    throw error;
  }
};

// TODO: Replace with actual report generation logic.
export const generateReport = async (reportOptions) => {
  const report = await generateInsightReport(reportOptions);
  const accessibilityIssues = addressAccessibilityIssues(report);
  const formattedReport = `Insight Report:
  - Total Items: ${calculateTotal(report.items)}
  - Accessibility Issues: ${accessibilityIssues.join('\n  - ')}`;
  
  return formattedReport;
};