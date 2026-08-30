// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: b2121df01283af5803b4e39b5a2143ecea635c8d_
<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

import insightApi from './insightApi';

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 47: // TODO: Implement function for addressing accessibility issues from insight report
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

// New function to ensure dependencyGraph container has proper ARIA role
export const ensureDependencyGraphARIA = (containerElement, role = 'region') => {
  if (!containerElement || typeof containerElement !== 'object') {
    return false;
  }

  // Set the ARIA role if not already present
  if (!containerElement.getAttribute('role')) {
    containerElement.setAttribute('role', role);
  }

  // Ensure the container has an accessible label
  if (!containerElement.getAttribute('aria-label') && !containerElement.getAttribute('aria-labelledby')) {
    containerElement.setAttribute('aria-label', 'Dependency Graph');
  }

  return true;
};

// Export a helper function to process accessibility recommendations
export const processAccessibilityRecommendations = (insightReport) => {
  const recommendations = addressAccessibilityIssues(insightReport);
  const ariaRecommendations = [];

  // Check for dependencyGraph specific issues
  const dependencyGraphIssues = recommendations.filter(rec => 
    rec.toLowerCase().includes('dependencygraph') || rec.toLowerCase().includes('dependency graph')
  );

  if (dependencyGraphIssues.length > 0) {
    ariaRecommendations.push({
      type: 'aria-role',
      element: 'dependencyGraph',
      recommendation: 'Ensure the dependencyGraph container has a proper ARIA role',
      suggestedRole: 'region'
    });
  }

  return {
    generalRecommendations: recommendations,
    ariaSpecific: ariaRecommendations
  };
};