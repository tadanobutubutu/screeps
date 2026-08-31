// TODO: Implement function for addressing accessibility issues from insight report
// Function to address accessibility issues from insight report

function addressAccessibilityIssues(insightReport) {
  if (!insightReport || typeof insightReport !== 'object') {
    return;
  }

  const issues = Array.isArray(insightReport.issues)
    ? insightReport.issues
    : [];

  issues.forEach((issue) => {
    if (!issue || typeof issue !== 'object') {
      return;
    }

    switch (issue.type) {
      case 'missing-alt-text':
        fixMissingAltText(issue);
        break;
      case 'low-contrast':
        fixLowContrast(issue);
        break;
      case 'missing-label':
        fixMissingLabel(issue);
        break;
      case 'empty-heading':
        fixEmptyHeading(issue);
        break;
      default:
        break;
    }
  });
}

function fixMissingAltText(issue) {
  const elements = Array.isArray(issue.elements) ? issue.elements : [];
  elements.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && !el.hasAttribute('alt')) {
      el.setAttribute('alt', issue.suggestedAlt || '');
    }
  });
}

function fixLowContrast(issue) {
  const elements = Array.isArray(issue.elements) ? issue.elements : [];
  elements.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && issue.suggestedStyle) {
      el.style.color = issue.suggestedStyle.color || el.style.color;
      el.style.backgroundColor =
        issue.suggestedStyle.backgroundColor || el.style.backgroundColor;
    }
  });
}

function fixMissingLabel(issue) {
  const elements = Array.isArray(issue.elements) ? issue.elements : [];
  elements.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', issue.suggestedLabel || '');
    }
  });
}

function fixEmptyHeading(issue) {
  const elements = Array.isArray(issue.elements) ? issue.elements : [];
  elements.forEach((selector) => {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim() === '') {
      el.textContent = issue.suggestedText || 'Heading';
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addressAccessibilityIssues,
    fixMissingAltText,
    fixLowContrast,
    fixMissingLabel,
    fixEmptyHeading,
  };
}