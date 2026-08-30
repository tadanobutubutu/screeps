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

const addLangAttribute = (htmlElement) => {
  if (!htmlElement) return;

  // Check if lang attribute is already set
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Function to add lang attribute to HTML element in the DOM
const applyLangAttributeToHTML = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    addLangAttribute(htmlElement);
  }
};

// Function to address other accessibility changes as per the insight report
const addressAdditionalAccessibilityChanges = (insightReport) => {
  // Placeholder for additional accessibility changes based on the insight report
  // This is where you would add the code to address other issues as identified in the report.
};

module.exports = {
  generateInsightReport,
  addressAccessibilityIssues,
  applyLangAttributeToHTML,
  addressAdditionalAccessibilityChanges
};