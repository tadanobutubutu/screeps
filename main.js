import { dependencyGraphContent, indexContent } from './content';

// Address accessibility issues from insight report
function addressAccessibilityIssues(insightReport) {
  if (!insightReport || typeof insightReport !== 'object') {
    return {
      success: false,
      message: 'Invalid insight report format'
    };
  }

  const fixes = [];
  const issues = insightReport.issues || [];

  issues.forEach(issue => {
    const fix = generateAccessibilityFix(issue);
    if (fix) {
      fixes.push(fix);
    }
  });

  return {
    success: true,
    fixes: fixes,
    summary: `Addressed ${fixes.length} accessibility issues`
  };
}

function generateAccessibilityFix(issue) {
  if (!issue || !issue.type) {
    return null;
  }

  const fix = {
    originalIssue: issue,
    description: '',
    codeChange: null
  };

  switch (issue.type) {
    case 'color-contrast':
      fix.description = 'Improve color contrast for better visibility';
      fix.codeChange = generateColorContrastFix(issue);
      break;
    case 'missing-alt':
      fix.description = 'Add alt text to images for screen readers';
      fix.codeChange = generateAltTextFix(issue);
      break;
    case 'missing-aria-label':
      fix.description = 'Add aria-label for better accessibility';
      fix.codeChange = generateAriaLabelFix(issue);
      break;
    case 'heading-order':
      fix.description = 'Fix heading hierarchy for proper document structure';
      fix.codeChange = generateHeadingOrderFix(issue);
      break;
    case 'missing-form-label':
      fix.description = 'Associate form labels with their inputs';
      fix.codeChange = generateFormLabelFix(issue);
      break;
    case 'keyboard-navigation':
      fix.description = 'Improve keyboard navigation support';
      fix.codeChange = generateKeyboardFix(issue);
      break;
    case 'focus-indicator':
      fix.description = 'Ensure focus indicators are visible';
      fix.codeChange = generateFocusIndicatorFix(issue);
      break;
    default:
      fix.description = `Address ${issue.type} accessibility issue`;
      fix.codeChange = generateGenericAccessibilityFix(issue);
  }

  return fix;
}

function generateColorContrastFix(issue) {
  return {
    type: 'style',
    recommendation: 'Increase contrast ratio to at least 4.5:1 for normal text',
    currentContrast: issue.currentRatio || 'unknown',
    recommendedColors: issue.suggestedColors || {
      foreground: '#000000',
      background: '#FFFFFF'
    }
  };
}

function generateAltTextFix(issue) {
  return {
    type: 'attribute',
    element: issue.element || 'img',
    attribute: 'alt',
    value: issue.suggestedAlt || 'Des