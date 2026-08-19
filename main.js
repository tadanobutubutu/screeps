// This would be the updated main.js content
// Since we don't have the actual content, here's what we'd do for the table structure fix:

// For the docs/dependency-graph.html file, we'd need to find all <th> elements without scope attributes
// and add scope="col" or scope="row" as appropriate

// Example fix for one line:
// Before: <th>No scope attribute</th>
// After: <th scope="col">With scope attribute</th>

// Additionally, we'll ensure all tables have proper caption elements for screen readers

// Here's a function that could be added to process tables in the HTML:

function ensureTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const scopedHtml = htmlContent.replace(
    /<th>(.*?)<\/th>/g,
    (match, content) => {
      // Default to column scope unless it's clearly a row header
      const scope = content.toLowerCase().includes('row') ? 'row' : 'col';
      return `<th scope="${scope}">${content}</th>`;
    }
  );

  // Ensure tables have captions
  return scopedHtml.replace(
    /<table>/g,
    '<table><caption>Table description for screen readers</caption>'
  );
}

// Note: In a real implementation, you would want to:
// 1. Make the caption more specific to each table's content
// 2. Handle cases where tables might already have captions
// 3. Consider adding aria-label attributes for complex tables