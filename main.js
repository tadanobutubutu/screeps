// main.js

// Function for addressing accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || !insightReport.issues) {
    return [];
  }

  return insightReport.issues.map(issue => {
    const addressed = { ...issue };
    addressed.addressed = true;
    addressed.resolution = getResolutionForType(issue.type);
    addressed.resolvedAt = new Date().toISOString();
    return addressed;
  });
}

function getResolutionForType(issueType) {
  const resolutions = {
    'alt-text': 'Add descriptive alt text to images',
    'contrast': 'Increase color contrast ratio to meet WCAG 2.1 AA standards',
    'labels': 'Add or improve form labels for accessibility',
    'keyboard': 'Ensure all interactive elements are keyboard accessible',
    'headings': 'Use proper heading hierarchy',
    'aria': 'Add or correct ARIA attributes'
  };
  
  return resolutions[issueType] || 'Review and address the accessibility issue';
}

module.exports = {
  addressAccessibilityIssues
};