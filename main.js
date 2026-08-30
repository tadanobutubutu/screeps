import insightApi from './insightApi';

// Existing exports (preserved)
export function getValue() {
  return 42;
}

export function processItem(item) {
  return item * 2;
}

// Missing exports to add
export function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item, 0);
}
export function formatString(text) {
  return text.toUpperCase();
}
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 47: Implement function for addressing accessibility issues from insight report
export const addressAccessibilityIssues = (insightReport) => {
  const recommendations = [];
  
  if (!insightReport || !insightReport.accessibility || !insightReport.accessibility.issues) {
    return recommendations;
  }

  const issues = insightReport.accessibility.issues;
  
  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'critical':
        recommendations.push(`${issue.id}: [CRITICAL] ${issue.description || 'No description'}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'high':
        recommendations.push(`${issue.id}: [HIGH] ${issue.description || 'No description'}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'medium':
        recommendations.push(`${issue.id}: [MEDIUM] ${issue.description || 'No description'}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      case 'low':
        recommendations.push(`${issue.id}: [LOW] ${issue.description || 'No description'}`);
        if (issue.suggestedFix) {
          recommendations.push(`  Fix: ${issue.suggestedFix}`);
        }
        break;
      default:
        recommendations.push(`${issue.id}: [UNKNOWN] ${issue.description || 'No description'}`);
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