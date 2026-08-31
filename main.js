// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Existing code preserved
function existingFunction() {
  // existing code
}

// Add new function to address the accessibility issue REACT_043: Make header focusable
function makeHeaderFocusable() {
  // code to make the header element focusable
  // Example: Adding tabindex to the header
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('tabindex', '0');
  }
}

// Add export statement of the new function
export { makeHeaderFocusable };

// Export statements preserved
export { existingFunction };

// New function requested in the issue
function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('main') || document.querySelector('[role="main"]');
  const primaryContentElement = primaryContent || document.createElement('main');

  if (!primaryContent) {
    // Create a new main element and wrap the primary content
    const newMain = document.createElement('main');
    newMain.setAttribute('role', 'main');
    newMain.id = 'main-content';

    // Move all top-level body children (excluding existing mains, headers, footers, etc.) into the new main
    const bodyChildren = document.body.children;
    const elementsToMove = [];
    for (let i = 0; i < bodyChildren.length; i++) {
      const child = bodyChildren[i];
      const tagName = child.tagName.toLowerCase();
      if (!['header', 'footer', 'nav', 'main', 'aside'].includes(tagName)) {
        elementsToMove.push(child);
      }
    }

    elementsToMove.forEach((element) => {
      newMain.appendChild(element);
    });

    document.body.appendChild(newMain);
  } else if (primaryContent) {
    // Ensure main has proper attributes
    if (!primaryContent.hasAttribute('role')) {
      primaryContent.setAttribute('role', 'main');
    }
    if (!primaryContent.id) {
      primaryContent.id = 'main-content';
    }
  }
}

export { wrapPrimaryContentInMain };

// New function or changes requested
function addressAccessibilityIssues(insightReport) {
  // Handle case where insightReport is null, undefined, or not an object
  if (!insightReport || typeof insightReport !== 'object') {
    console.warn('Invalid insight report provided to addressAccessibilityIssues');
    return;
  }

  const accessibilityIssues = insightReport.accessibility || [];

  if (!Array.isArray(accessibilityIssues) || accessibilityIssues.length === 0) {
    console.log('No accessibility issues found in the insight report');
    return;
  }

  console.log(`Found ${accessibilityIssues.length} accessibility issues:`);

  accessibilityIssues.forEach((issue, index) => {
    if (issue && typeof issue === 'object') {
      const description = issue.description || 'No description available';
      const severity = issue.severity || 'unknown';
      const impact = issue.impact || 'unknown';
      const selector = issue.selector || 'unknown selector';

      console.log(`Issue ${index + 1}:`);
      console.log(`  Description: ${description}`);
      console.log(`  Severity: ${severity}`);
      console.log(`  Impact: ${impact}`);
      console.log(`  Selector: ${selector}`);

      // Attempt to address the issue based on type
      if (issue.type) {
        switch (issue.type) {
          case 'color-contrast':
            console.log('  Action: Consider adjusting color contrast for better visibility');
            break;
          case 'alt-text':
            console.log('  Action: Add or improve alt text for images');
            break;
          case 'aria-label':
            console.log('  Action: Add or improve aria-label attributes');
            break;
          case 'heading-order':
            console.log('  Action: Review and fix heading hierarchy order');
            break;
          default:
            console.log(`  Action: Review and address ${issue.type} issue`);
        }
      }

      console.log('---');
    }
  });
}

// Export new function if necessary
export { addressAccessibilityIssues };