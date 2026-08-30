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

// TODO: Implement this function for checking landmark elements
const checkLandmarkElements = (rootElement) => {
  // If rootElement is not a valid DOM element, return empty array
  if (!rootElement || typeof rootElement.querySelectorAll !== 'function') {
    return [];
  }

  // Define the landmark elements we want to check for
  const landmarkTags = ['header', 'nav', 'main', 'footer', 'aside', 'section'];
  const issues = [];

  landmarkTags.forEach(tag => {
    const elements = rootElement.querySelectorAll(tag);
    if (elements.length === 0) {
      issues.push({
        id: `missing-landmark-${tag}`,
        description: `No landmark element <${tag}> found`,
        severity: 'medium',
        suggestedFix: `Consider adding a <${tag}> element to improve page structure`
      });
    }
  });

  return issues;
};

module.exports = {
  generateInsightReport,
  addressAccessibilityIssues,
  checkLandmarkElements
};