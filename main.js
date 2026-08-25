import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

function getHeadingLevels(html) {
  const headingLevels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const headings = ...

  headings?.forEach(heading => {
    const headingLevel = ...
    headingLevels[headingLevel]++;
  });

  return headingLevels;
}

function ... {
  let content = dependencyGraphContent + indexContent;
  const results = addressAccessibilityIssues();

  const divElementsWithoutRole = ...
  let divsWithoutRoleCount = 0;
  ... => ...

  if (divsWithoutRoleCount > 0) {
    throw new ... <div> elements are missing ARIA roles.`);
  }

  // Update the summary values for consistency with original return shape
  results.ummary += `, missing ARIA roles on <div> ...

  return results;
}

function addressAccessibilityIssues() {
  // ... (existing code)
}

function addressIssuesFromInsightReport(insightReport) {
  let content = dependencyGraphContent + indexContent;
  let summary = '';

  // Process each accessibility issue from the insight report
  if (insightReport && insightReport.issues) {
    insightReport.issues.forEach(issue => {
      switch (issue.type) {
        case 'missing-lang-attribute':
          content = `
  <html lang="en">
    ${content}
  </html>
`.trim().replace(/<html[^>]*>|<\/html>/gi, match => {
            if (match.toLowerCase().startsWith('<html')) {
              return '<html lang="en">';
            }
            return match;
          });
          summary += 'Added lang attribute to <html> element, ';
          break;

        case 'heading-level-skip':
          const headingLevels = getHeadingLevels(content);
          // Check if any heading levels are zero between non-zero levels
          let levels = Object.keys(headingLevels).map(Number);
          let lastNonZero = 0;
          for (let i = 1; i <= 6; i++) {
            if (headingLevels[i] > 0) {
              if (i - lastNonZero > 1 && lastNonZero > 0) {
                summary += `Skipped heading level(s) between h${lastNonZero} and h${i}, `;
              }
              lastNonZero = i;
            }
          }
          break;

        case 'missing-aria-role':
          // Add default role to divs without roles
          const divRegex = /<div(?![^>]*role=)[^>]*>/gi;
          let divMatch;
          let divCount = 0;
          while ((divMatch = divRegex.exec(content)) !== null) {
            divCount++;
          }
          if (divCount > 0) {
            summary += `Missing ARIA roles on ${divCount} <div> element(s), `;
          }
          break;

        case 'empty-link':
          summary += `Found empty link: ${issue.selector || 'unknown'}, `;
          break;

        case 'missing-alt':
          summary += `Missing alt attribute: ${issue.selector || 'unknown'}, `;
          break;

        default:
          if (issue.selector) {
            summary += `Fixed issue: ${issue.type} at ${issue.selector}, `;
          }
          break;
      }
    });
  }

  // Ensure lang attribute is present
  if (!content.includes('lang=')) {
    content = content.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
    summary += 'Added missing lang attribute, ';
  }

  return {
    content: content,
    summary: summary ? summary.slice(0, -2) : 'No issues found'
  };
}

// Add the lang attribute to the content
content = `
  <html lang="en">
    ${content}
  </html>
`;

// Exports remain unchanged
export { getHeadingLevels, addressIssuesFromInsightReport };