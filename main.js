import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi);

  headings?.forEach(heading => {
    const headingLevel = parseInt(heading.match(/<h([1-6])/i)?.[1] || '0');
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

function addressIssuesFromInsightReport(content) {
  let content = dependencyGraphContent + indexContent;
  const results = addressAccessibilityIssues();

  const divElementsWithoutRole = content.match(/<div(?!.*role)[^>]*>/gi) || [];
  let divsWithoutRoleCount = divElementsWithoutRole.length;
  content = content.replace(/<div(?!.*role)[^>]*>/gi, (match) => {
    if (divsWithoutRoleCount > 0) {
      divsWithoutRoleCount--;
      return match.replace('>', ' role="presentation">');
    }
    return match;
  });

  if (divsWithoutRoleCount > 0) {
    throw new Error(`${divsWithoutRoleCount} <div> elements are missing ARIA roles.`);
  }

  // Update the summary values for consistency with original return shape
  results.summary += `, missing ARIA roles on <div> elements addressed`;

  return results;
}

function addressAccessibilityIssues() {
  let summary = '';
  const issues = [];

  // Check for missing lang attribute
  if (!content.includes('lang="')) {
    issues.push('Missing lang attribute on <html> element');
    content = content.replace('<html>', '<html lang="en">');
  }

  // Check heading hierarchy
  const headingLevels = getHeadingLevels(content);
  if (headingLevels[1] === 0) {
    issues.push('Missing h1 heading');
  }

  summary = issues.length > 0 ? issues.join('; ') : 'No issues found';

  return { summary, content };
}

// Add the lang attribute to the content
content = `
  <html lang="en">
    ${content}
  </html>
`;

// Exports remain unchanged
export { getHeadingLevels, addressIssuesFromInsightReport };