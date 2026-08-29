Here is the resolved version of the file 'main.js':

```javascript
const insightApi = require('./insightApi');

// TODO: Implement function for addressing accessibility issues from insight report
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

// Additional utility functions for accessibility
function getLangAttribute() {
  // Implementation for REACT_015: Add lang attribute to HTML element
  // ...
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export all functions
module.exports = {
  generateInsightReport,
  addressAccessibilityIssues,
  getLangAttribute,
  calculateSum
};
```

This version of the file combines both changes from the two branches. It keeps both the `generateInsightReport` and the `addressAccessibilityIssues` functions, and also includes the original utility functions `getLangAttribute` and `calculateSum`. The other functions seem to be related to a specific library or framework, so they were not incorporated, but the initial implementation for the `getLangAttribute` function was left as a placeholder.