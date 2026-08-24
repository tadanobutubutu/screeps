import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

// Function to fetch heading levels from the HTML content
function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = html.match(/<h[1-6][^>]*>/g);

  headings?.forEach(heading => {
    const headingLevel = parseInt(heading.slice(1));
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

// New function to address accessibility issues from insight report
function addressIssuesFromInsightReport() {
  // Combine content from both sources for accessibility checking
  let content = dependencyGraphContent + indexContent;

  // Call the existing accessibility checker function
  const results = addressAccessibilityIssues();

  // Address additional accessibility issues requested in the insight report
  // Example: let's assume the insight report identified missing ARIA roles on <div> elements (REACT_038)
  const divElementsWithoutRole = content.matchAll(/<div\b[^>]*>(?![@role|role=\s*["'][^"']+\b)/gi);
  let divsWithoutRoleCount = 0;
  divElementsWithoutRole.forEach(() => divsWithoutRoleCount++);

  if (divsWithoutRoleCount > 0) {
    throw new Error(`${divsWithoutRoleCount} <div> elements are missing ARIA roles.`);
  }

  // Update the summary values for consistency with original return shape
  results.summary += `, missing ARIA roles on <div> elements=${divsWithoutRoleCount}`;

  return results;
}

// Existing functions remain unchanged
function addressAccessibilityIssues() {
  // ... (existing code)
}

// Exports remain unchanged
export { getHeadingLevels, addressIssuesFromInsightReport };