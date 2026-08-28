// main.js

// Function to check accessibility issues on a table element
function checkTableAccessibility(table) {
  const issues = [];
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      type: 'missing-caption',
      message: 'Tables should have a <caption> element for accessibility'
    });
  }
  
  // Check for proper header structure
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({
      type: 'no-headers',
      message: 'Tables with data should use <th> elements for headers'
    });
  }
  
  // Check for scope attributes on headers
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push({
        type: 'missing-scope',
        message: `Header at index ${index} should have a scope attribute`,
        element: th
      });
    }
  });
  
  return issues;
}

// Export the accessibility check function
module.exports = {
  checkTableAccessibility
};