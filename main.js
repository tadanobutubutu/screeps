import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = html.match(/<h([1-6])[^>]*>/g) || [];

  headings?.forEach(heading => {
    const headingLevel = parseInt(heading.match(/<h([1-6])/)[1], 10);
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

function addressIssuesFromInsightReport() {
  let content = dependencyGraphContent + indexContent;
  const results = addressAccessibilityIssues();

  const divElementsWithoutRole = content.match(/<div(?![^>]*role)[^>]*>/g) || [];
  let divsWithoutRoleCount = 0;
  
  divElementsWithoutRole.forEach(div => {
    divsWithoutRoleCount++;
  });

  if (divsWithoutRoleCount > 0) {
    throw new Error(`${divsWithoutRoleCount} <div> elements are missing ARIA roles.`);
  }

  // Update the summary values for consistency with original return shape
  results.summary += `, missing ARIA roles on <div> elements: ${divsWithoutRoleCount}`;

  // Add the lang attribute to the content
  content = `
    <html lang="en">
      ${content}
    </html>
  `;

  return results;
}

function addressAccessibilityIssues() {
  // ... (existing code)
  return { content: '', summary: '' };
}

// Exports remain unchanged
export { getHeadingLevels, addressAccessibilityIssues, addressIssuesFromInsightReport };