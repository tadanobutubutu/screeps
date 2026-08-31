/**
 * Main entry point for the application
 */

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.type = 'button';
  button.addEventListener('click', onClickHandler);
  
  // Accessibility improvements
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  
  // Add keyboard support for accessibility
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClickHandler(e);
    }
  });
  
  return button;
}

// Example usage (if needed):
// const btn = createInPageButton('Click Me', () => console.log('Clicked'));
// ...

export { createInPageButton };

function analyzeAccessibility(issuesData) {
  // Analyze and categorize accessibility issues
  const results = {
    critical: [],
    serious: [],
    moderate: [],
    minor: []
  };
  
  if (issuesData && Array.isArray(issuesData)) {
    issuesData.forEach(issue => {
      const severity = issue.severity || 'minor';
      if (results[severity]) {
        results[severity].push(issue);
      }
    });
  }
  
  return results;
}

function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData);

  // Define the structure of the report here
  const report = {
    introduction: 'Accessibility report for the application',
    data: analyzedIssues,
    conclusions: '',
  };

  // Fill the report's data and conclusions
  // Generate conclusions based on analyzed issues
  const totalIssues = Object.values(analyzedIssues).reduce((sum, arr) => sum + arr.length, 0);
  
  if (totalIssues === 0) {
    report.conclusions = 'No accessibility issues detected.';
  } else {
    report.conclusions = `Found ${totalIssues} accessibility issues requiring attention.`;
  }

  // Return the final report
  return report;
}

// Export the report function as well
export { generateAccessibilityReport };