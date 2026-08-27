/**
 * Processes accessibility issues from an insight report and generates appropriate fixes
 * @param {Object} insightReport - The insight report containing accessibility issues
 * @returns {Object} - Object containing fix recommendations and metadata
 */
function addressAccessibilityIssues(insightReport) {
  // Validate input
  if (!insightReport || typeof insightReport !== 'object') {
    return {
      success: false,
      error: 'Invalid insight report provided',
      fixes: []
    };
  }

  // Extract accessibility issues from the report
  const issues = extractAccessibilityIssues(insightReport);
  
  // Generate fixes for each issue
  const fixes = issues.map(issue => generateFixForIssue(issue));

  // Filter out any null/undefined fixes
  const validFixes = fixes.filter(fix => fix !== null && fix !== undefined);

  return {
    success: true,
    processedIssues: issues.length,
    totalFixes: validFixes.length,
    fixes: validFixes,
    timestamp: new Date().toISOString()
  };
}

/**
 * Extracts accessibility issues from an insight report
 * @param {Object} insightReport - The insight report
 * @returns {Array} - Array of accessibility issues
 */
function extractAccessibilityIssues(insightReport) {
  if (!insightReport) return [];

  // Common properties that might contain issues
  const possibleIssueFields = ['issues', 'accessibilityIssues', 'accessibility', 'findings'];
  
  for (const field of possibleIssueFields) {
    if (insightReport[field] && Array.isArray(insightReport[field])) {
      // Filter for accessibility-related issues
      return insightReport[field].filter(issue => 
        issue.category?.toLowerCase().includes('accessibility') ||
        issue.type?.toLowerCase().includes('accessibility') ||
        issue.severity?.toLowerCase().includes('accessibility') ||
        issue.impact?.toLowerCase().includes('accessibility') ||
        issue.tags?.some(tag => tag.toLowerCase().includes('accessibility'))
      );
    }
  }

  // If no structured issues found, check for generic issues that might include accessibility
  if (insightReport.issues && Array.isArray(insightReport.issues)) {
    return insightReport.issues.filter(issue => 
      isAccessibilityIssue(issue)
    );
  }

  return [];
}

/**
 * Determines if an issue is accessibility-related
 * @param {Object} issue - The issue object
 * @returns {boolean} - True if issue is accessibility-related
 */
function isAccessibilityIssue(issue) {
  if (!issue) return false;

  const issueText = JSON.stringify(issue).toLowerCase();
  const accessibilityKeywords = [
    'accessibility', 'a11y', 'screen reader', 'aria', 'alt text', 
    'contrast', 'keyboard navigation', 'focus', 'wcag'
  ];

  return accessibilityKeywords.some(keyword => issueText.includes(keyword));
}

/**
 * Generates a fix recommendation for an accessibility issue
 * @param {Object} issue - The accessibility issue
 * @returns {Object|null} - Fix recommendation or null if no fix available
 */
function generateFixForIssue(issue) {
  if (!issue || !issue.type && !issue.code) {
    return null;
  }

  // Common accessibility issue types and their fixes
  const issueType = (issue.type || issue.code || '').toLowerCase();
  const description = issue.description || issue.message || '';
  
  let fixRecommendation = null;
  
  // Handle common accessibility issues
  if (issueType.includes('image') || issueType.includes('img') || description.toLowerCase().includes('alt text')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Add descriptive alt text to images and decorative images should have empty alt attributes',
      category: 'image-alternatives',
      priority: 'high'
    };
  } else if (issueType.includes('contrast') || description.toLowerCase().includes('contrast')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Increase color contrast ratio to at least 4.5:1 for normal text and 3:1 for large text',
      category: 'color-contrast',
      priority: 'high'
    };
  } else if (issueType.includes('keyboard') || description.toLowerCase().includes('keyboard')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Ensure all interactive elements are accessible via keyboard navigation using Tab key',
      category: 'keyboard-navigation',
      priority: 'high'
    };
  } else if (issueType.includes('aria') || description.toLowerCase().includes('aria')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Add appropriate ARIA attributes to make dynamic content accessible to screen readers',
      category: 'aria-attributes',
      priority: 'medium'
    };
  } else if (issueType.includes('heading') || description.toLowerCase().includes('heading')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Use proper heading hierarchy (h1-h6) to structure content logically',
      category: 'heading-structure',
      priority: 'medium'
    };
  } else if (issueType.includes('form') || description.toLowerCase().includes('label')) {
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Associate form controls with explicit labels using the label element or aria-label attribute',
      category: 'form-labels',
      priority: 'medium'
    };
  } else {
    // Generic recommendation for other accessibility issues
    fixRecommendation = {
      issueId: issue.id || issue.code,
      issueType: issue.type || issue.code,
      description: description,
      severity: issue.severity || 'medium',
      recommendation: 'Review WCAG guidelines for this issue: https://www.w3.org/WAI/WCAG21/quickref/',
      category: 'general-accessibility',
      priority: 'medium'
    };
  }

  return fixRecommendation;
}

// Export the main function
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addressAccessibilityIssues,
    extractAccessibilityIssues,
    generateFixForIssue,
    isAccessibilityIssue
  };
}